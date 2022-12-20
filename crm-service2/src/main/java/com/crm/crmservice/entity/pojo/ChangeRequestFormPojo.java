package com.crm.crmservice.entity.pojo;


import com.crm.crmservice.entity.ChangeRequest;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(value = "ChangeRequestFormPojo", description = "")
public class ChangeRequestFormPojo {

    @ApiModelProperty(value = "changeRequest", required = true)
    private ChangeRequest changeRequest;

    //@ApiModelProperty(value = "userInfo")
    //private UserInfo userInfo;

    /**
     * false时只校验数据库必填字段。 true时校验数据库必填字段和流程中必要字段，其他页面先判断
     */
    @ApiModelProperty(value = "is submit (false = save, true = submit)")
    private Boolean isSubmit = false;
    @ApiModelProperty(value = "is submit (false = save, true = submit)")
    private Boolean reject = false;
    @ApiModelProperty(value = "requesterName")
    private String displayName;
    @ApiModelProperty(value = "流程实例ID", hidden = true)
    private String progressId;
}
