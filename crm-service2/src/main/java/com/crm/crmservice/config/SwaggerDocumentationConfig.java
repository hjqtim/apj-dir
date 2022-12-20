package com.crm.crmservice.config;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.List;

/**
 * 集成多个服务的swagger 文档配置文件
 */
@Component
@Primary
public class SwaggerDocumentationConfig implements SwaggerResourcesProvider {
    //整合每个微服务的swagger
    @Override
    public List<SwaggerResource> get() {
        List resources = new ArrayList<>();
        //一个 SwaggerResource对应一个微服务 ： 参数： 服务中文名 ， 路径：/zuul前缀/服务的routes访问路径//v2/api-docs  ； 版本
        resources.add(swaggerResource("crm_Server", "/v2/api-docs", "2.0"));
        resources.add(swaggerResource("camunda_Server", "/swaggerDocument/camundaSwagger", "2.0"));
        return resources;
    }
    private SwaggerResource swaggerResource(String name, String location, String version) {
        SwaggerResource swaggerResource = new SwaggerResource();
        swaggerResource.setName(name);
        swaggerResource.setLocation(location);
        swaggerResource.setSwaggerVersion(version);
        return swaggerResource;
    }
}