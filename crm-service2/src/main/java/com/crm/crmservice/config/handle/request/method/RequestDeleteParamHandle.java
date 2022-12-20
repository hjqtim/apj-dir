package com.crm.crmservice.config.handle.request.method;

import com.crm.crmservice.exception.CustomException;
import io.swagger.models.HttpMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 * delete请求处理
 */
@Component
@Slf4j
public class RequestDeleteParamHandle implements RequestMethodParamHandle {
    @Override
    public String methodName() {
        return HttpMethod.DELETE.name();
    }

    @Override
    public String handle(HttpServletRequest request) {
        String requestParam = request.getRequestURI().substring(request.getRequestURI().lastIndexOf("/") + 1);
        try {
            requestParam = URLDecoder.decode(requestParam, "utf-8");
        } catch (UnsupportedEncodingException e) {
            log.error("转换错误", e);
            throw new CustomException("转换utf-8格式错误");
        }
        return requestParam;
    }
}
