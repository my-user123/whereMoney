package com.wheremoney.modules.user.dto;

import com.wheremoney.common.enums.CurrencyCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @NotBlank @Size(max = 64) String nickname,
    @Size(max = 512) String avatarUrl,
    @NotNull CurrencyCode defaultCurrency,
    @Size(max = 64) String userType,
    @NotBlank @Size(max = 64) String timezone) {}
