package com.wheremoney.modules.category.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wheremoney.common.enums.ResourceStatus;
import com.wheremoney.common.enums.TransactionType;
import com.wheremoney.common.exception.BusinessException;
import com.wheremoney.common.response.ResponseCode;
import com.wheremoney.modules.category.dto.CategoryOnboardingCompleteRequest;
import com.wheremoney.modules.category.dto.CategoryOnboardingCompleteRequest.CustomCategoryRequest;
import com.wheremoney.modules.category.dto.CategoryRequest;
import com.wheremoney.modules.category.dto.CategoryUpdateRequest;
import com.wheremoney.modules.category.entity.CategoryEntity;
import com.wheremoney.modules.category.mapper.CategoryMapper;
import com.wheremoney.modules.category.model.CategoryTemplate;
import com.wheremoney.modules.category.vo.CategoryOnboardingResponse;
import com.wheremoney.modules.category.vo.CategoryResponse;
import com.wheremoney.modules.category.vo.CategoryTemplateResponse;
import com.wheremoney.modules.user.entity.UserEntity;
import com.wheremoney.modules.user.mapper.UserMapper;
import com.wheremoney.modules.user.service.UserService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

  private final CategoryMapper categoryMapper;
  private final UserMapper userMapper;
  private final UserService userService;
  private final CategoryTemplateProvider templateProvider;

  public CategoryService(
      CategoryMapper categoryMapper,
      UserMapper userMapper,
      UserService userService,
      CategoryTemplateProvider templateProvider) {
    this.categoryMapper = categoryMapper;
    this.userMapper = userMapper;
    this.userService = userService;
    this.templateProvider = templateProvider;
  }

  @Transactional
  public void initializeDefaults(Long userId) {
    createDefault(userId, null, "工资", TransactionType.INCOME, "wallet", "#22C55E", 1);
    createDefault(userId, null, "兼职", TransactionType.INCOME, "briefcase", "#16A34A", 2);
    createDefault(userId, null, "餐饮", TransactionType.EXPENSE, "utensils", "#F97316", 1);
    createDefault(userId, null, "交通", TransactionType.EXPENSE, "bus", "#3B82F6", 2);
    createDefault(userId, null, "住房", TransactionType.EXPENSE, "home", "#A16207", 3);
    createDefault(userId, null, "购物", TransactionType.EXPENSE, "shopping-bag", "#EC4899", 4);
    createDefault(userId, null, "娱乐", TransactionType.EXPENSE, "music", "#8B5CF6", 5);
    createDefault(userId, null, "学习", TransactionType.EXPENSE, "book", "#0EA5E9", 6);
    createDefault(userId, null, "医疗", TransactionType.EXPENSE, "heart-pulse", "#EF4444", 7);
  }

  public List<CategoryTemplateResponse> onboardingTemplates() {
    return templateProvider.templates().stream().map(CategoryTemplate::toResponse).toList();
  }

  @Transactional
  public CategoryOnboardingResponse completeOnboarding(
      Long userId, CategoryOnboardingCompleteRequest request) {
    if (!isOnboardingRequired(userId)) {
      return new CategoryOnboardingResponse(userService.currentUser(), list(userId, null, null));
    }

    List<String> requestSelectedKeys =
        request.selectedKeys() == null ? List.of() : request.selectedKeys();
    List<CustomCategoryRequest> customCategories =
        request.customCategories() == null ? List.of() : request.customCategories();
    Set<String> selectedKeys =
        requestSelectedKeys.stream()
            .filter(key -> key != null && !key.isBlank())
            .collect(Collectors.toSet());
    if (selectedKeys.isEmpty() && customCategories.isEmpty()) {
      throw new BusinessException(ResponseCode.CATEGORY_ONBOARDING_SELECTION_INVALID);
    }

    Map<String, CategoryTemplate> templates = templateProvider.flattenTemplates();
    for (String key : selectedKeys) {
      if (!templates.containsKey(key)) {
        throw new BusinessException(ResponseCode.CATEGORY_ONBOARDING_SELECTION_INVALID);
      }
    }
    for (CustomCategoryRequest customCategory : customCategories) {
      if (customCategory.parentKey() != null
          && !customCategory.parentKey().isBlank()
          && !templates.containsKey(customCategory.parentKey())) {
        throw new BusinessException(ResponseCode.CATEGORY_ONBOARDING_SELECTION_INVALID);
      }
    }

    Map<String, Long> createdIds = new HashMap<>();
    List<CategoryResponse> createdCategories = new ArrayList<>();
    for (String key : selectedKeys) {
      createTemplateWithAncestors(userId, templates.get(key), createdIds, createdCategories);
    }
    for (CustomCategoryRequest customCategory : customCategories) {
      createCustomCategory(userId, customCategory, templates, createdIds, createdCategories);
    }

    markOnboardingCompleted(userId);
    return new CategoryOnboardingResponse(userService.currentUser(), createdCategories);
  }

  @Transactional
  public CategoryOnboardingResponse skipOnboarding(Long userId) {
    if (!isOnboardingRequired(userId)) {
      return new CategoryOnboardingResponse(userService.currentUser(), list(userId, null, null));
    }

    markOnboardingCompleted(userId);
    return new CategoryOnboardingResponse(userService.currentUser(), list(userId, null, null));
  }

  public List<CategoryResponse> list(Long userId, String type, String status) {
    LambdaQueryWrapper<CategoryEntity> wrapper =
        new LambdaQueryWrapper<CategoryEntity>()
            .eq(CategoryEntity::getUserId, userId)
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
    Long parentId = validateCreateParent(userId, request);
    CategoryEntity entity = new CategoryEntity();
    entity.setUserId(userId);
    entity.setParentId(parentId);
    entity.setName(request.name());
    entity.setType(request.type().name());
    entity.setIcon(request.icon());
    entity.setColor(request.color());
    entity.setSortOrder(100);
    entity.setStatus(ResourceStatus.ACTIVE.name());
    entity.setCreatedAt(LocalDateTime.now());
    entity.setUpdatedAt(entity.getCreatedAt());
    categoryMapper.insert(entity);
    return toResponse(entity);
  }

  @Transactional
  public CategoryResponse update(Long userId, Long categoryId, CategoryUpdateRequest request) {
    CategoryEntity entity = requireOwned(userId, categoryId);
    entity.setName(request.name());
    entity.setIcon(request.icon());
    entity.setColor(request.color());
    entity.setUpdatedAt(LocalDateTime.now());
    categoryMapper.updateById(entity);
    return toResponse(entity);
  }

  @Transactional
  public void disable(Long userId, Long categoryId) {
    requireOwned(userId, categoryId);
    disableCategoryTree(userId, categoryId);
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
                .eq(CategoryEntity::getUserId, userId));
    if (entity == null) {
      throw new BusinessException(ResponseCode.CATEGORY_UNAVAILABLE);
    }
    return entity;
  }

  private Long validateCreateParent(Long userId, CategoryRequest request) {
    if (request.parentId() == null) {
      return null;
    }
    CategoryEntity parent = requireOwned(userId, request.parentId());
    if (!ResourceStatus.ACTIVE.name().equals(parent.getStatus())
        || !request.type().name().equals(parent.getType())) {
      throw new BusinessException(ResponseCode.CATEGORY_HIERARCHY_INVALID);
    }
    if (categoryDepth(userId, parent) >= 3) {
      throw new BusinessException(ResponseCode.CATEGORY_HIERARCHY_INVALID);
    }
    return parent.getId();
  }

  private int categoryDepth(Long userId, CategoryEntity category) {
    int depth = 1;
    Long parentId = category.getParentId();
    while (parentId != null) {
      CategoryEntity parent = requireOwned(userId, parentId);
      depth++;
      parentId = parent.getParentId();
    }
    return depth;
  }

  private void disableCategoryTree(Long userId, Long categoryId) {
    CategoryEntity entity = requireOwned(userId, categoryId);
    entity.setStatus(ResourceStatus.DISABLED.name());
    entity.setUpdatedAt(LocalDateTime.now());
    categoryMapper.updateById(entity);

    List<CategoryEntity> children =
        categoryMapper.selectList(
            new LambdaQueryWrapper<CategoryEntity>()
                .eq(CategoryEntity::getUserId, userId)
                .eq(CategoryEntity::getParentId, categoryId));
    for (CategoryEntity child : children) {
      disableCategoryTree(userId, child.getId());
    }
  }

  private void createDefault(
      Long userId, String name, TransactionType type, String icon, String color, int sortOrder) {
    createDefault(userId, null, name, type, icon, color, sortOrder);
  }

  private CategoryEntity createDefault(
      Long userId,
      Long parentId,
      String name,
      TransactionType type,
      String icon,
      String color,
      int sortOrder) {
    CategoryEntity entity = new CategoryEntity();
    entity.setUserId(userId);
    entity.setParentId(parentId);
    entity.setName(name);
    entity.setType(type.name());
    entity.setIcon(icon);
    entity.setColor(color);
    entity.setSortOrder(sortOrder);
    entity.setStatus(ResourceStatus.ACTIVE.name());
    entity.setCreatedAt(LocalDateTime.now());
    entity.setUpdatedAt(entity.getCreatedAt());
    categoryMapper.insert(entity);
    return entity;
  }

  private CategoryResponse toResponse(CategoryEntity entity) {
    return new CategoryResponse(
        String.valueOf(entity.getId()),
        entity.getParentId() == null ? null : String.valueOf(entity.getParentId()),
        entity.getName(),
        entity.getType(),
        entity.getIcon(),
        entity.getColor(),
        entity.getStatus());
  }

  private Long createTemplateWithAncestors(
      Long userId,
      CategoryTemplate template,
      Map<String, Long> createdIds,
      List<CategoryResponse> createdCategories) {
    if (createdIds.containsKey(template.key())) {
      return createdIds.get(template.key());
    }
    Long parentId = null;
    if (template.parent() != null) {
      parentId =
          createTemplateWithAncestors(userId, template.parent(), createdIds, createdCategories);
    }

    CategoryEntity entity =
        createDefault(
            userId,
            parentId,
            template.name(),
            template.type(),
            template.icon(),
            template.color(),
            template.sortOrder());
    createdIds.put(template.key(), entity.getId());
    createdCategories.add(toResponse(entity));
    return entity.getId();
  }

  private void createCustomCategory(
      Long userId,
      CustomCategoryRequest request,
      Map<String, CategoryTemplate> templates,
      Map<String, Long> createdIds,
      List<CategoryResponse> createdCategories) {
    Long parentId = null;
    if (request.parentKey() != null && !request.parentKey().isBlank()) {
      parentId =
          createTemplateWithAncestors(
              userId, templates.get(request.parentKey()), createdIds, createdCategories);
    }

    CategoryEntity entity =
        createDefault(
            userId, parentId, request.name(), request.type(), request.icon(), request.color(), 100);
    createdCategories.add(toResponse(entity));
  }

  private void markOnboardingCompleted(Long userId) {
    UserEntity user = userMapper.selectById(userId);
    user.setIsNewUserFirstLogin(false);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  private boolean isOnboardingRequired(Long userId) {
    UserEntity user = userMapper.selectById(userId);
    return Boolean.TRUE.equals(user.getIsNewUserFirstLogin());
  }
}
