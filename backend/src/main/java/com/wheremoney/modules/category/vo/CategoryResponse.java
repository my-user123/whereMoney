package com.wheremoney.modules.category.vo;

public record CategoryResponse(
    String id,
    String parentId,
    String name,
    String type,
    String icon,
    String color,
    String status) {}
