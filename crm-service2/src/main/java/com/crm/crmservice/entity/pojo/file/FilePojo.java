package com.crm.crmservice.entity.pojo.file;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@ApiModel(value = "FilePojo", description = "")
public class FilePojo {

    @ApiModelProperty(value = "requestNo")
    private String requestNo;

    @ApiModelProperty(value = "corpId")
    private String corpId;

    @ApiModelProperty(value = "module name")
    private String moduleName;

    @ApiModelProperty(value = "email template id")
    private Integer emailTemplateId;



}
