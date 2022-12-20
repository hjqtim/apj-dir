package com.crm.crmservice.entity.pojo.camunda;


import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class MyApprovalQuery {

    @ApiModelProperty(value = "isMyTeam",notes = "is myTeam: Y, not myTeam: N")
    private String isMyTeam;

    private String endDate;

    private String startDate;

    private String requestNo;

    @ApiModelProperty(value = "apptype",notes = "DP/AP")
    private String apptype;

    @ApiModelProperty(value = "status",notes = "pending/approved/cancelled")
    private String status;

    private String hospital;

    private String stepName;

    private Integer pageIndex;

    private Integer pageSize;
}
