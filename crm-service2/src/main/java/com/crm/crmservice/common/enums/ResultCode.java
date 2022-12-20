package com.crm.crmservice.common.enums;

import org.springframework.http.HttpStatus;

/**
 * ResultCode.
 */
public enum ResultCode {
  SUCCESS(HttpStatus.OK),
  FAIL(HttpStatus.BAD_REQUEST),

  UNAUTHENTICATED(HttpStatus.FORBIDDEN),
  UNAUTHORISED(HttpStatus.UNAUTHORIZED),
  SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR),
  NOT_FOUND(HttpStatus.NOT_FOUND),
  UNPROCESSABLE_ENTITY(HttpStatus.UNPROCESSABLE_ENTITY),
  NCS_BUSINESS_ERROR(1024, "NCS business exception"),

  /**
   * 业务异常
   */
  BUSINESS_ERROR(500,"business exception"),;

  private final Integer code;
  private final String message;

  ResultCode(int code, String message) {
    this.code = code;
    this.message = message;
  }

  ResultCode(HttpStatus httpStatus) {
    this.code = httpStatus.value();
    this.message = httpStatus.getReasonPhrase();
  }

  public Integer getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

}
