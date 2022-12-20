package com.crm.crmservice.entity.vo.crm;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;


@Data
public class MyRequestAndActionVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String requestNo;

//    private String appType;

    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date startTime;

    private String startUserId;

    private String state;

    private String actId;

    private String actName;

    private Boolean feedBack;

    private Map<String, Object> variables;
}
