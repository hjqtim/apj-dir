package com.crm.crmservice.config.security;


import com.crm.crmservice.config.jwt.TokenInterceptor;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

import javax.annotation.Resource;

/**
 * spring security配置.
 */
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * 认证失败处理类.
     */
    @Resource
    private AuthenticationEntryPointImpl unauthorizedHandler;

    /**
     * token认证过滤器.
     */
    @Resource
    private TokenInterceptor tokenInterceptor;

    /**
     * 跨域过滤器.
     */
    @Resource
    private CorsFilter corsFilter;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // CSRF禁用，因为不使用session
                .csrf().disable()
                // 认证失败处理类
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                // 基于token，所以不需要session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                // 过滤请求
                .authorizeRequests()
                .antMatchers("/swagger-ui.html/**").permitAll()
                .antMatchers("/swagger-resources/**").permitAll()
                .antMatchers("/doc.html").permitAll()
                .antMatchers("/v2/api-docs").permitAll()
                .antMatchers("/docs").permitAll()
                .antMatchers("/webjars/**").permitAll()
                .antMatchers("/favicon.ico").permitAll()
                .antMatchers("/swaggerDocument/**").permitAll()
                .antMatchers("/ad/getNewToken/**").permitAll()
                .antMatchers("/healthCheck").permitAll()
                .antMatchers("/auth/login").permitAll()
                // 超时保存
                .antMatchers("/approvalRecord/saveApprovalRecord").permitAll()
//            .antMatchers("/**").permitAll()
                // 除上面外的所有请求全部需要鉴权认证
                .anyRequest().authenticated();
        // 添加JWT filter
        httpSecurity
                .addFilterBefore(tokenInterceptor, UsernamePasswordAuthenticationFilter.class);
        // 添加CORS filter
        httpSecurity.addFilterBefore(corsFilter, TokenInterceptor.class);
    }

}
