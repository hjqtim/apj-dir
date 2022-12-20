package com.crm.crmservice.entity.feedback;

import com.crm.crmservice.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;


@EqualsAndHashCode(callSuper = true)
@Data
public class NetworkFeedbackComment extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    /**
     * 
     */
    private Integer id;

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

    /**
     * status 0/1
     */
    private Integer state;

    /**
     * if quartz send email it's=0 . else ti's=1
     */
    private Integer sendEmailState;

    private String appType;


}