package com.crm.crmservice.entity.pojo.camunda;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * 获取 Camunda 待发布的流程的实体对象
 */
@Data
public class ActReProcdef {

  private String id;
  private long rev;
  private String category;
  private String name;
  private String key;
  private long version;
  private String deploymentId;
  private String resourceName;
  private String dgrmResourceName;
  private String description;
  private long hasStartFormKey;
  private long hasGraphicalNotation;
  private long suspensionState;
  private String tenantId;
  private String engineVersion;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
  private Date deployTime;

}
