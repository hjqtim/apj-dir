package com.crm.crmservice.config;

import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.utils.TokenUtils;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


/**
 * @EnableFeignClients 根据浏览器动态获取token,
 * 重写 fegin 包的请求拦截器 RequestInterceptor 的apply 方法
 * 这里配置，调用EnableFeignClients 的时候会自动携带 token 过去
 */
@Configuration
public class FeignConfig implements RequestInterceptor {
    @Autowired
    private TokenUtils tokenUtils;
    @Override
    public void apply(RequestTemplate requestTemplate) throws NullPointerException{

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null){
            HttpServletRequest request = attributes.getRequest();
            String header = request.getHeader(HttpHeaders.AUTHORIZATION);
            String authorization = "Bearer " + header;
            if (header != null && header.indexOf("Bearer") != -1) {
                authorization = header;
            }else if(header == null){
                authorization = null;
            }
            requestTemplate.header(HttpHeaders.AUTHORIZATION, authorization);
        }else if (requestTemplate.headers() != null){
            Map<String, Collection<String>> headers = requestTemplate.headers();
            // dataConversion 需要使用
            if (headers.get("dataConversion") != null) {
                List<String> dataConversionList = headers.get("dataConversion").stream().collect(Collectors.toList());
                String dataConversion = dataConversionList.get(0);
                if (dataConversion.equals("Y")) {
                    String token = JwtConfig.createToken("sensesc1");
                    String authorization = "Bearer " + token;
                    requestTemplate.header(HttpHeaders.AUTHORIZATION, authorization);
                }
            }
            // 多线程暂时用
            if (headers.get(HttpHeaders.AUTHORIZATION) != null) {
                List<String> tokenList = headers.get(HttpHeaders.AUTHORIZATION).stream().collect(Collectors.toList());
                requestTemplate.header(HttpHeaders.AUTHORIZATION, tokenList.get(0));
            }
        }

    }
}