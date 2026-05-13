package com.wheremoney.modules.category.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wheremoney.common.enums.ResourceStatus;
import com.wheremoney.common.enums.TransactionType;
import com.wheremoney.common.exception.BusinessException;
import com.wheremoney.common.response.ResponseCode;
import com.wheremoney.modules.category.dto.CategoryRequest;
import com.wheremoney.modules.category.entity.CategoryEntity;
import com.wheremoney.modules.category.mapper.CategoryMapper;
import com.wheremoney.modules.category.vo.CategoryResponse;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

  private final CategoryMapper categoryMapper;

  public CategoryService(CategoryMapper categoryMapper) {
    this.categoryMapper = categoryMapper;
  }

  @Transactional
  public void initializeDefaults(Long userId) {
    createDefault(userId, "工资", TransactionType.INCOME, "wallet", "#22C55E", 1);
    createDefault(userId, "兼职", TransactionType.INCOME, "briefcase", "#16A34A", 2);
    createDefault(userId, "餐饮", TransactionType.EXPENSE, "utensils", "#F97316", 1);
    createDefault(userId, "交通", TransactionType.EXPENSE, "bus", "#3B82F6", 2);
    createDefault(userId, "住房", TransactionType.EXPENSE, "home", "#A16207", 3);
    createDefault(userId, "购物", TransactionType.EXPENSE, "shopping-bag", "#EC4899", 4);
    createDefault(userId, "娱乐", TransactionType.EXPENSE, "music", "#8B5CF6", 5);
    createDefault(userId, "学习", TransactionType.EXPENSE, "book", "#0EA5E9", 6);
    createDefault(userId, "医疗", TransactionType.EXPENSE, "heart-pulse", "#EF4444", 7);
  }

  public List<CategoryResponse> list(Long userId, String type, String status) {
    LambdaQueryWrapper<CategoryEntity> wrapper =
        new LambdaQueryWrapper<CategoryEntity>()
            .eq(CategoryEntity::getUserId, userId)
            .isNull(CategoryEntity::getDeletedAt)
            .orderByAsc(CategoryEntity::getType)
            .orderByAsc(CategoryEntity::getSortOrder)
            .orderByDesc(CategoryEntity::getCreatedAt);
    if (type != null && !type.isBlank()) {
      wrapper.eq(CategoryEntity::getType, type);
    }
    if (status != null && !status.isBlank()) {
      wrapper.eq(CategoryEntity::getStatus, status);
    }
    return categoryMapper.selectList(wrapper).stream().map(this::toResponse).toList();
  }

  @Transactional
  public CategoryResponse create(Long userId, CategoryRequest request) {
    CategoryEntity entity = new CategoryEntity();
    entity.setUserId(userId);
    entity.setName(request.name());
    entity.setType(request.type().name());
    entity.setIcon(request.icon());
    entity.setColor(request.color());
    entity.setIsSystem(false);
    entity.setSortOrder(100);
    entity.setStatus(ResourceStatus.ACTIVE.name());
    entity.setCreatedAt(LocalDateTime.now());
    entity.setUpdatedAt(entity.getCreatedAt());
    categoryMapper.insert(entity);
    return toResponse(entity);
  }

  @Transactional
  public CategoryResponse update(Long userId, Long categoryId, CategoryRequest request) {
    CategoryEntity entity = requireOwned(userId, categoryId);
    entity.setName(request.name());
    entity.setType(request.type().name());
    entity.setIcon(request.icon());
    entity.setColor(request.color());
    entity.setUpdatedAt(LocalDateTime.now());
    categoryMapper.updateById(entity);
    return toResponse(entity);
  }

  @Transactional
  public void disable(Long userId, Long categoryId) {
    CategoryEntity entity = requireOwned(userId, categoryId);
    entity.setStatus(ResourceStatus.DISABLED.name());
    entity.setUpdatedAt(LocalDateTime.now());
    categoryMapper.updateById(entity);
  }

  public CategoryEntity requireActive(Long userId, Long categoryId, String type) {
    CategoryEntity entity = requireOwned(userId, categoryId);
    if (!ResourceStatus.ACTIVE.name().equals(entity.getStatus())
        || !type.equals(entity.getType())) {
      throw new BusinessException(ResponseCode.CATEGORY_UNAVAILABLE);
    }
    return entity;
  }

  private CategoryEntity requireOwned(Long userId, Long categoryId) {
    CategoryEntity entity =
        categoryMapper.selectOne(
            new LambdaQueryWrapper<CategoryEntity>()
                .eq(CategoryEntity::getId, categoryId)
                .eq(CategoryEntity::getUserId, userId)
                .isNull(CategoryEntity::getDeletedAt));
    if (entity == null) {
      throw new BusinessException(ResponseCode.CATEGORY_UNAVAILABLE);
    }
    return entity;
  }

  private void createDefault(
      Long userId, String name, TransactionType type, String icon, String color, int sortOrder) {
    CategoryEntity entity = new CategoryEntity();
    entity.setUserId(userId);
    entity.setName(name);
    entity.setType(type.name());
    entity.setIcon(icon);
    entity.setColor(color);
    entity.setIsSystem(true);
    entity.setSortOrder(sortOrder);
    entity.setStatus(ResourceStatus.ACTIVE.name());
    entity.setCreatedAt(LocalDateTime.now());
    entity.setUpdatedAt(entity.getCreatedAt());
    categoryMapper.insert(entity);
  }

  private CategoryResponse toResponse(CategoryEntity entity) {
    return new CategoryResponse(
        String.valueOf(entity.getId()),
        entity.getName(),
        entity.getType(),
        entity.getIcon(),
        entity.getColor(),
        entity.getIsSystem(),
        entity.getStatus());
  }
}
