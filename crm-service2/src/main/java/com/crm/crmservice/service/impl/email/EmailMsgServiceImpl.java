package com.crm.crmservice.service.impl.email;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.entity.email.EmailMsg;
import com.crm.crmservice.entity.email.EmailTemplate;
import com.crm.crmservice.entity.vo.email.MailTypeEnums;
import com.crm.crmservice.entity.vo.email.MailUsedEnums;
import com.crm.crmservice.mapper.email.EmailMsgMapper;
import com.crm.crmservice.service.email.AbstractMailService;
import com.crm.crmservice.service.file.CrmFileService;
import com.crm.crmservice.utils.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import java.util.*;
import java.util.regex.Matcher;

/**
 * 邮件记录 服务实现类
 * @author Ethan Li
 * @since 2022-12-12
 */
@Service
@Slf4j
public class EmailMsgServiceImpl extends AbstractMailService {


    @Resource
    private EmailMsgMapper emailMsgMapper;
    @Autowired
    private EmailTemplateServiceImpl emailTemplateService;

    @Resource
    private CrmFileService crmFileService;
    @Resource
    private JwtConfig jwtConfig;

    private static final String DEV = "DEV";
    private static final String ST = "ST";
    private static final String UAT = "UAT";

    @Value("${spring.profiles.active}")
    private String active;

    protected EmailMsgServiceImpl(EmailConfigServiceImpl emailConfigService) {
        super(emailConfigService);
    }

    @Override
    public EmailMsg selectEmailMsgById(Long mailId) {
        EmailMsg emailMsg = emailMsgMapper.selectById(mailId);
        if (StringUtils.isNotEmpty(emailMsg.getFileName())){
            String[] fileNameArr = emailMsg.getFileName().split(";");
            emailMsg.setFileNameList(fileNameArr);
        }
        return emailMsg;
    }

    @Override
    public void selectEmailMsgList(IPage<EmailMsg> page, EmailMsg emailMsg) {
        QueryWrapper<EmailMsg> wrapper = new QueryWrapper<>();
        wrapper.like(StringUtils.isNotEmpty(emailMsg.getFromEmail()),"from_email",emailMsg.getFromEmail());
        wrapper.like(StringUtils.isNotEmpty(emailMsg.getToEmail()),"to_email",emailMsg.getToEmail());
        wrapper.like(StringUtils.isNotEmpty(emailMsg.getSubject()),"subject",emailMsg.getSubject());
        wrapper.like(StringUtils.isNotEmpty(emailMsg.getContent()),"content",emailMsg.getContent());
        wrapper.like(emailMsg.getEmailType() != null,"email_type",emailMsg.getEmailType());
        wrapper.like(emailMsg.getSendTime() != null,"send_time",emailMsg.getSendTime());
        wrapper.like(StringUtils.isNotEmpty(emailMsg.getCopyTo()),"copy_to",emailMsg.getCopyTo());
        wrapper.like(emailMsg.getEmailUse() != null,"email_use",emailMsg.getEmailUse());
        wrapper.orderByDesc("send_time");
        IPage<EmailMsg> msgEmailIPage = emailMsgMapper.selectPage(page, wrapper);
    }

    @Override
    public List<EmailMsg> saveEmailMsg(List<EmailMsg> emailMsgList) {
        List<EmailMsg> newEmailMsgList = new ArrayList<>();
        EmailMsg emailMsg;
        for (EmailMsg emailMsgFor : emailMsgList){
            emailMsg = emailMsgMapper.selectById(emailMsgFor.getId());
            if (emailMsg != null){
                BeanUtils.copyProperties(emailMsgFor, emailMsg);
                emailMsgMapper.updateById(emailMsg);
            }else{
                emailMsg = emailMsgFor;
                emailMsgMapper.insert(emailMsg);
            }
            newEmailMsgList.add(emailMsg);
        }
        return newEmailMsgList;
    }


    @Override
    public int deleteEmailMsgByIds(Long[] ids) {
        return emailMsgMapper.deleteBatchIds(Arrays.asList(ids));
    }


    @Override
    public void sendTextMail(EmailMsg emailMsg, String attachFilePath, MailUsedEnums mailUsedEnums) throws Exception {
        EmailTemplate emailTemplate = new EmailTemplate();
        sendMailTemplate(true, messageHelper -> {
            commonEmail(emailMsg, attachFilePath, messageHelper);
            messageHelper.setText(emailMsg.getContent());
            recordMail(emailMsg, mailUsedEnums, MailTypeEnums.TEXT_MAIL,emailTemplate);
        });
    }

    @Override
    public void sendHTMLMail(EmailMsg emailMsg, String attachFilePath, MailUsedEnums mailUsedEnums) throws Exception {
        EmailTemplate emailTemplate = new EmailTemplate();
        sendMailTemplate(true, messageHelper -> {
            commonEmail(emailMsg, attachFilePath, messageHelper);
            messageHelper.setText(emailMsg.getContent(), true);
            recordMail(emailMsg, mailUsedEnums, MailTypeEnums.HTML_MAIL,emailTemplate);
        });
    }

    @Override
    public void sendTemplateMail(EmailMsg emailMsg, String attachFilePath, MailUsedEnums mailUsedEnums, EmailTemplate emailTemplate, String[] toEmailCopy) throws Exception {
        log.info("sendMailTemplate(true, messageHelper  ");
        sendMailTemplate(true, messageHelper -> {
            messageHelper.setTo(toEmailCopy);
            send(emailMsg, attachFilePath, mailUsedEnums, messageHelper, emailTemplate);
        });
    }

    @Override
    public void recordMail(EmailMsg emailMsg, MailUsedEnums mailUsedEnums, MailTypeEnums mailTypeEnums, EmailTemplate emailTemplate) {
        log.info("存入邮件记录到数据库 recordMail ... ");
        EmailMsg newEmailMsg = new EmailMsg();
        List<EmailMsg> newEmailMsgList = new ArrayList<>();
        BeanUtils.copyProperties(emailMsg,newEmailMsg);
        newEmailMsg.setFromEmail(super.getMailProperties().getUsername());
        if (newEmailMsg.getToEmails() != null && newEmailMsg.getToEmails().length > 0) {
            newEmailMsg.setToEmail(StringUtils.join(newEmailMsg.getToEmails(), ","));
        }
        if (!newEmailMsg.getIsResend().equals("Y")){
            newEmailMsg.setEmailUse(mailUsedEnums.ordinal());
            newEmailMsg.setEmailType(mailTypeEnums.ordinal());
        }
        // 暂时注释，后面需要重新发送的功能再打开
        /*if (StringUtils.isNotEmpty(msgEmail1.getParams())){
          Map<String, Object> params = msgEmail1.getParams();
          params.remove("name");
          // 将 map 对象转换成 json 字符串存入数据库
          msgEmail1.setParamObj(JSON.toJSONString(params));
          // 同样，字符串转换 json 对象如下
          // JSONObject jsonObject = JSONObject.parseObject("json 字符串");
        }*/
        newEmailMsg.setContent(modifyContext(newEmailMsg,emailTemplate));
        newEmailMsg.setId(null);
        newEmailMsgList.add(newEmailMsg);
        this.saveEmailMsg(newEmailMsgList);
    }

    /**
     * 处理邮箱发送配置
     * @param emailMsg
     * @param attachFilePath
     * @param messageHelper
     * @throws MessagingException
     */
    private void commonEmail(EmailMsg emailMsg, String attachFilePath,
                             MimeMessageHelper messageHelper) throws MessagingException {
        messageHelper.setSubject(emailMsg.getSubject());
        log.info("处理邮箱发送配置 commonEmail ... ");
        if (StringUtils.isNotEmpty(emailMsg.getCopyTo())) {
            for (String cs : emailMsg.getCopyTo().split(";")) {
                messageHelper.addCc(cs);
            }
        }
        if (StringUtils.isNotEmpty(emailMsg.getBccTo())) {
            for (String ms : emailMsg.getBccTo().split(";")) {
                messageHelper.addCc(ms);
            }
        }

        //Path g = null;
        if (StringUtils.isNotEmpty(attachFilePath)) {
            for (String at : attachFilePath.split(";")) {
                String remoteDir = "";
                String remoteFile = "";
                if (at.indexOf("/") != -1) {
                    remoteDir = at.substring(at.indexOf("/"),at.lastIndexOf("/")+1);
                    remoteFile = at.substring(at.lastIndexOf("/") + 1);
                }else{
                    remoteDir = at.substring(at.indexOf("\\"),at.lastIndexOf("\\")+1);
                    remoteFile = at.substring(at.lastIndexOf("\\") + 1);
                }

                /*Response response = fileService.downloadFile(remoteDir, remoteFile);
                final Response.Body body = response.body();
                try {
                    if (body != null && body.asInputStream() != null) {
                        InputStream inputStream = body.asInputStream();
                        messageHelper.addAttachment(remoteFile, new ByteArrayResource(IOUtils.toByteArray(inputStream)));
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }*/
            }
        }
    }

    private void send(EmailMsg emailMsg, String attachFilePath, MailUsedEnums mailUsedEnums,
                      MimeMessageHelper messageHelper, EmailTemplate emailTemplate)
            throws MessagingException {
        log.info("send ... " + emailMsg);
        // build message content with freemarker
        Context context = new Context();
        context.setLocale(Locale.getDefault());
        context.setVariables(emailMsg.getParams());
        commonEmail(emailMsg, attachFilePath, messageHelper);
        String templateHtml = emailTemplate.getTemplateHtml();
        log.info("templateHtml.replaceAll ...templateHtml{}： "+ templateHtml);
        templateHtml = templateHtml.replaceAll("\\$\\[", "\\$\\{").replaceAll("\\]\\$", "\\}");

        // 判断是否是DEV、ST、UAT场，是则加前缀[DEV_TEST][ST_TEST][UAT_TEST]
        log.info("判断是否是DEV、ST、UAT场，是则加前缀[DEV_TEST][ST_TEST][UAT_TEST] ... ");
        StringBuilder templateHtmlString = new StringBuilder(templateHtml);
        if (DEV.equals(active.toUpperCase()) || ST.equals(active.toUpperCase()) || UAT.equals(active.toUpperCase())){
            templateHtmlString.insert(0,"<B>THIS IS AN EMAIL FOR SYSTEM TESTING. Please don't hesitate to contact <a href=\"mailto:crm.support@ha.org.hk\">HO IT&HI CRM Support for any queries. </a></B>");
            templateHtml = templateHtmlString.toString();
        }
        log.info("emailTemplateService.getTemplateEngine().process(templateHtml, context); ...templateHtml{}：  "+templateHtml);
        String process = emailTemplateService.getTemplateEngine().process(templateHtml, context);
        log.info("emailTemplateService.getTemplateEngine().process(templateHtml, context); ...process{}：  "+process);
        process = process.replaceAll("\\$\\{", "（").replaceAll("\\}", "）");
        log.info("emailTemplateService.getTemplateEngine().process(templateHtml, context); ...process222{}：  "+process);
        Map<String, Object> params = emailMsg.getParams();
        Set<String> set = params.keySet();
        Iterator<String> it = set.iterator();
        while (it.hasNext()){
            String key = it.next();
            Object value = params.get(key);
            String newValue = "（"+key+"）";
            if (process.indexOf(newValue) != -1){
                process = process.replaceAll(newValue, Matcher.quoteReplacement(String.valueOf(value)));
            }
        }
        log.info("emailTemplateService.getTemplateEngine().process(templateHtml, context); ...process333{}：  "+process);
        emailMsg.setContent(
                process);
        messageHelper.setText(emailMsg.getContent(), true);

    }

    /**
     * 修改正文内容
     * @param emailMsg
     * @param emailTemplate
     */
    private String modifyContext(EmailMsg emailMsg,EmailTemplate emailTemplate){
        Context context = new Context();
        context.setLocale(Locale.getDefault());
        context.setVariables(emailMsg.getParams());
        String templateHtml = emailTemplate.getTemplateHtml();
        templateHtml = templateHtml.replaceAll("\\$\\[", "\\$\\{").replaceAll("\\]\\$", "\\}");

        // 判断是否是DEV、ST、UAT场，是则加前缀[DEV_TEST][ST_TEST][UAT_TEST]
        StringBuilder templateHtmlString = new StringBuilder(templateHtml);
        if (DEV.equals(active.toUpperCase()) || ST.equals(active.toUpperCase()) || UAT.equals(active.toUpperCase())){
            templateHtmlString.insert(0,"<B>THIS IS AN EMAIL FOR SYSTEM TESTING. Please don't hesitate to contact <a href=\"mailto:crm.support@ha.org.hk\">HO IT&HI CRM Support for any queries. </a></B>");
            templateHtml = templateHtmlString.toString();
        }

        String process = emailTemplateService.getTemplateEngine().process(templateHtml, context);
        process = process.replaceAll("\\$\\{", "（").replaceAll("\\}", "）");
        Map<String, Object> params = emailMsg.getParams();
        Set<String> set = params.keySet();
        Iterator<String> it = set.iterator();
        while (it.hasNext()){
            String key = it.next();
            Object value = params.get(key);
            String newValue = "（"+key+"）";
            if (process.indexOf(newValue) != -1){
                process = process.replaceAll(newValue, Matcher.quoteReplacement(String.valueOf(value)));
            }
        }
        return process;
    }

    @Override
    public int testConnection() {
        return super.testConnection();
    }
}
