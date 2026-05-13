package com.wheremoney.modules.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wheremoney.common.security.SecurityUtils;
import com.wheremoney.modules.user.dto.UpdateProfileRequest;
import com.wheremoney.modules.user.entity.UserEntity;
import com.wheremoney.modules.user.entity.UserProfileEntity;
import com.wheremoney.modules.user.mapper.UserMapper;
import com.wheremoney.modules.user.mapper.UserProfileMapper;
import com.wheremoney.modules.user.vo.UserMeResponse;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

  private final UserMapper userMapper;
  private final UserProfileMapper profileMapper;

  public UserService(UserMapper userMapper, UserProfileMapper profileMapper) {
    this.userMapper = userMapper;
    this.profileMapper = profileMapper;
  }

  public UserMeResponse currentUser() {
    Long userId = SecurityUtils.currentUserId();
    UserEntity user = userMapper.selectById(userId);
    UserProfileEntity profile =
        profileMapper.selectOne(
            new LambdaQueryWrapper<UserProfileEntity>().eq(UserProfileEntity::getUserId, userId));
    return toResponse(user, profile);
  }

  @Transactional
  public UserMeResponse updateProfile(UpdateProfileRequest request) {
    Long userId = SecurityUtils.currentUserId();
    UserEntity user = userMapper.selectById(userId);
    UserProfileEntity profile =
        profileMapper.selectOne(
            new LambdaQueryWrapper<UserProfileEntity>().eq(UserProfileEntity::getUserId, userId));
    profile.setNickname(request.nickname());
    profile.setAvatarUrl(request.avatarUrl());
    profile.setDefaultCurrency(request.defaultCurrency());
    profile.setUserType(request.userType());
    profile.setTimezone(request.timezone());
    profile.setUpdatedAt(LocalDateTime.now());
    profileMapper.updateById(profile);
    return toResponse(user, profile);
  }

  public UserMeResponse toResponse(UserEntity user, UserProfileEntity profile) {
    return new UserMeResponse(
        String.valueOf(user.getId()),
        user.getEmail(),
        user.getUsername(),
        profile.getAvatarUrl(),
        profile.getDefaultCurrency().code(),
        profile.getUserType(),
        profile.getTimezone());
  }
}
