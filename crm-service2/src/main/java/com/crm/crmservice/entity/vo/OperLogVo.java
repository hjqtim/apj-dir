package com.crm.crmservice.entity.vo;

import com.crm.crmservice.entity.OperLog;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;

/**
 * 请求记录表
 * @TableName oper_log
 */
@ApiModel
@Data
public class OperLogVo extends OperLog implements Serializable {

    @ApiModelProperty("only intercept first '/'")
    private String module;

}