package com.wheremoney.modules.account.controller;

import com.wheremoney.common.response.ApiResponse;
import com.wheremoney.common.security.SecurityUtils;
import com.wheremoney.modules.account.dto.AccountRequest;
import com.wheremoney.modules.account.service.AccountService;
import com.wheremoney.modules.account.vo.AccountResponse;
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
@RequestMapping("/api/v1/accounts")
public class AccountController {

  private final AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping
  public ApiResponse<List<AccountResponse>> list(@RequestParam(required = false) String status) {
    return ApiResponse.success(accountService.list(SecurityUtils.currentUserId(), status));
  }

  @PostMapping
  public ApiResponse<AccountResponse> create(@Valid @RequestBody AccountRequest request) {
    return ApiResponse.success(accountService.create(SecurityUtils.currentUserId(), request));
  }

  @PutMapping("/{accountId}")
  public ApiResponse<AccountResponse> update(
      @PathVariable Long accountId, @Valid @RequestBody AccountRequest request) {
    return ApiResponse.success(
        accountService.update(SecurityUtils.currentUserId(), accountId, request));
  }

  @PatchMapping("/{accountId}/archive")
  public ApiResponse<Void> archive(@PathVariable Long accountId) {
    accountService.archive(SecurityUtils.currentUserId(), accountId);
    return ApiResponse.success();
  }
}
