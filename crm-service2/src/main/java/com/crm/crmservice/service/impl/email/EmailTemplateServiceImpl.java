package com.crm.crmservice.service.impl.email;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.email.EmailTemplate;
import com.crm.crmservice.mapper.email.EmailTemplateMapper;
import com.crm.crmservice.service.email.EmailTemplateService;
import com.crm.crmservice.utils.Assert;
import com.crm.crmservice.utils.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.templateresolver.StringTemplateResolver;

import javax.annotation.Resource;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 邮件模板 服务实现类
 *
 * @author Ethan Li
 * @since 2022-12-12
 */
@Service
public class EmailTemplateServiceImpl extends ServiceImpl<EmailTemplateMapper, EmailTemplate> implements EmailTemplateService {

    @Resource
    private EmailTemplateMapper emailTemplateMapper;

    private TemplateEngine templateEngine;

    /**
     * EmailTemplateServiceImpl
     */
    public EmailTemplateServiceImpl() {
        templateEngine = new TemplateEngine();
        StringTemplateResolver stringTemplateResolver = new StringTemplateResolver();
        templateEngine.addTemplateResolver(stringTemplateResolver);
    }

    @Override
    public List<EmailTemplate> selectEmailTemplateList(EmailTemplate emailTemplate) {
        QueryWrapper<EmailTemplate> wrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(emailTemplate.getName())) {
            wrapper.eq("name", emailTemplate.getName());
        }
        return emailTemplateMapper.selectList(wrapper);
    }

    @Override
    public EmailTemplate selectEmailTemplateById(Long templateId) {
        EmailTemplate emailTemplate = emailTemplateMapper.selectById(templateId);
        if (emailTemplate != null && emailTemplate.getId() != null) {
            QueryWrapper<EmailTemplate> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("id", emailTemplate.getId());
            //获取模板内容
            String templateLable = emailTemplate.getTemplateHtml();
            // 使用正则匹配方式
            Pattern p = Pattern.compile("\\$\\[(.*?)]\\$");
            // 匹配$[]$
            Matcher matcher = p.matcher(templateLable);
            Map map = new HashMap<>();
            // 处理匹配到的值
            while (matcher.find()) {
                //替换$[]$为“”
                String lable = matcher.group().replaceAll("\\$\\[", "").replaceAll("\\]\\$", "");
                map.put(matcher.group().replaceAll("\\$\\[", "").replaceAll("\\]\\$", ""), lable);
            }
            emailTemplate.setLabel(map);
        }
        return emailTemplate;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<EmailTemplate> saveEmailTemplate(List<EmailTemplate> emailTemplateList) {
        List<EmailTemplate> newEmailTemplateList = new ArrayList<>();
        for (EmailTemplate emailTemplate : emailTemplateList) {
            LambdaQueryWrapper<EmailTemplate> lambdaQueryWrapper = Wrappers.<EmailTemplate>lambdaQuery().eq(EmailTemplate::getName, emailTemplate);
            // save
            if (ObjectUtils.isEmpty(emailTemplate.getId())) {
                EmailTemplate et = emailTemplateMapper.selectOne(lambdaQueryWrapper);
                Assert.checkArgument(ObjectUtils.isEmpty(et), "The template name already exists.");
                emailTemplateMapper.insert(emailTemplate);
            } else {
                //update
                lambdaQueryWrapper.ne(EmailTemplate::getId, emailTemplate.getId());
                EmailTemplate et = emailTemplateMapper.selectOne(lambdaQueryWrapper);
                Assert.checkArgument(ObjectUtils.isEmpty(et), "The template name already exists.");
                emailTemplateMapper.updateById(emailTemplate);
            }
            newEmailTemplateList.add(emailTemplate);
        }
        return newEmailTemplateList;
    }

    @Override
    public int deleteByIds(Long[] ids) {
        return emailTemplateMapper.deleteBatchIds(Arrays.asList(ids));
    }

    @Override
    public TemplateEngine getTemplateEngine() {
        return templateEngine;
    }

    @Override
    public List<EmailTemplate> isRepetition(String name) {
        QueryWrapper<EmailTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("name", name);
        return emailTemplateMapper.selectList(wrapper);
    }
}
