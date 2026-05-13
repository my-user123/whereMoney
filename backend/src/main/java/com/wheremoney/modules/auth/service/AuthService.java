package com.wheremoney.modules.auth.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wheremoney.common.enums.CurrencyCode;
import com.wheremoney.common.enums.ResourceStatus;
import com.wheremoney.common.exception.BusinessException;
import com.wheremoney.common.response.ResponseCode;
import com.wheremoney.common.security.JwtService;
import com.wheremoney.modules.auth.dto.CodeLoginRequest;
import com.wheremoney.modules.auth.dto.LoginRequest;
import com.wheremoney.modules.auth.dto.RegisterRequest;
import com.wheremoney.modules.auth.dto.VerificationCodeRequest;
import com.wheremoney.modules.auth.vo.AuthResponse;
import com.wheremoney.modules.auth.vo.VerificationCodeResponse;
import com.wheremoney.modules.category.service.CategoryService;
import com.wheremoney.modules.emailcodeverification.service.VerificationEmailService;
import com.wheremoney.modules.user.entity.UserEntity;
import com.wheremoney.modules.user.entity.UserProfileEntity;
import com.wheremoney.modules.user.mapper.UserMapper;
import com.wheremoney.modules.user.mapper.UserProfileMapper;
import com.wheremoney.modules.user.service.UserService;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private static final int CODE_TTL_SECONDS = 60;

  private final UserMapper userMapper;
  private final UserProfileMapper profileMapper;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserService userService;
  private final CategoryService categoryService;
  private final SecureRandom secureRandom = new SecureRandom();
  private final StringRedisTemplate stringRedisTemplate;
  private final VerificationEmailService verificationEmailService;

  public AuthService(
      UserMapper userMapper,
      UserProfileMapper profileMapper,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      UserService userService,
      CategoryService categoryService,
      StringRedisTemplate stringRedisTemplate,
      VerificationEmailService verificationEmailService) {
    this.userMapper = userMapper;
    this.profileMapper = profileMapper;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.userService = userService;
    this.categoryService = categoryService;
    this.stringRedisTemplate = stringRedisTemplate;
    this.verificationEmailService = verificationEmailService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    String email = normalizeEmail(request.email());
    Long count =
        userMapper.selectCount(
            new LambdaQueryWrapper<UserEntity>().eq(UserEntity::getEmail, email));
    if (count > 0) {
      throw new BusinessException(ResponseCode.EMAIL_EXISTS);
    }

    UserEntity user = new UserEntity();
    user.setEmail(email);
    user.setUsername(defaultUsername(email));
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setStatus(ResourceStatus.ACTIVE.name());
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(user.getCreatedAt());
    userMapper.insert(user);

    UserProfileEntity profile = new UserProfileEntity();
    profile.setUserId(user.getId());
    profile.setNickname(user.getUsername());
    profile.setDefaultCurrency(CurrencyCode.CNY);
    profile.setTimezone("Asia/Shanghai");
    profile.setCreatedAt(LocalDateTime.now());
    profile.setUpdatedAt(profile.getCreatedAt());
    profileMapper.insert(profile);

    categoryService.initializeDefaults(user.getId());

    String token = jwtService.generateToken(user.getId(), user.getUsername());
    return new AuthResponse(token, userService.toResponse(user, profile));
  }

  @Transactional
  public AuthResponse login(LoginRequest request) {
    String email = normalizeEmail(request.email());
    UserEntity user =
        userMapper.selectOne(new LambdaQueryWrapper<UserEntity>().eq(UserEntity::getEmail, email));
    if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
      throw new BusinessException(ResponseCode.INVALID_CREDENTIALS);
    }
    return issueToken(user);
  }

  @Transactional
  public AuthResponse loginWithCode(CodeLoginRequest request) {
    String email = normalizeEmail(request.email());
    String key = verificationCodeKey(email);
    String verificationCode = stringRedisTemplate.opsForValue().get(key);
    if (verificationCode == null || !verificationCode.equals(request.code())) {
      stringRedisTemplate.delete(key);
      throw new BusinessException(ResponseCode.INVALID_CREDENTIALS);
    }

    UserEntity user =
        userMapper.selectOne(new LambdaQueryWrapper<UserEntity>().eq(UserEntity::getEmail, email));
    if (user == null) {
      throw new BusinessException(ResponseCode.INVALID_CREDENTIALS);
    }
    stringRedisTemplate.delete(key);
    return issueToken(user);
  }

  public VerificationCodeResponse createVerificationCode(VerificationCodeRequest request) {
    String email = normalizeEmail(request.email());
    String code = String.format("%06d", secureRandom.nextInt(1_000_000));
    String key = verificationCodeKey(email);
    stringRedisTemplate.opsForValue().set(key, code, Duration.ofSeconds(CODE_TTL_SECONDS));
    try {
      verificationEmailService.sendLoginCode(email, code, CODE_TTL_SECONDS);
    } catch (BusinessException exception) {
      stringRedisTemplate.delete(key);
      throw exception;
    }
    return new VerificationCodeResponse(CODE_TTL_SECONDS);
  }

  private AuthResponse issueToken(UserEntity user) {
    user.setLastLoginAt(LocalDateTime.now());
    user.setUpdatedAt(user.getLastLoginAt());
    userMapper.updateById(user);

    UserProfileEntity profile =
        profileMapper.selectOne(
            new LambdaQueryWrapper<UserProfileEntity>()
                .eq(UserProfileEntity::getUserId, user.getId()));
    String token = jwtService.generateToken(user.getId(), user.getUsername());
    return new AuthResponse(token, userService.toResponse(user, profile));
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase(Locale.ROOT);
  }

  private String defaultUsername(String email) {
    String username = email.substring(0, email.indexOf("@"));
    return username.length() > 64 ? username.substring(0, 64) : username;
  }

  private String verificationCodeKey(String email) {
    return "auth:login-code:" + email;
  }
}
