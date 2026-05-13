package com.wheremoney.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record LoginRequest(@NotBlank @Email @jakarta.validation.constraints.Size(max = 120) String email, @NotBlank String password) {}
