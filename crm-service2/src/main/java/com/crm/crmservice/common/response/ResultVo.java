package com.crm.crmservice.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.crm.crmservice.common.enums.ResultCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResultVo<T> {

  private Integer status;
  private String message;
  private T data;

  public ResultVo(ResultCode status, String message) {
    this.status = status.getCode();
    this.message = message;
  }

  public ResultVo(ResultCode status) {
    this.status = status.getCode();
    this.message = status.getMessage();
  }

  public ResultVo(ResultCode status, T data) {
    this.status = status.getCode();
    this.message = status.getMessage();
    this.data = data;
  }

  public ResultVo(ResultCode status, T data, String message) {
    this.status = status.getCode();
    this.message = message;
    this.data = data;
  }

  public ResultVo(T data) {
    this.status = HttpStatus.OK.value();
    this.data = data;
  }

  public static ResultVo success(Object data){
    ResultVo resultVo = new ResultVo<>();
    resultVo.message=HttpStatus.OK.getReasonPhrase();
    resultVo.status=HttpStatus.OK.value();
    resultVo.data=data;
    return resultVo;
  }
  public static ResultVo success(){
    ResultVo resultVo = new ResultVo<>();
    resultVo.message=HttpStatus.OK.getReasonPhrase();
    resultVo.status=HttpStatus.OK.value();
    return resultVo;
  }

  public static ResultVo error(){
    ResultVo resultVo = new ResultVo<>();
    resultVo.message=HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase();
    resultVo.status=HttpStatus.INTERNAL_SERVER_ERROR.value();
    return resultVo;
  }

  public static ResultVo error(ResultCode rc){
    ResultVo resultVo = new ResultVo<>();
    resultVo.message=rc.getMessage();
    resultVo.status=rc.getCode();
    return resultVo;
  }
}
