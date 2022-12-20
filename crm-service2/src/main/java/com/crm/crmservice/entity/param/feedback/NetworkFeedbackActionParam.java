package com.crm.crmservice.entity.param.feedback;

import lombok.Data;

import java.io.Serializable;


@Data
public class NetworkFeedbackActionParam implements Serializable {

    /**
     *
     */
    private Integer feedbackCommentId;

    /**
     *
     */
    private String taken;

    private String createdBy;

}
