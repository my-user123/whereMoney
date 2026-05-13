package com.wheremoney.modules.transaction.dto;

import java.time.LocalDate;

public record TransactionQuery(
    long page,
    long size,
    String type,
    String currency,
    Long accountId,
    Long categoryId,
    LocalDate startDate,
    LocalDate endDate) {

  public TransactionQuery {
    if (page < 1) {
      page = 1;
    }
    if (size < 1 || size > 100) {
      size = 20;
    }
  }
}
