package com.wheremoney.modules.account.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wheremoney.common.enums.ResourceStatus;
import com.wheremoney.common.exception.BusinessException;
import com.wheremoney.common.response.ResponseCode;
import com.wheremoney.common.util.MoneyUtils;
import com.wheremoney.modules.account.dto.AccountRequest;
import com.wheremoney.modules.account.entity.AccountEntity;
import com.wheremoney.modules.account.mapper.AccountMapper;
import com.wheremoney.modules.account.vo.AccountResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountService {

  private final AccountMapper accountMapper;

  public AccountService(AccountMapper accountMapper) {
    this.accountMapper = accountMapper;
  }

  public List<AccountResponse> list(Long userId, String status) {
    LambdaQueryWrapper<AccountEntity> wrapper =
        new LambdaQueryWrapper<AccountEntity>()
            .eq(AccountEntity::getUserId, userId)
            .orderByAsc(AccountEntity::getSortOrder)
            .orderByDesc(AccountEntity::getCreatedAt);
    if (status != null && !status.isBlank()) {
      wrapper.eq(AccountEntity::getStatus, status);
    }
    return accountMapper.selectList(wrapper).stream().map(this::toResponse).toList();
  }

  @Transactional
  public AccountResponse create(Long userId, AccountRequest request) {
    AccountEntity entity = new AccountEntity();
    entity.setUserId(userId);
    entity.setName(request.name());
    entity.setType(request.type().name());
    entity.setCurrency(request.currency().name());
    entity.setInitialBalance(request.initialBalance());
    entity.setCurrentBalance(request.initialBalance());
    entity.setColor(request.color());
    entity.setIcon(request.icon());
    entity.setSortOrder(100);
    entity.setStatus(ResourceStatus.ACTIVE.name());
    entity.setCreatedAt(LocalDateTime.now());
    entity.setUpdatedAt(entity.getCreatedAt());
    accountMapper.insert(entity);
    return toResponse(entity);
  }

  @Transactional
  public AccountResponse update(Long userId, Long accountId, AccountRequest request) {
    AccountEntity entity = requireOwned(userId, accountId);
    BigDecimal balanceDelta = entity.getCurrentBalance().subtract(entity.getInitialBalance());
    entity.setName(request.name());
    entity.setType(request.type().name());
    entity.setCurrency(request.currency().name());
    entity.setInitialBalance(request.initialBalance());
    entity.setCurrentBalance(request.initialBalance().add(balanceDelta));
    entity.setColor(request.color());
    entity.setIcon(request.icon());
    entity.setUpdatedAt(LocalDateTime.now());
    accountMapper.updateById(entity);
    return toResponse(entity);
  }

  @Transactional
  public void archive(Long userId, Long accountId) {
    AccountEntity entity = requireOwned(userId, accountId);
    entity.setStatus(ResourceStatus.ARCHIVED.name());
    entity.setUpdatedAt(LocalDateTime.now());
    accountMapper.updateById(entity);
  }

  public AccountEntity requireActive(Long userId, Long accountId) {
    AccountEntity entity = requireOwned(userId, accountId);
    if (!ResourceStatus.ACTIVE.name().equals(entity.getStatus())) {
      throw new BusinessException(ResponseCode.ACCOUNT_UNAVAILABLE);
    }
    return entity;
  }

  @Transactional
  public void applyDelta(AccountEntity account, BigDecimal delta) {
    account.setCurrentBalance(account.getCurrentBalance().add(delta));
    account.setUpdatedAt(LocalDateTime.now());
    accountMapper.updateById(account);
  }

  private AccountEntity requireOwned(Long userId, Long accountId) {
    AccountEntity entity =
        accountMapper.selectOne(
            new LambdaQueryWrapper<AccountEntity>()
                .eq(AccountEntity::getId, accountId)
                .eq(AccountEntity::getUserId, userId));
    if (entity == null) {
      throw new BusinessException(ResponseCode.ACCOUNT_UNAVAILABLE);
    }
    return entity;
  }

  private AccountResponse toResponse(AccountEntity entity) {
    return new AccountResponse(
        String.valueOf(entity.getId()),
        entity.getName(),
        entity.getType(),
        entity.getCurrency(),
        MoneyUtils.format(entity.getInitialBalance()),
        MoneyUtils.format(entity.getCurrentBalance()),
        entity.getColor(),
        entity.getIcon(),
        entity.getStatus());
  }
}
