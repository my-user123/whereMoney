package com.wheremoney.common.response;

public enum ResponseCode {
  SUCCESS(200, "success"),
  BAD_REQUEST(400, "request parameter error"),
  UNAUTHORIZED(401, "unauthorized"),
  FORBIDDEN(403, "forbidden"),
  NOT_FOUND(404, "resource not found"),
  CONFLICT(409, "resource state conflict"),
  VALIDATION_FAILED(422, "business validation failed"),
  INTERNAL_ERROR(500, "internal server error"),
  EMAIL_EXISTS(10001, "email already exists"),
  INVALID_CREDENTIALS(10002, "email or password is incorrect"),
  VERIFICATION_CODE_SEND_FAILED(10003, "verification code email send failed"),
  ACCOUNT_UNAVAILABLE(20001, "account does not exist or is unavailable"),
  CATEGORY_UNAVAILABLE(20002, "category does not exist or is unavailable"),
  CATEGORY_ONBOARDING_SELECTION_INVALID(20003, "category onboarding selection is invalid"),
  CATEGORY_HIERARCHY_INVALID(20004, "category hierarchy is invalid"),
  TRANSACTION_NOT_FOUND(30001, "transaction not found"),
  TRANSACTION_CURRENCY_MISMATCH(30002, "transaction currency must match account currency"),
  BUDGET_NOT_FOUND(40001, "budget not found"),
  RECURRING_INSTANCE_STATE_INVALID(50001, "recurring bill instance state is invalid"),
  AI_PARSE_FAILED(60001, "ai transaction parse failed"),
  AI_REPORT_FAILED(60002, "ai report generation failed"),
  EXPORT_RECORD_NOT_FOUND(70001, "export record not found"),
  EXPORT_FILE_NOT_READY(70002, "export file is not ready"),
  RESOURCE_FORBIDDEN(90001, "resource does not belong to current user");

  private final int code;
  private final String message;

  ResponseCode(int code, String message) {
    this.code = code;
    this.message = message;
  }

  public int code() {
    return code;
  }

  public String message() {
    return message;
  }
}
