package com.crm.crmservice.entity.param.feedback;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
public class NetworkFeedbackCommentParam {

    /**
     * 
     */
    private String requestNo;

    /**
     * 
     */
    private String institution;

    /**
     * 
     */
    private Integer rating;

    /**
     *
     */
    private String comment;

    private String createdBy;

    private Integer id;

    @ApiModelProperty("status button .0= no check,1=checked")
    private Integer state;

    private String appType;

}