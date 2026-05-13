package com.wheremoney.common.response;

public record ApiResponse<T>(int code, String message, T data) {

  public static <T> ApiResponse<T> success(T data) {
    return new ApiResponse<>(ResponseCode.SUCCESS.code(), ResponseCode.SUCCESS.message(), data);
  }

  public static ApiResponse<Void> success() {
    return success(null);
  }

  public static ApiResponse<Void> error(ResponseCode responseCode) {
    return new ApiResponse<>(responseCode.code(), responseCode.message(), null);
  }

  public static ApiResponse<Void> error(ResponseCode responseCode, String message) {
    return new ApiResponse<>(responseCode.code(), message, null);
  }
}
