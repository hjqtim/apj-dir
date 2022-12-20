package com.crm.crmservice.entity.pojo;

import lombok.Data;


@Data
public class PendingProcessApplyParam {

    private String requestNo;

    private String remark;

    private boolean pendingExamineFlag=false;

}
