package com.crm.crmservice.entity.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * Approver
 *
 * @author lcb371
 */
@Data
public class ApproverVo implements Serializable {

    private String progress;
    private String approver;
    private String team;
    private Boolean state = false;
    private String comments;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date actionTime;

}