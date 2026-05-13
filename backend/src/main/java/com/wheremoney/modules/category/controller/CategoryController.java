package com.wheremoney.modules.category.controller;

import com.wheremoney.common.response.ApiResponse;
import com.wheremoney.common.security.SecurityUtils;
import com.wheremoney.modules.category.dto.CategoryRequest;
import com.wheremoney.modules.category.service.CategoryService;
import com.wheremoney.modules.category.vo.CategoryResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping
  public ApiResponse<List<CategoryResponse>> list(
      @RequestParam(required = false) String type, @RequestParam(required = false) String status) {
    return ApiResponse.success(categoryService.list(SecurityUtils.currentUserId(), type, status));
  }

  @PostMapping
  public ApiResponse<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
    return ApiResponse.success(categoryService.create(SecurityUtils.currentUserId(), request));
  }

  @PutMapping("/{categoryId}")
  public ApiResponse<CategoryResponse> update(
      @PathVariable Long categoryId, @Valid @RequestBody CategoryRequest request) {
    return ApiResponse.success(
        categoryService.update(SecurityUtils.currentUserId(), categoryId, request));
  }

  @PatchMapping("/{categoryId}/disable")
  public ApiResponse<Void> disable(@PathVariable Long categoryId) {
    categoryService.disable(SecurityUtils.currentUserId(), categoryId);
    return ApiResponse.success();
  }
}
