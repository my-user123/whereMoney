package com.wheremoney.modules.analytics.vo;

import com.wheremoney.modules.transaction.vo.TransactionResponse;
import java.util.List;

public record DashboardResponse(
    List<String> currencies,
    List<CurrencySummary> summaryByCurrency,
    List<TransactionResponse> recentTransactions) {

  public record CurrencySummary(
      String currency,
      String incomeAmount,
      String expenseAmount,
      String balanceAmount,
      double savingRate) {}
}
