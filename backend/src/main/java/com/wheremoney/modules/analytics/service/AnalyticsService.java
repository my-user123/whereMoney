package com.wheremoney.modules.analytics.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wheremoney.common.enums.TransactionType;
import com.wheremoney.common.util.MoneyUtils;
import com.wheremoney.modules.analytics.vo.DashboardResponse;
import com.wheremoney.modules.transaction.dto.TransactionQuery;
import com.wheremoney.modules.transaction.entity.TransactionEntity;
import com.wheremoney.modules.transaction.mapper.TransactionMapper;
import com.wheremoney.modules.transaction.service.TransactionService;
import com.wheremoney.modules.transaction.vo.TransactionResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

  private final TransactionMapper transactionMapper;
  private final TransactionService transactionService;

  public AnalyticsService(
      TransactionMapper transactionMapper, TransactionService transactionService) {
    this.transactionMapper = transactionMapper;
    this.transactionService = transactionService;
  }

  public DashboardResponse dashboard(Long userId, LocalDate periodStart, LocalDate periodEnd) {
    LocalDate start = periodStart == null ? LocalDate.now().withDayOfMonth(1) : periodStart;
    LocalDate end = periodEnd == null ? LocalDate.now() : periodEnd;
    LocalDateTime startAt = start.atStartOfDay();
    LocalDateTime endAt = end.plusDays(1).atStartOfDay();

    List<TransactionEntity> transactions =
        transactionMapper.selectList(
            new LambdaQueryWrapper<TransactionEntity>()
                .eq(TransactionEntity::getUserId, userId)
                .ge(TransactionEntity::getOccurredAt, startAt)
                .lt(TransactionEntity::getOccurredAt, endAt)
                .isNull(TransactionEntity::getDeletedAt));

    Map<String, List<TransactionEntity>> byCurrency =
        transactions.stream()
            .collect(Collectors.groupingBy(TransactionEntity::getCurrency, Collectors.toList()));
    Set<String> currencies = new LinkedHashSet<>(byCurrency.keySet());
    List<DashboardResponse.CurrencySummary> summaries = new ArrayList<>();
    for (Map.Entry<String, List<TransactionEntity>> entry : byCurrency.entrySet()) {
      BigDecimal income = sum(entry.getValue(), TransactionType.INCOME.name());
      BigDecimal expense = sum(entry.getValue(), TransactionType.EXPENSE.name());
      BigDecimal balance = income.subtract(expense);
      double savingRate =
          income.signum() == 0 ? 0 : balance.divide(income, 4, RoundingMode.HALF_UP).doubleValue();
      summaries.add(
          new DashboardResponse.CurrencySummary(
              entry.getKey(),
              MoneyUtils.format(income),
              MoneyUtils.format(expense),
              MoneyUtils.format(balance),
              savingRate));
    }

    List<TransactionResponse> recent =
        transactionService
            .list(userId, new TransactionQuery(1, 5, null, null, null, null, null, null))
            .list();
    return new DashboardResponse(new ArrayList<>(currencies), summaries, recent);
  }

  private BigDecimal sum(List<TransactionEntity> transactions, String type) {
    return transactions.stream()
        .filter(item -> type.equals(item.getType()))
        .map(TransactionEntity::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }
}
