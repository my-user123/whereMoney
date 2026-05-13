package com.wheremoney.modules.auth.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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
import com.wheremoney.modules.user.entity.UserEntity;
import com.wheremoney.modules.user.entity.UserProfileEntity;
import com.wheremoney.modules.user.mapper.UserMapper;
import com.wheremoney.modules.user.mapper.UserProfileMapper;
import com.wheremoney.modules.user.service.UserService;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
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
  private final Map<String, VerificationCode> verificationCodes = new ConcurrentHashMap<>();

  public AuthService(
      UserMapper userMapper,
      UserProfileMapper profileMapper,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      UserService userService,
      CategoryService categoryService) {
    this.userMapper = userMapper;
    this.profileMapper = profileMapper;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.userService = userService;
    this.categoryService = categoryService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    String email = normalizeEmail(request.email());
    Long count =
        userMapper.selectCount(
            new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getUsername, email)
                .isNull(UserEntity::getDeletedAt));
    if (count > 0) {
      throw new BusinessException(ResponseCode.USERNAME_EXISTS);
    }

    UserEntity user = new UserEntity();
    user.setUsername(email);
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setStatus(ResourceStatus.ACTIVE.name());
    user.setCreatedAt(LocalDateTime.now());
    user.setUpdatedAt(user.getCreatedAt());
    userMapper.insert(user);

    UserProfileEntity profile = new UserProfileEntity();
    profile.setUserId(user.getId());
    profile.setNickname(email.substring(0, email.indexOf("@")));
    profile.setDefaultCurrency("CNY");
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
        userMapper.selectOne(
            new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getUsername, email)
                .isNull(UserEntity::getDeletedAt));
    if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new BusinessException(ResponseCode.INVALID_CREDENTIALS);
    }
    return issueToken(user);
  }

  @Transactional
  public AuthResponse loginWithCode(CodeLoginRequest request) {
    String email = normalizeEmail(request.email());
    VerificationCode verificationCode = verificationCodes.get(email);
    if (verificationCode == null
        || verificationCode.expiresAt().isBefore(LocalDateTime.now())
        || !verificationCode.code().equals(request.code())) {
      verificationCodes.remove(email);
      throw new BusinessException(ResponseCode.INVALID_CREDENTIALS);
    }

    UserEntity user =
        userMapper.selectOne(
            new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getUsername, email)
                .isNull(UserEntity::getDeletedAt));
    if (user == null) {
      throw new BusinessException(ResponseCode.INVALID_CREDENTIALS);
    }
    verificationCodes.remove(email);
    return issueToken(user);
  }

  public VerificationCodeResponse createVerificationCode(VerificationCodeRequest request) {
    String email = normalizeEmail(request.email());
    String code = String.format("%06d", secureRandom.nextInt(1_000_000));
    verificationCodes.put(email, new VerificationCode(code, LocalDateTime.now().plusSeconds(CODE_TTL_SECONDS)));
    return new VerificationCodeResponse(CODE_TTL_SECONDS, code);
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

  private record VerificationCode(String code, LocalDateTime expiresAt) {}
}
