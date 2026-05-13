package com.wheremoney.modules.transaction.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wheremoney.common.enums.TransactionSource;
import com.wheremoney.common.enums.TransactionType;
import com.wheremoney.common.exception.BusinessException;
import com.wheremoney.common.response.PageResponse;
import com.wheremoney.common.response.ResponseCode;
import com.wheremoney.common.util.MoneyUtils;
import com.wheremoney.modules.account.entity.AccountEntity;
import com.wheremoney.modules.account.service.AccountService;
import com.wheremoney.modules.category.entity.CategoryEntity;
import com.wheremoney.modules.category.service.CategoryService;
import com.wheremoney.modules.transaction.dto.TransactionQuery;
import com.wheremoney.modules.transaction.dto.TransactionRequest;
import com.wheremoney.modules.transaction.entity.TransactionEntity;
import com.wheremoney.modules.transaction.mapper.TransactionMapper;
import com.wheremoney.modules.transaction.vo.TransactionResponse;
import com.wheremoney.modules.transaction.vo.TransactionView;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

  private final TransactionMapper transactionMapper;
  private final AccountService accountService;
  private final CategoryService categoryService;

  public TransactionService(
      TransactionMapper transactionMapper,
      AccountService accountService,
      CategoryService categoryService) {
    this.transactionMapper = transactionMapper;
    this.accountService = accountService;
    this.categoryService = categoryService;
  }

  public PageResponse<TransactionResponse> list(Long userId, TransactionQuery query) {
    LocalDateTime startAt = query.startDate() == null ? null : query.startDate().atStartOfDay();
    LocalDateTime endAt =
        query.endDate() == null ? null : query.endDate().plusDays(1).atStartOfDay();
    Page<TransactionView> page = new Page<>(query.page(), query.size());
    IPage<TransactionView> result =
        transactionMapper.selectTransactionViews(
            page,
            userId,
            query.type(),
            query.currency(),
            query.accountId(),
            query.categoryId(),
            startAt,
            endAt);
    List<TransactionResponse> list = result.getRecords().stream().map(this::toResponse).toList();
    return new PageResponse<>(result.getTotal(), query.page(), query.size(), list);
  }

  public TransactionResponse detail(Long userId, Long transactionId) {
    TransactionView view = transactionMapper.selectTransactionViewById(userId, transactionId);
    if (view == null) {
      throw new BusinessException(ResponseCode.TRANSACTION_NOT_FOUND);
    }
    return toResponse(view);
  }

  @Transactional
  public TransactionResponse create(Long userId, TransactionRequest request) {
    AccountEntity account = accountService.requireActive(userId, request.accountId());
    if (request.currency() != null && !request.currency().equals(account.getCurrency())) {
      throw new BusinessException(ResponseCode.TRANSACTION_CURRENCY_MISMATCH);
    }
    CategoryEntity category =
        categoryService.requireActive(userId, request.categoryId(), request.type().name());
    TransactionEntity entity = new TransactionEntity();
    entity.setUserId(userId);
    entity.setAccountId(account.getId());
    entity.setCategoryId(category.getId());
    entity.setType(request.type().name());
    entity.setAmount(request.amount());
    entity.setCurrency(account.getCurrency());
    entity.setOccurredAt(request.occurredAt());
    entity.setNote(request.note());
    entity.setSource(TransactionSource.MANUAL.name());
    entity.setCreatedAt(LocalDateTime.now());
    entity.setUpdatedAt(entity.getCreatedAt());
    transactionMapper.insert(entity);
    accountService.applyDelta(account, signedAmount(entity.getType(), entity.getAmount()));
    return detail(userId, entity.getId());
  }

  @Transactional
  public TransactionResponse update(Long userId, Long transactionId, TransactionRequest request) {
    TransactionEntity old = requireOwned(userId, transactionId);
    AccountEntity oldAccount = accountService.requireActive(userId, old.getAccountId());
    accountService.applyDelta(oldAccount, signedAmount(old.getType(), old.getAmount()).negate());

    AccountEntity newAccount = accountService.requireActive(userId, request.accountId());
    if (request.currency() != null && !request.currency().equals(newAccount.getCurrency())) {
      throw new BusinessException(ResponseCode.TRANSACTION_CURRENCY_MISMATCH);
    }
    CategoryEntity category =
        categoryService.requireActive(userId, request.categoryId(), request.type().name());
    old.setAccountId(newAccount.getId());
    old.setCategoryId(category.getId());
    old.setType(request.type().name());
    old.setAmount(request.amount());
    old.setCurrency(newAccount.getCurrency());
    old.setOccurredAt(request.occurredAt());
    old.setNote(request.note());
    old.setUpdatedAt(LocalDateTime.now());
    transactionMapper.updateById(old);
    accountService.applyDelta(newAccount, signedAmount(old.getType(), old.getAmount()));
    return detail(userId, old.getId());
  }

  @Transactional
  public void delete(Long userId, Long transactionId) {
    TransactionEntity entity = requireOwned(userId, transactionId);
    AccountEntity account = accountService.requireActive(userId, entity.getAccountId());
    accountService.applyDelta(account, signedAmount(entity.getType(), entity.getAmount()).negate());
    entity.setDeletedAt(LocalDateTime.now());
    entity.setUpdatedAt(entity.getDeletedAt());
    transactionMapper.updateById(entity);
  }

  private TransactionEntity requireOwned(Long userId, Long transactionId) {
    TransactionEntity entity =
        transactionMapper.selectOne(
            new LambdaQueryWrapper<TransactionEntity>()
                .eq(TransactionEntity::getId, transactionId)
                .eq(TransactionEntity::getUserId, userId)
                .isNull(TransactionEntity::getDeletedAt));
    if (entity == null) {
      throw new BusinessException(ResponseCode.TRANSACTION_NOT_FOUND);
    }
    return entity;
  }

  private BigDecimal signedAmount(String type, BigDecimal amount) {
    return TransactionType.INCOME.name().equals(type) ? amount : amount.negate();
  }

  private TransactionResponse toResponse(TransactionView view) {
    return new TransactionResponse(
        String.valueOf(view.id()),
        view.type(),
        MoneyUtils.format(view.amount()),
        view.currency(),
        view.occurredAt().toString(),
        new TransactionResponse.SimpleRef(String.valueOf(view.accountId()), view.accountName()),
        new TransactionResponse.CategoryRef(
            String.valueOf(view.categoryId()),
            view.categoryName(),
            view.categoryIcon(),
            view.categoryColor()),
        view.note(),
        view.source());
  }
}
