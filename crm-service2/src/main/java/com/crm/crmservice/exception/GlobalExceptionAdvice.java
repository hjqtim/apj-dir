package com.crm.crmservice.exception;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.crm.crmservice.common.enums.ResultCode;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.utils.ResponseBuilder;
import feign.FeignException;
import io.jsonwebtoken.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.Map;

@RestControllerAdvice
@Component
@Slf4j
public class GlobalExceptionAdvice {

    /**
     * 主要处理我们在代码里自己知道，抛出来的异常，如json转换异常，空指针异常等.
     */
    @ExceptionHandler(value = CustomException.class)
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public ResultVo<Object> handleCustomException(CustomException customException) {
        log.error(customException.getCustomMessage());
        if (customException.getCustomMessage() == null) {
            return new ResultVo<>(customException.getResultCode());
        }
        return new ResultVo<>(customException.getResultCode(), customException.getCustomMessage());
    }
    /**
     * 404异常处理，返回404状态码
     * @param e
     * @return
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNotFoundException(NoHandlerFoundException e) {
        log.error(e.getMessage(), e);
        return ResponseBuilder.error(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND.getReasonPhrase());
    }

    /**
     * JWT校验token异常处理.
     */
    @ExceptionHandler(JWTVerificationException.class)
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public ResultVo<Object> handleJWTVerificationException(JWTVerificationException e) {
        log.error(e.getMessage(), e);
        return new ResultVo<>(ResultCode.UNAUTHORISED, e.getMessage());
    }

    /**
     * JWT校验token时间过期异常处理.
     */
    @ExceptionHandler(value = TokenExpiredException.class)
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public ResultVo<Object> handleTokenExpiredException(TokenExpiredException e) {
        log.error(e.getMessage(), e);
        return new ResultVo<>(ResultCode.UNAUTHORISED, e.getMessage());
    }

    /**
     * JWT校验token签名异常处理.
     */
    @ExceptionHandler(value = SignatureException.class)
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public ResultVo<Object> handleSignatureException(SignatureException e) {
        log.error(e.getMessage(), e);
        return new ResultVo<>(ResultCode.UNAUTHORISED, e.getMessage());
    }

    /**
     * 默认异常处理，处理一些未知的，未精确地去捕获的异常，前面未处理到的.
     *
     */
    @ExceptionHandler(value = Exception.class)
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public ResultVo<Object> handleException(Exception e) {
        log.error(e.getMessage(), e);
        return new ResultVo<>(ResultCode.SERVER_ERROR, e.getMessage());
    }

    /**
     * Feign 调用其他服务出现的异常,返回服务返回来的信息
     * @param e
     * @return
     */
    @ExceptionHandler(value = FeignException.class)
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public ResultVo<Object> handleFeignException(FeignException e) {
        log.error(e.getMessage(), e);
        if (e.getMessage().indexOf("401") != -1){
            return new ResultVo<>(ResultCode.UNAUTHORISED, e.getMessage());
        }else {
            return new ResultVo<>(ResultCode.FAIL, e.getMessage());
        }
    }
}
