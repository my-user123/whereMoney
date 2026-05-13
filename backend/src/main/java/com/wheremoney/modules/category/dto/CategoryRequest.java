package com.wheremoney.modules.category.dto;

import com.wheremoney.common.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
    @NotBlank @Size(max = 64) String name,
    @NotNull TransactionType type,
    @Size(max = 64) String icon,
    @Size(max = 32) String color) {}
