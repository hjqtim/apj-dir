package com.crm.crmservice.entity.vo.crm;

import lombok.Data;

import java.io.Serializable;


@Data
public class MyDraftParamVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private String requestNo;

    private String endTime;

    private String startTime;

    private Integer current;

    private Integer size;
}
