package com.wheremoney.modules.user.vo;

public record UserMeResponse(
    String id,
    String email,
    String username,
    String avatarUrl,
    String defaultCurrency,
    String userType,
    String timezone) {}
