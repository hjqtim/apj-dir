package com.crm.crmservice.entity.param.feedback;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
public class NetworkFeedbackSendEmailParam {

    @ApiModelProperty("feedback master table id")
    private Integer feedbackCommentId;

    private String createBy;

}
