package com.wheremoney.modules.auth.controller;

import com.wheremoney.common.response.ApiResponse;
import com.wheremoney.modules.auth.dto.CodeLoginRequest;
import com.wheremoney.modules.auth.dto.LoginRequest;
import com.wheremoney.modules.auth.dto.RegisterRequest;
import com.wheremoney.modules.auth.dto.VerificationCodeRequest;
import com.wheremoney.modules.auth.service.AuthService;
import com.wheremoney.modules.auth.vo.AuthResponse;
import com.wheremoney.modules.auth.vo.VerificationCodeResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ApiResponse.success(authService.register(request));
  }

  @PostMapping("/login")
  public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ApiResponse.success(authService.login(request));
  }

  @PostMapping("/login/code")
  public ApiResponse<AuthResponse> loginWithCode(@Valid @RequestBody CodeLoginRequest request) {
    return ApiResponse.success(authService.loginWithCode(request));
  }

  @PostMapping("/verification-codes")
  public ApiResponse<VerificationCodeResponse> createVerificationCode(
      @Valid @RequestBody VerificationCodeRequest request) {
    return ApiResponse.success(authService.createVerificationCode(request));
  }
}
