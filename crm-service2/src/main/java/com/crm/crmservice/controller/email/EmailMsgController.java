package com.crm.crmservice.controller.email;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.email.EmailConfig;
import com.crm.crmservice.entity.email.EmailMsg;
import com.crm.crmservice.entity.email.EmailTemplate;
import com.crm.crmservice.entity.param.email.EmailMsgQueryParam;
import com.crm.crmservice.service.email.EmailConfigService;
import com.crm.crmservice.service.email.EmailMsgService;
import com.crm.crmservice.service.email.EmailTemplateService;
import com.crm.crmservice.service.email.logoper.MyLog;
import com.crm.crmservice.utils.Assert;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

/**
 * 邮件记录 前端控制器
 *
 * @author Ethan Li
 * @since 2022-12-12
 */
@Api(tags = "Email Module")
@RestController
@RequestMapping("/emailMsg")
@Slf4j
@Configuration
public class EmailMsgController {

    private static final String DEV = "dev";
    private static final String ST = "st";
    private static final String UAT = "uat";
    private static final String TEST_SUBJECT = "_TESTING";
    private static final String TEST_TEMPLATE_HTML = "<B>THIS IS AN EMAIL FOR SYSTEM TESTING. Please don't hesitate to contact <a href=\"mailto:sense.support@ha.org.hk\">HO IT&HI SENSE Support for any queries. </a></B>";
    @Value("${spring.profiles.active}")
    private String active;
    @Resource
    private EmailMsgService emailMsgService;
    @Resource
    private EmailTemplateService emailTemplateService;

    @Resource
    private EmailConfigService emailConfigService;

    @ApiOperation("Test connect exchange Server")
    @GetMapping("/testConnection")
    public Map<String, Object> testConnection() {
        return ResponseBuilder.ok(emailMsgService.testConnection());
    }

    /**
     * 获取邮件参数配置(待定)
     */
    @ApiOperation("get send emailServer param from configuration")
    @GetMapping("/config")
    public Map<String, Object> config() {
        Map<String, EmailConfig> emailConfig = emailConfigService.selectConfigMap("email_ss", "");
        return ResponseBuilder.ok(emailConfig);
    }

    @ApiOperation("Email Msg  Page")
    @PostMapping("/emailMsgPage")
    public ResultVo<IPage<EmailMsg>> emailMsgPage(@RequestBody EmailMsgQueryParam param) throws Exception {
        LambdaQueryWrapper<EmailMsg> wrapper = Wrappers.lambdaQuery();
        wrapper.orderByDesc(EmailMsg::getCreatedDate);
        Page<EmailMsg> page1 = new Page<>(param.getPageIndex(), param.getPageSize());
        IPage<EmailMsg> dataPage = emailMsgService.page(page1, wrapper);
        return ResultVo.success(dataPage);
    }

    @ApiOperation("Send Email")
    @PostMapping("/send")
    public Map<String, Object> send(@RequestBody EmailMsgQueryParam param) {
        Assert.checkNotNull(param.getEmailTemplateId(), "The data corresponding to emailTemplateId does not exist.");
        EmailTemplate emailTemplate = emailTemplateService.selectEmailTemplateById(param.getEmailTemplateId());
        Assert.checkNotNull(emailTemplate, "The data corresponding to emailTemplate does not exist.");
        // 获取 email config
        // 过滤黑名单
        param.setTemplateHtml(emailTemplate.getTemplateHtml().replaceAll("\\$\\[", "\\$\\{").replaceAll("\\]\\$", "\\}"));
        if (DEV.equalsIgnoreCase(active) || ST.equalsIgnoreCase(active) || UAT.equalsIgnoreCase(active)) {
            //加入 标识，目的标识是哪个场发出的邮件 判断是否是DEV、ST、UAT场，是则加前缀[DEV_TEST][ST_TEST][UAT_TEST]
            log.info("加前缀[DEV_TEST][ST_TEST][UAT_TEST]...");
            param.setSubject("[" + active.toUpperCase() + TEST_SUBJECT + "] " + param.getSubject());
            param.setTemplateHtml(TEST_TEMPLATE_HTML + param.getTemplateHtml());
            // if (emailTemplate.getUrgent().equals(1)) {
            //     msgEmail.setSubject(msgEmail.getSubject() + "(紧急)");
            // }
        }
        // 开始发送邮件 并保存发送记录 TODO LCB371
        // emailMsgService.sendTemplateMail();
        return ResponseBuilder.ok();
    }

    @MyLog(value = "Deleting A Data Msg")
    @ApiOperation("deleteMsgByIds")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "ids:(1,2,3)", required = true, name = "ids")
    })
    @DeleteMapping("/remove")
    public Map<String, Object> remove(@PathVariable Long[] ids) {
        int i = emailMsgService.deleteEmailMsgByIds(ids);
        return ResponseBuilder.customize(i > 0);
    }

    @ApiOperation("GET Email Msg")
    @GetMapping("/email/{msgId}")
    public ResultVo<EmailMsg> changeRequest(@PathVariable Long msgId) {
        EmailMsg emailMsg = emailMsgService.getById(msgId);
        Assert.checkNotNull(emailMsg, "The data corresponding to msgId does not exist.");
        return ResultVo.success(emailMsg);
    }

}

