package com.wheremoney.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VerificationCodeRequest(@NotBlank @Email @Size(max = 120) String email) {}
