package com.crm.crmservice.config.handle.request.method;

import com.crm.crmservice.exception.CustomException;
import com.crm.crmservice.utils.StringUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.models.HttpMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * get请求参数处理
 */
@Slf4j
@Component
public class RequestGetParamHandle implements RequestMethodParamHandle {

    private static final ObjectMapper JSON_MAPPER=new ObjectMapper();

    @Override
    public String methodName() {
        return HttpMethod.GET.name();
    }

    @Override
    public String handle(HttpServletRequest request) {
        String requestParams = "";
        if (StringUtils.isNotEmpty(request.getQueryString())) {
            requestParams = request.getQueryString().replace("&", "/");
            log.info("get params:"+requestParams);
            Map<String, String[]> parameterMap = request.getParameterMap();
            log.info("get params map:"+request.getParameterMap().values());
            try {
                HashMap<String, String> paramMap = new HashMap<>(10);
                Set<Map.Entry<String, String[]>> entries = request.getParameterMap().entrySet();
                for(Map.Entry<String,String[]> entry:request.getParameterMap().entrySet()){
                    paramMap.put(entry.getKey(),entry.getValue()[0]);

                }
                requestParams = JSON_MAPPER.writeValueAsString(paramMap);
            }catch (JsonProcessingException e) {
                log.error("json转换错误", e);
                throw new CustomException("json转换错误");
            }
        }

        return requestParams;
    }
}
