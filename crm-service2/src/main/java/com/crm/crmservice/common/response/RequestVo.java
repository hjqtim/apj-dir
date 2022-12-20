package com.crm.crmservice.common.response;

import lombok.Data;

import java.util.List;

@Data
public class RequestVo {

  /**
   * quotaDeduction请求参数.
   */
  private List<String> types;
  /**
   * quotaDeduction请求参数.
   */
  private Integer year;
  /**
   * quotaDeduction请求参数.
   */
  private Integer tenantId;
  /**
   * quotaDeduction请求参数.
   */
  private String workflowId;
}
