package com.wheremoney.modules.account.vo;

public record AccountResponse(
    String id,
    String name,
    String type,
    String currency,
    String initialBalance,
    String currentBalance,
    String color,
    String icon,
    String status) {}
