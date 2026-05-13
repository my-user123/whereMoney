package com.wheremoney.common.exception;

import com.wheremoney.common.response.ResponseCode;

public class BusinessException extends RuntimeException {

  private final ResponseCode responseCode;

  public BusinessException(ResponseCode responseCode) {
    super(responseCode.message());
    this.responseCode = responseCode;
  }

  public BusinessException(ResponseCode responseCode, String message) {
    super(message);
    this.responseCode = responseCode;
  }

  public ResponseCode responseCode() {
    return responseCode;
  }
}
