package com.wheremoney.modules.category.vo;

import java.util.List;

public record CategoryTemplateResponse(
    String key,
    String name,
    String type,
    String icon,
    String color,
    List<CategoryTemplateResponse> children) {}
