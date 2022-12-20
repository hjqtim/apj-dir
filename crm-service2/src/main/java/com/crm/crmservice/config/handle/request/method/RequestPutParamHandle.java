package com.crm.crmservice.config.handle.request.method;

import com.crm.crmservice.utils.HttpAnalysis;
import io.swagger.models.HttpMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * PUT请求参数处理
 */
@Slf4j
@Component
public class RequestPutParamHandle implements RequestMethodParamHandle {
    @Override
    public String methodName() {
        return HttpMethod.PUT.name();
    }

    @Override
    public String handle(HttpServletRequest request) {

        return HttpAnalysis.getRequestStr(request, "");
    }
}
