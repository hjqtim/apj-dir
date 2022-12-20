package com.crm.crmservice.entity.pojo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
public class PendingRequestParam {

    private String requestNo;

    @ApiModelProperty("if agree pending request")
    private boolean examineFlag=false;

    private String reason;

}
