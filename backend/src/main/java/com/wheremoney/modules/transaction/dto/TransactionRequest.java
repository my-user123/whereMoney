package com.wheremoney.modules.transaction.dto;

import com.wheremoney.common.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionRequest(
    @NotNull TransactionType type,
    @NotNull @DecimalMin("0.01") BigDecimal amount,
    String currency,
    @NotNull Long accountId,
    @NotNull Long categoryId,
    @NotNull LocalDateTime occurredAt,
    @Size(max = 500) String note) {}
