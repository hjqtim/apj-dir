package com.crm.crmservice.config;


import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.config.jwt.JwtUtil;
import com.crm.crmservice.utils.ThreadParam;
import com.crm.crmservice.utils.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.Map;

/**
 * 刷新token.
 */
@ControllerAdvice
public class FlashToken implements ResponseBodyAdvice<Object> {

    @Autowired
    private TokenUtils tokenUtils;

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType,
                                  MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        Map<String, Object> map = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            if (body instanceof String) {
                return body;
            } else {
                String json = objectMapper.writeValueAsString(body);
                if (json.equals("[{\"name\":\"default\",\"url\":\"/v2/api-docs\",\"swaggerVersion\":\"2.0\",\"location\":\"/v2/api-docs\"}]")
                        || json.equals("[{\"name\":\"crm_Server\",\"url\":\"/v2/api-docs\",\"swaggerVersion\":\"2.0\",\"location\":\"/v2/api-docs\"}," +
                        "{\"name\":\"camunda_Server\",\"url\":\"/swaggerDocument/camundaSwagger\",\"swaggerVersion\":\"2.0\",\"location\":\"/swaggerDocument/camundaSwagger\"}]")) {

                    return body;
                }
                map = objectMapper.readValue(json, Map.class);
            }
            String newToken = null;
            if (request.getHeaders().get("authorization") != null) {
                String newUsername = tokenUtils.getUserName();
                if (StringUtils.isNotBlank(newUsername)) {
                    JwtConfig jwtConfig = new JwtConfig();
                    newToken = jwtConfig.createToken(newUsername);
                } else {
                    newToken = JwtUtil.getNewToken();
                }
            }
            if (StringUtils.isNotBlank(newToken)) {
                map.put("newToken", newToken);
            } else if (request.getHeaders().get("AccessAuth") != null) {
                String accessAuth = String.valueOf(request.getHeaders().get("AccessAuth"));
                accessAuth = accessAuth.substring(1, accessAuth.length() - 1);
                if (accessAuth != null) {
                    newToken = JwtConfig.createToken(accessAuth);
                    map.put("newToken", newToken);
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        ThreadParam.cleanThreadLocal();
        return map;
    }
}
