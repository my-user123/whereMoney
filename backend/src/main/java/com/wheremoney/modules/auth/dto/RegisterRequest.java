package com.wheremoney.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(max = 64) String username,
    @NotBlank @Size(min = 6, max = 72) String password,
    @NotBlank @Size(max = 64) String nickname,
    @NotBlank @Pattern(regexp = "^[A-Z]{3}$") String defaultCurrency) {}
