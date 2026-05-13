package com.wheremoney.modules.auth.vo;

import com.wheremoney.modules.user.vo.UserMeResponse;

public record AuthResponse(String token, UserMeResponse user) {}
