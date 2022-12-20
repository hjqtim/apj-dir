package com.crm.crmservice.entity.vo;

import lombok.Data;


@Data
public class MyRequestStatus {
    private Integer myDraft;

    private Integer myRequest;

    private Integer myAction;

    private Long awaiting;

    private Long inProgress;

    private Long closed;
}
