package com.crm.crmservice.entity.vo.process.crm.sendEmail;

import lombok.Data;

import java.util.List;

/**
 * webdp process detail information
 * @author WZM755
 */
@Data
public class CrmProcessInformationDetail {

    /**
     * submitter name
     */
    private String submittedName;

    /**
     * request type (AP/DP)
     */
    private String requestType;

    /**
     * request's hospital abbreviation
     */
    private String hospitalAbbreviation;

    /**
     * applicant's email
     */
    private String requestMail;

    private String mni;

    /**
     * applicant's remark
     */
    private String requesterRemark;

    /**
     * webdp process request hospital staff primary information
     */
    private List<ProcessResponsibleStaff> NMSResponsibleStaffListPri;

    /**
     * webdp process request hospital staff second information
     */
    private List<ProcessResponsibleStaff> NMSResponsibleStaffListSec;

    /**
     * webdp process request's resp hospital staff information
     */
    private List<ProcessResponsibleStaff> NMSResponsibleStaffListResp;

    /**
     *
     */
    private CrmProcessCompany processCompany;

    private CrmProcessManager processManager;


    private CrmProcessRequestCancel processRequestCancel;


    private String paymentMethod;

    private String requestNo;

    /**
     * applicant's position
     */
    private String requesterTitle;

    private String quotationTotal;

    private String fundConfirmed;

    private String chartOfAccount;

}
