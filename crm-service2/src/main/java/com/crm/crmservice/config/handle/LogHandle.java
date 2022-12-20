package com.crm.crmservice.config.handle;

import com.crm.crmservice.config.handle.request.method.RequestMethodParamHandle;
import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.entity.OperLog;
import com.crm.crmservice.service.OperLogService;
import com.crm.crmservice.utils.HttpAnalysis;
import com.crm.crmservice.utils.StringUtils;
import com.crm.crmservice.utils.ThreadParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 通用拦截器，记录所有请求日志
 */
@Slf4j
@Component
public class LogHandle extends HandlerInterceptorAdapter {

    private static final Map<String, RequestMethodParamHandle> METHOD_PARAM_HANDLE_MAP = new ConcurrentHashMap<>(4);

    public LogHandle() {
    }

    @Autowired
    public LogHandle(RequestMethodParamHandle[] requestMethodParamHandles) {
        for (RequestMethodParamHandle requestMethodParamHandle : requestMethodParamHandles) {
            METHOD_PARAM_HANDLE_MAP.put(requestMethodParamHandle.methodName(), requestMethodParamHandle);
        }
    }

    @Resource
    private RequestMethodParamHandle[] requestMethodParamHandles;

    @Resource
    private OperLogService operLogService;

    @Resource
    private JwtConfig jwtConfig;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        try {

            log.info("url：" + request.getRequestURL());
            OperLog operLog = new OperLog();
            operLog.setOperUri(request.getRequestURI());
            operLog.setOperIp(HttpAnalysis.getIP(request));
            operLog.setCreatedDate(new Date());
            String token = request.getHeader("Authorization");
            if (StringUtils.isNotEmpty(token)) {
                operLog.setOperRequToken(token);
                String username = jwtConfig.getTokenClaim(token).get("username").asString();
                log.info("this request username：" + username);
                operLog.setCreatedBy(username);
            } else {
                operLog.setCreatedBy("");
            }
            String handle = METHOD_PARAM_HANDLE_MAP.get(request.getMethod()).handle(request);
            operLog.setOperMethod(request.getMethod());
            log.info("request params" + handle);
            operLog.setOperRequParam(handle);
            operLog.setOperRespParam("");
            operLogService.save(operLog);
            ThreadParam.LOG_ID.set(operLog.getId());
        } catch (Exception e) {
            log.error("logging handle error", e);
        }
        return true;
    }

}
