package com.wheremoney.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @NotBlank @Size(max = 64) String nickname,
    @Size(max = 512) String avatarUrl,
    @NotBlank @Pattern(regexp = "^[A-Z]{3}$") String defaultCurrency,
    @Size(max = 64) String userType,
    @NotBlank @Size(max = 64) String timezone) {}
