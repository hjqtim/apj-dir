package com.crm.crmservice.service.email;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.email.EmailMsg;
import com.crm.crmservice.entity.email.EmailTemplate;
import com.crm.crmservice.entity.vo.email.MailTypeEnums;
import com.crm.crmservice.entity.vo.email.MailUsedEnums;

import java.util.List;

/**
 * 邮件记录 服务类
 * @author Ethan Li
 * @since 2022-12-12
 */
public interface EmailMsgService extends IService<EmailMsg> {

    //查询邮件记录.
    EmailMsg selectEmailMsgById(Long mailId);

    //查询邮件记录列表.
    void selectEmailMsgList(IPage<EmailMsg> page, EmailMsg emailMsg);

    //新增邮件记录.
    List<EmailMsg> saveEmailMsg(List<EmailMsg> emailMsg);

    //批量删除邮件记录.
    int deleteEmailMsgByIds(Long[] ids);

    /**
     * 发送简单邮件.
     */
    void sendTextMail(EmailMsg emailMsg, String attachFilePath, MailUsedEnums mailUsedEnums) throws Exception;

    /**
     * 发送HTML邮件.
     */
    void sendHTMLMail(EmailMsg emailMsg, String attachFilePath, MailUsedEnums mailUsedEnums) throws Exception;

    /**
     * 发送模板邮件.
     */
    void sendTemplateMail(EmailMsg emailMsg, String attachFilePath, MailUsedEnums mailUsedEnums, EmailTemplate emailTemplate, String[] toEmailCopy) throws Exception;

    void recordMail(EmailMsg msgEmail, MailUsedEnums mailUsedEnums, MailTypeEnums mailTypeEnums, EmailTemplate emailTemplate);

    int testConnection();

}
