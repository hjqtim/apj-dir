package com.crm.crmservice.entity.feedback;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.crm.crmservice.entity.BaseEntity;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @TableName network_feedback_email
 */
@TableName(value ="network_feedback_email")
@Data
public class NetworkFeedbackEmail extends BaseEntity implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 
     */
    private String feedbackId;

    /**
     * 
     */
    private String recipient;

    /**
     * 
     */
    private String cc;

    /**
     * 
     */
    private String content;

    /**
     * 
     */
    private String createdBy;

    /**
     * 
     */
    private Date createdDate;

    /**
     * 
     */
    private String lastUpdatedBy;

    /**
     * 
     */
    private Date lastUpdatedDate;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}