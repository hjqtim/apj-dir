package com.crm.crmservice.entity.vo.process.crm.sendEmail;

import lombok.Data;


@Data
public class CrmProcessRequestCancel {

    private String remark;

    private String reason;

    private String requestName;

    private String requestPhone;

    private String requestTitle;

    private String requestEmail;

    private String examineName;

    private String examinePhone;

    private String examineEmail;

    private String examineTitle;

}
