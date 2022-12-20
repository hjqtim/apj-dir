package com.crm.crmservice.config.filter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.utils.HttpAnalysis;
import com.crm.crmservice.utils.StringUtils;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.Resource;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * check token filter
 */
//@WebFilter(filterName = "tokenFilter", urlPatterns = "/**")
//@Component
@Slf4j
public class TokenFilter implements Filter {

    @Resource
    private JwtConfig jwtConfig;


    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String token = request.getHeader("Authorization");
        if (StringUtils.isNotEmpty(token)) {
            try {
                jwtConfig.getTokenClaim(token).get("username").asString();
            } catch (Exception e) {
                log.error("ip:{},login error", HttpAnalysis.getIP(request));
                throw new JWTVerificationException("login be overdue");
            }
        }
        filterChain.doFilter(servletRequest, servletResponse);

    }
}
