package com.crm.crmservice.entity.pojo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
@ApiModel(value = "UserInfo", description = "")
public class UserInfo {

    @ApiModelProperty(value="login Id")
    private String loginUser;

    @ApiModelProperty(value="requester Id")
    private String requester;
}
