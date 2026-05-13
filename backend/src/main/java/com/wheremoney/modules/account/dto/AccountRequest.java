package com.wheremoney.modules.account.dto;

import com.wheremoney.common.enums.AccountType;
import com.wheremoney.common.enums.CurrencyCode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AccountRequest(
    @NotBlank @Size(max = 64) String name,
    @NotNull AccountType type,
    @NotNull CurrencyCode currency,
    @NotNull @DecimalMin("0.00") BigDecimal initialBalance,
    @Size(max = 32) String color,
    @Size(max = 64) String icon) {}
