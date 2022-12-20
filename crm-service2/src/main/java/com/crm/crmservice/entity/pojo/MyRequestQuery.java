package com.crm.crmservice.entity.pojo;


import lombok.Data;

import java.util.List;

@Data
public class MyRequestQuery {

    private String requestNo;

    private String appType;

    private String startTime;

    private String endTime;

    private List<String> dprequeststatusList;

    private Integer page;

    private Integer limit;
}
