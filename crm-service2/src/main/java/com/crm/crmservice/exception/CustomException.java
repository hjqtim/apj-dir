package com.crm.crmservice.exception;

import com.crm.crmservice.common.enums.ResultCode;
import lombok.Getter;

/**
 * 自定义异常类.
 */
@Getter
public class CustomException extends RuntimeException {

  private static final long serialVersionUID = 5260830795069959657L;
  private ResultCode resultCode;
  private String customMessage;

  public CustomException(ResultCode resultCode) {
    this.resultCode = resultCode;
  }

  public CustomException(ResultCode resultCode, String message) {
    this.resultCode = resultCode;
    this.customMessage = message;
  }

  public CustomException(String message) {
    this.resultCode=ResultCode.FAIL;
    this.customMessage = message;
  }

}
