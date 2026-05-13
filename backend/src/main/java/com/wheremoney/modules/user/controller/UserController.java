package com.wheremoney.modules.user.controller;

import com.wheremoney.common.response.ApiResponse;
import com.wheremoney.modules.user.dto.UpdateProfileRequest;
import com.wheremoney.modules.user.service.UserService;
import com.wheremoney.modules.user.vo.UserMeResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/me")
  public ApiResponse<UserMeResponse> me() {
    return ApiResponse.success(userService.currentUser());
  }

  @PutMapping("/me/profile")
  public ApiResponse<UserMeResponse> updateProfile(
      @Valid @RequestBody UpdateProfileRequest request) {
    return ApiResponse.success(userService.updateProfile(request));
  }
}
