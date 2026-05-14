package com.wheremoney.modules.user.vo;

public record UserMeResponse(
    String id,
    String email,
    String username,
    String nickname,
    String avatarUrl,
    String defaultCurrency,
    String userType,
    String timezone,
    Boolean isNewUserFirstLogin) {}
