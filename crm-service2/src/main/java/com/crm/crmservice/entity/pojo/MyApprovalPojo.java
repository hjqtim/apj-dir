package com.crm.crmservice.entity.pojo;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class MyApprovalPojo {

    //    private String approvalId;
    private Long dpId;
    private String requestNo;
    private String serviceathosp;
    private String requestername;
    private String requesterid;
    private String respstaff;
    //    private long rev;
    private String processInstanceId;
    //    private String processDefinitionId;
    //    private String deploymentId;
    private long priority;
    private long suspensionState;
    //    private String taskDefinitionKey;
    private String name;
    //    private String processName;
    private String status;
    private String createBy;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

}
