package com.crm.crmservice.entity.pojo.camunda;

import lombok.Data;

import java.util.Map;

@Data
public class Fallback {
    String taskId;
    String activityId;
    Map<String, Object> variables;
}
