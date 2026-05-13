package com.wheremoney.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CodeLoginRequest(
    @NotBlank @Email @Size(max = 120) String email,
    @NotBlank @Pattern(regexp = "^\\d{6}$") String code) {}
