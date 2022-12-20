package com.crm.crmservice.service.email;

import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.email.EmailTemplate;
import org.thymeleaf.TemplateEngine;

import java.util.List;

/**
 * 邮件模板 服务类
 * @author Ethan Li
 * @since 2022-12-12
 */
public interface EmailTemplateService extends IService<EmailTemplate> {

    List<EmailTemplate> selectEmailTemplateList(EmailTemplate emailTemplate);

    EmailTemplate selectEmailTemplateById(Long templateId);

    List<EmailTemplate> saveEmailTemplate(List<EmailTemplate> emailTemplate);

    int deleteByIds(Long[] idList);

    /**
     * 获取字符串模板
     */
    TemplateEngine getTemplateEngine();

    //查找是否有 模板名称重名的数据
    List<EmailTemplate> isRepetition(String name);

}
