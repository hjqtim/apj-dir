package com.crm.crmservice.entity.vo;

import lombok.Data;

import java.util.Map;

@Data
public class ProcessInstanceStartVo {
    private String startUser;
    private String processDefinitionKey;
    private String businessKey;
    private Map<String, Object> variables;
}
