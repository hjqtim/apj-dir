package com.crm.crmservice.config;

import com.crm.crmservice.utils.ThreadParam;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;


@Configuration
@Slf4j
public class AnotherFeignConfig implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate requestTemplate) {
        if (ThreadParam.OLD_TOKEN.get() != null && ThreadParam.OLD_TOKEN.get().get() != null) {
            requestTemplate.removeHeader(HttpHeaders.AUTHORIZATION);
            requestTemplate.header(HttpHeaders.AUTHORIZATION, ThreadParam.OLD_TOKEN.get().get());
        }
    }
}
