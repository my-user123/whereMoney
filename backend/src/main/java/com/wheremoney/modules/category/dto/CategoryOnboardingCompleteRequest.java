package com.wheremoney.modules.category.dto;

import com.wheremoney.common.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CategoryOnboardingCompleteRequest(
    @Size(max = 80) List<@Size(max = 64) String> selectedKeys,
    @Size(max = 40) List<CustomCategoryRequest> customCategories) {

  public record CustomCategoryRequest(
      @Size(max = 64) String parentKey,
      @NotBlank @Size(max = 64) String name,
      @NotNull TransactionType type,
      @Size(max = 64) String icon,
      @Size(max = 32) String color) {}
}
