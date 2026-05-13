package com.wheremoney.common.exception;

import com.wheremoney.common.response.ApiResponse;
import com.wheremoney.common.response.ResponseCode;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  @ResponseStatus(HttpStatus.OK)
  public ApiResponse<Void> handleBusiness(BusinessException exception) {
    return ApiResponse.error(exception.responseCode(), exception.getMessage());
  }

  @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
  @ResponseStatus(HttpStatus.OK)
  public ApiResponse<Void> handleValidation(Exception exception) {
    return ApiResponse.error(ResponseCode.BAD_REQUEST, exception.getMessage());
  }

  @ExceptionHandler(AccessDeniedException.class)
  @ResponseStatus(HttpStatus.OK)
  public ApiResponse<Void> handleAccessDenied() {
    return ApiResponse.error(ResponseCode.FORBIDDEN);
  }

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.OK)
  public ApiResponse<Void> handleException(Exception exception) {
    return ApiResponse.error(ResponseCode.INTERNAL_ERROR);
  }
}
