package com.crm.crmservice.entity.pojo.camunda;

import lombok.Data;

import java.util.HashMap;

@Data
public class TaskVo {

    /**
     * 流程taskId.
     */
    private String taskId;
    /**
     * 任务动作.
     */
    private String action;
    /**
     * 审批拒绝理由
     */
    private String rejectReason;
    /**
     * 流程任务节点状态.
     */
    private String status;
    /**
     * 前端url.
     */
    private String frontendUrl;
    private String sendEmail;
    private String mailto;
    /**
     * 审批人.
     */
    private String assignee;
    /**
     * 是否为自动任务(异步call ansible使用).
     */
    private String isAutoTask;
    /**
     * 流程全局变量.
     */
    private HashMap<String, Object> variables;
}
