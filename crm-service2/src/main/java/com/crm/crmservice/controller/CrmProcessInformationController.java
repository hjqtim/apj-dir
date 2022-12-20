package com.crm.crmservice.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.EmailErrorLog;
import com.crm.crmservice.entity.param.EmailErrorLogQueryParam;
import com.crm.crmservice.entity.param.ProcessSendEmailParam;
import com.crm.crmservice.service.EmailErrorLogService;
import com.crm.crmservice.service.CrmProcessSendEmailService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

//@Api(tags = "crm process information")
@RestController
@RequestMapping("crmProcessInformation")
@Slf4j
public class CrmProcessInformationController {

    @Autowired
    private CrmProcessSendEmailService crmProcessSendEmailService;

    @Autowired
    private EmailErrorLogService emailErrorLogService;

    @Value("${spring.profiles.active}")
    private String active;

    @ApiOperation("processSendEmail")
    @PostMapping("processSendEmail")
    public ResultVo processSendEmail(@RequestBody ProcessSendEmailParam param){
        crmProcessSendEmailService.sendCrmProcessMailForProd(param);
        return ResultVo.success();
    }

    @ApiOperation("get page for email error log")
    @GetMapping("getPage4EmailErrorLog")
    public ResultVo<IPage<EmailErrorLog>> getPage4EmailErrorLog(EmailErrorLogQueryParam param){
        return ResultVo.success(emailErrorLogService.getPage(param));
    }

}
