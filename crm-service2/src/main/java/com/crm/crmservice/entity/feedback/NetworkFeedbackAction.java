package com.crm.crmservice.entity.feedback;

import com.crm.crmservice.entity.BaseEntity;
import lombok.Data;

import java.io.Serializable;

/**
 * @TableName network_feedback_action
 */
@Data
public class NetworkFeedbackAction extends BaseEntity implements Serializable {
    /**
     *
     */
    private Integer id;

    /**
     *
     */
    private Integer feedbackCommentId;

    /**
     *
     */
    private String taken;
}
