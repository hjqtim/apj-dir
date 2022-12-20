package com.crm.crmservice.config;

import com.crm.crmservice.config.handle.AnotherHandle;
import com.crm.crmservice.config.handle.LogHandle;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;

/**
 * 拦截器配置类
 */
@Configuration
public class HandleConfig implements WebMvcConfigurer {

    @Resource
    private LogHandle logHandle;

    /*@Resource
    private ProcureMentHandle procureMentHandle;*/

    @Resource
    private AnotherHandle anotherHandle;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(logHandle)
                .addPathPatterns("/**")
                .excludePathPatterns("/swagger-ui.html")
                .excludePathPatterns("/*.*")
                .excludePathPatterns("/operLog/**")
                .order(0);

        registry.addInterceptor(anotherHandle)
                .addPathPatterns("/**")
                .order(1);

       /* registry.addInterceptor(procureMentHandle)
                .addPathPatterns("/rms/goodReceiptDn/saveGoodReceiptDn")
                .addPathPatterns("/rms/requestForm/updatePRPreparation")
                .addPathPatterns("/poLineItem/savePoLineItem")
                .addPathPatterns("/poMaster/savePRPOSummary")
                .addPathPatterns("/fundingTransfer/updateFundingTransfer")
                .addPathPatterns("/allFundingTxMemoSummary/saveFundingTxSummary")
                .addPathPatterns("/problemLog/saveProblemLog")
                .order(2);*/
    }

//    @Bean(name = "multipartResolver")
//    public MultipartResolver multipartResolver() {
//        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
//        resolver.setDefaultEncoding("UTF-8");
//        resolver.setResolveLazily(true);
//        resolver.setMaxInMemorySize(40960);
//        resolver.setMaxUploadSize(10 * 1024 * 1024);
//        return resolver;
//    }
}
