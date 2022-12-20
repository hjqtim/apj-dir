package com.crm.crmservice.controller.email;


import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.common.constant.CommonField;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.BaseEntity;
import com.crm.crmservice.entity.email.EmailTemplate;
import com.crm.crmservice.entity.param.email.EmailTemplateQueryParam;
import com.crm.crmservice.service.email.EmailTemplateService;
import com.crm.crmservice.service.email.logoper.MyLog;
import com.crm.crmservice.service.file.CrmFileService;
import com.crm.crmservice.utils.Assert;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * 邮件模板
 *
 * @author Ethan Li
 * @since 2022-12-12
 */
@Api(tags = "Email Template")
@RestController
@RequestMapping("/emailTemplate")
@Slf4j
public class EmailTemplateController {

    @Autowired
    private EmailTemplateService emailTemplateService;
    @Resource
    private CrmFileService crmFileService;

    @ApiOperation("Email Template  Page")
    @PostMapping("/emailTemplatePage")
    public ResultVo<IPage<EmailTemplate>> approvalRecordPage(@RequestBody EmailTemplateQueryParam param) throws Exception {
        LambdaQueryWrapper<EmailTemplate> wrapper = Wrappers.lambdaQuery();
        wrapper.likeRight(StrUtil.isNotEmpty(param.getName()), EmailTemplate::getName, param.getName());
        wrapper.likeRight(StrUtil.isNotEmpty(param.getRemark()), EmailTemplate::getRemark, param.getRemark());
        wrapper.orderByDesc(BaseEntity::getCreatedDate);
        Page<EmailTemplate> page1 = new Page<>(param.getPageIndex(), param.getPageSize());
        IPage<EmailTemplate> dataPage = emailTemplateService.page(page1, wrapper);
        return ResultVo.success(dataPage);
    }

    //查询数据模板列表.
    @MyLog(value = "Querying A Data Template")
    @ApiOperation("getTemplateList")
    @PostMapping("/list")
    public Map<String, Object> list(@RequestBody EmailTemplate emailTemplate) {
        return ResponseBuilder.ok(emailTemplateService.selectEmailTemplateList(emailTemplate));
    }

    //新增保存数据模板.
    @MyLog(value = "Save Or Update Template")
    @ApiOperation("SaveOrUpdateTemplate")
    @PostMapping("/saveOrUpdateTemplate")
    public Map<String, Object> saveOrUpdateTemplate(@RequestBody List<EmailTemplate> emailTemplate) {
        Assert.checkArgument(emailTemplate.size() > 0, CommonField.PARAMETER_IS_NULL);
        for (EmailTemplate template : emailTemplate) {
            Assert.checkNotNull(template.getName(), "The data corresponding to name does not exist.");
            Assert.checkNotNull(template.getTemplateHtml(), "The data corresponding to templateHtml does not exist.");
        }
        return ResponseBuilder.ok(emailTemplateService.saveEmailTemplate(emailTemplate));
    }

    @MyLog(value = "Get The Data Template")
    @ApiOperation("getTemplateById")
    @GetMapping("/getTemplateById/{emailTemplateId}")
    public Map<String, Object> getTemplateById(@PathVariable Long emailTemplateId) {
        //根据模板ID查询模板
        EmailTemplate emailTemplate = emailTemplateService.selectEmailTemplateById(emailTemplateId);
        Assert.checkNotNull(emailTemplate, "The data corresponding to emailTemplateId does not exist.");
        //根据模板ID从fileService获取该模板的附件
        emailTemplate.setFiles(crmFileService.getFileByTemplateIdList(emailTemplateId));
        return ResponseBuilder.ok(emailTemplate);
    }

    @MyLog(value = "Deleting A Data Template")
    @ApiOperation("deleteTemplateByIds")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "ids:(1,2,3)", required = true, name = "ids")
    })
    @DeleteMapping("/remove")
    public Map<String, Object> remove(@PathVariable Long[] ids) {
        int i = emailTemplateService.deleteByIds(ids);
        return ResponseBuilder.customize(i > 0);
    }

    //检测模板是否已存在
    @MyLog(value = "Inspection Template")
    @ApiOperation("CheckTemplateByName")
    @GetMapping("/isRepetition/{name}")
    public Map<String, Object> isRepetition(@PathVariable("name") String name) {
        List<EmailTemplate> repetition = emailTemplateService.isRepetition(name);
        if (repetition.size() > 0) {
            return ResponseBuilder.ok("1", CommonField.HAVE_MOULD_NAME);
        }
        return ResponseBuilder.ok("0", CommonField.NOT_MOULD_NAME);
    }

}

