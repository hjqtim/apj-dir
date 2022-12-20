package com.crm.crmservice.entity.pojo.camunda;

import lombok.Data;

import java.util.Map;

@Data
public class StartProcess {

    private String processDefinitionKey; //流程 Key ,name

    private String businessKey;  // dp_request 表 requestNo

    private Map<String,Object> variables; //启动流程时，设置全局变量

    private String startUser; //流程发起人
}
