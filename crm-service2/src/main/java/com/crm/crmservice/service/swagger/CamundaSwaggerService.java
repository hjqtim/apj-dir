package com.crm.crmservice.service.swagger;

import com.alibaba.fastjson.JSONObject;
import com.crm.crmservice.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(url = "${swaggers.camunda}",name = "swaggersCamunda",configuration = {FeignConfig.class})
public interface CamundaSwaggerService {
    @GetMapping(value = "/v2/api-docs")
    JSONObject getCamundaSwagger();

}
