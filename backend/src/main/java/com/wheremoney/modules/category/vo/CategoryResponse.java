package com.wheremoney.modules.category.vo;

public record CategoryResponse(
    String id,
    String name,
    String type,
    String icon,
    String color,
    Boolean isSystem,
    String status) {}
