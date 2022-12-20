package com.crm.crmservice.entity.param.feedback;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class NetworkFeedbackEmailParam {
    /**
     *
     */
    private String feedbackId;

    /**
     *
     */
    @ApiModelProperty("send email address.if it is array ,please separate with comma")
    private String recipient;

    /**
     *
     */
    @ApiModelProperty("only one address")
    private String cc;

    /**
     *
     */
    private String content;

    @ApiModelProperty("no need input")
    private String createBy;

}


