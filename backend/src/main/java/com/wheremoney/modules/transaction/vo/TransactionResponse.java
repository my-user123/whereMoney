package com.wheremoney.modules.transaction.vo;

public record TransactionResponse(
    String id,
    String type,
    String amount,
    String currency,
    String occurredAt,
    SimpleRef account,
    CategoryRef category,
    String note,
    String source) {

  public record SimpleRef(String id, String name) {}

  public record CategoryRef(String id, String name, String icon, String color) {}
}
