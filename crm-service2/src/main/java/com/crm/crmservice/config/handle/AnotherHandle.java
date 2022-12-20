package com.crm.crmservice.config.handle;

import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.config.security.HeaderMapRequestWrapper;
import com.crm.crmservice.utils.SpringUtils;
import com.crm.crmservice.utils.StringUtils;
import com.crm.crmservice.utils.ThreadParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.util.Enumeration;

@Component
@Slf4j
public class AnotherHandle extends HandlerInterceptorAdapter {


    @Autowired
    private JwtConfig jwtConfig;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (StringUtils.isNotEmpty(request.getHeader(HttpHeaders.AUTHORIZATION))) {
            if (StringUtils.isNotEmpty(request.getHeader("anotherCorpId"))) {
                String oldToken = request.getHeader(HttpHeaders.AUTHORIZATION);
                String newToken = "Bearer " + JwtConfig.createToken(request.getHeader("anotherCorpId"));
                log.info(jwtConfig.getTokenClaim(oldToken).get("username").asString());
                ThreadParam.OLD_TOKEN.set(new WeakReference<>(oldToken));
                log.info(request.getClass().getTypeName());
                HeaderMapRequestWrapper headerMapRequestWrapper;
                if (request.getClass().getTypeName().contains("CommonsMultipartResolver")) {
                    headerMapRequestWrapper = new HeaderMapRequestWrapper(request);
                } else {
                    headerMapRequestWrapper = (HeaderMapRequestWrapper) request;
                }
                headerMapRequestWrapper.addHeader(HttpHeaders.AUTHORIZATION, newToken);
                ThreadParam.REQUEST_THREAD_LOCAL.set(headerMapRequestWrapper);
                log.info("token:" + request.getHeader(HttpHeaders.AUTHORIZATION));
            }
        }
        return true;
    }
}
