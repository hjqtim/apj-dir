package com.crm.crmservice.controller;

import com.crm.crmservice.service.swagger.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Map;

/**
 * 整合每个 微服务的swagger文档访问地址
 */
@RestController
@RequestMapping("/swaggerDocument")
public class SwaggerDocumentList {

    @Resource
    CamundaSwaggerService camundaSwaggerService;

    @GetMapping("/camundaSwagger")
    public Map<String,Object> getCamundaSwagger(){
        return camundaSwaggerService.getCamundaSwagger();
    }

}
