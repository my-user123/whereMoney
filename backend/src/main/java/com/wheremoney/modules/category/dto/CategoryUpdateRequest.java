package com.wheremoney.modules.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryUpdateRequest(
    @NotBlank @Size(max = 64) String name,
    @Size(max = 64) String icon,
    @Size(max = 32) String color) {}
