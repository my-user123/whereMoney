package com.wheremoney.modules.category.model;

import com.wheremoney.common.enums.TransactionType;
import com.wheremoney.modules.category.vo.CategoryTemplateResponse;
import java.util.ArrayList;
import java.util.List;

public class CategoryTemplate {

  private final String key;
  private final String name;
  private final TransactionType type;
  private final String icon;
  private final String color;
  private final int sortOrder;
  private final List<CategoryTemplate> children = new ArrayList<>();
  private CategoryTemplate parent;

  public CategoryTemplate(
      String key, String name, TransactionType type, String icon, String color, int sortOrder) {
    this.key = key;
    this.name = name;
    this.type = type;
    this.icon = icon;
    this.color = color;
    this.sortOrder = sortOrder;
  }

  public CategoryTemplate addChildren(CategoryTemplate... templates) {
    for (CategoryTemplate template : templates) {
      template.parent = this;
      children.add(template);
    }
    return this;
  }

  public CategoryTemplateResponse toResponse() {
    return new CategoryTemplateResponse(
        key,
        name,
        type.name(),
        icon,
        color,
        children.stream().map(CategoryTemplate::toResponse).toList());
  }

  public String key() {
    return key;
  }

  public String name() {
    return name;
  }

  public TransactionType type() {
    return type;
  }

  public String icon() {
    return icon;
  }

  public String color() {
    return color;
  }

  public int sortOrder() {
    return sortOrder;
  }

  public List<CategoryTemplate> children() {
    return children;
  }

  public CategoryTemplate parent() {
    return parent;
  }
}
