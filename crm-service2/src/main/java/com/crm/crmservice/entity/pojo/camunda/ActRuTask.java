package com.crm.crmservice.entity.pojo.camunda;


import lombok.Data;

import java.util.Date;

/**
 * ActRuTask.
 */
@Data
public class ActRuTask {

    private String id;
    private long rev;
    private String executionId;
    private String processInstanceId;
    private String processDefinitionId;
    private String name;
    private String parentTaskId;
    private String description;
    private String taskDefinitionKey;
    private String owner;
    private String assignee;
    private String delegation;
    private long priority;

    private String createTime;

    private Date dueDate;
    private String category;
    private long suspensionState;
    private String tenantId;
    private String formKey;
    private Date claimTime;
    private String createBy;
    private String processName;
    private String deploymentId;
    private String status;
    private String end;
}



