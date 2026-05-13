package com.wheremoney.modules.transaction.vo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionView(
    Long id,
    String type,
    BigDecimal amount,
    String currency,
    LocalDateTime occurredAt,
    Long accountId,
    String accountName,
    Long categoryId,
    String categoryName,
    String categoryIcon,
    String categoryColor,
    String note,
    String source) {}
