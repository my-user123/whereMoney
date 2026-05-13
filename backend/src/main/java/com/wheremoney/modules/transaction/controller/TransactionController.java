package com.wheremoney.modules.transaction.controller;

import com.wheremoney.common.response.ApiResponse;
import com.wheremoney.common.response.PageResponse;
import com.wheremoney.common.security.SecurityUtils;
import com.wheremoney.modules.transaction.dto.TransactionQuery;
import com.wheremoney.modules.transaction.dto.TransactionRequest;
import com.wheremoney.modules.transaction.service.TransactionService;
import com.wheremoney.modules.transaction.vo.TransactionResponse;
import jakarta.validation.Valid;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

  private final TransactionService transactionService;

  public TransactionController(TransactionService transactionService) {
    this.transactionService = transactionService;
  }

  @GetMapping
  public ApiResponse<PageResponse<TransactionResponse>> list(
      @RequestParam(defaultValue = "1") long page,
      @RequestParam(defaultValue = "20") long size,
      @RequestParam(required = false) String type,
      @RequestParam(required = false) String currency,
      @RequestParam(required = false) Long accountId,
      @RequestParam(required = false) Long categoryId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate endDate) {
    return ApiResponse.success(
        transactionService.list(
            SecurityUtils.currentUserId(),
            new TransactionQuery(
                page, size, type, currency, accountId, categoryId, startDate, endDate)));
  }

  @GetMapping("/{transactionId}")
  public ApiResponse<TransactionResponse> detail(@PathVariable Long transactionId) {
    return ApiResponse.success(
        transactionService.detail(SecurityUtils.currentUserId(), transactionId));
  }

  @PostMapping
  public ApiResponse<TransactionResponse> create(@Valid @RequestBody TransactionRequest request) {
    return ApiResponse.success(transactionService.create(SecurityUtils.currentUserId(), request));
  }

  @PutMapping("/{transactionId}")
  public ApiResponse<TransactionResponse> update(
      @PathVariable Long transactionId, @Valid @RequestBody TransactionRequest request) {
    return ApiResponse.success(
        transactionService.update(SecurityUtils.currentUserId(), transactionId, request));
  }

  @DeleteMapping("/{transactionId}")
  public ApiResponse<Void> delete(@PathVariable Long transactionId) {
    transactionService.delete(SecurityUtils.currentUserId(), transactionId);
    return ApiResponse.success();
  }
}
