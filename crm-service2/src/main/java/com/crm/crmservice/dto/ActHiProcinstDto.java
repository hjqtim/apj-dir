package com.crm.crmservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * 获取 Camunda 我的申请的实体对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActHiProcinstDto {

  private String id;
  private String procInstId;
  private String procDefId;
  private String name;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  private Date startTime;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  private Date endTime;
  private String requestNo;
  private String requester;
  private String hospital;
  private String stepName;
  private String approvalStatus;
  private String rejectReason;
  private String requesterManager;
  private String deploymentId;
}
