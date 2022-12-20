package com.crm.crmservice.config.filter;

import com.crm.crmservice.utils.RepeatedReadRequestWrapper;
import com.crm.crmservice.utils.ThreadParam;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * 可重复读的request拦截器
 */
@WebFilter(filterName = "reperator",urlPatterns = "/**")
@Component
public class ReperatorFilter implements Filter {


    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if(servletRequest instanceof HttpServletRequest){
            ThreadParam.REQUEST_THREAD_LOCAL.set((HttpServletRequest)servletRequest);
            servletRequest=new RepeatedReadRequestWrapper((HttpServletRequest) servletRequest);
        }
        filterChain.doFilter(servletRequest,servletResponse);
    }
}
