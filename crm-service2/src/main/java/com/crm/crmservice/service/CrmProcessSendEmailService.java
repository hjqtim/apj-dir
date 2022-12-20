package com.crm.crmservice.service;


import com.crm.crmservice.entity.param.ProcessSendEmailParam;
import com.crm.crmservice.entity.vo.process.crm.sendEmail.CrmProcessAdGroupUserInfo;
import com.crm.crmservice.entity.vo.process.crm.sendEmail.CrmProcessInformationDetail;
import org.springframework.web.bind.annotation.PathVariable;


public interface CrmProcessSendEmailService {
    /**
     * get webdp process send email required details
     * @param requestNo
     * @return
     */
    CrmProcessInformationDetail getDetail(@PathVariable("requestNo") String requestNo);

    /**
     * send email in webdp process
     * @param param
     */
    void sendCrmProcessMailForProd(ProcessSendEmailParam param);

    /**
     * get user name and email to ad group
     * @param username
     * @return
     */
    CrmProcessAdGroupUserInfo getAdUserDetail(String username);

    void saveEmailErrorLog(Exception e);
}
