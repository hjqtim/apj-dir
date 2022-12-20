package com.crm.crmservice.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.common.constant.CommonField;
import com.crm.crmservice.common.constant.DictionaryConstant;
import com.crm.crmservice.entity.ApprovalRecord;
import com.crm.crmservice.entity.ChangeRequest;
import com.crm.crmservice.entity.CrmDictionary;
import com.crm.crmservice.entity.file.CrmFile;
import com.crm.crmservice.entity.param.ChangeRequestQueryParam;
import com.crm.crmservice.entity.pojo.ChangeRequestFormPojo;
import com.crm.crmservice.entity.pojo.camunda.StartProcess;
import com.crm.crmservice.entity.pojo.file.FilePojo;
import com.crm.crmservice.mapper.ChangeRequestMapper;
import com.crm.crmservice.service.ApprovalRecordService;
import com.crm.crmservice.service.CamundaService;
import com.crm.crmservice.service.ChangeRequestService;
import com.crm.crmservice.service.CrmDictionaryService;
import com.crm.crmservice.service.file.CrmFileService;
import com.crm.crmservice.utils.Assert;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.*;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Service
public class ChangeRequestServiceImpl extends ServiceImpl<ChangeRequestMapper, ChangeRequest> implements ChangeRequestService {
    @Resource
    private CrmFileService crmFileService;
    @Resource
    private ChangeRequestMapper changeRequestMapper;
    @Resource
    private CrmDictionaryService crmDictionaryService;
    @Resource
    private CamundaService camundaService;
    @Resource
    private ApprovalRecordService approvalRecordService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean saveChangeRequest(MultipartFile[] attach, FilePojo filePojo, ChangeRequestFormPojo changeRequestForm, String type, boolean rejected) throws Exception {
        ChangeRequest changeRequest = changeRequestForm.getChangeRequest();
        //先上传文件，文件上传成功之后再保存 提交chang request form
        if (attach.length > 0) {
            if (filePojo != null) {
                // 防止前台给错，后台主动赋值
                filePojo.setRequestNo(changeRequest.getRequestNo());
            }
            List<CrmFile> crmFileList = crmFileService.uploadFile(attach, filePojo);
            Assert.checkArgument(crmFileList != null && !crmFileList.isEmpty(), CommonField.OPERATION_FAILURE);
        }
        //新增
        if (StringUtils.equals(type, "save")) {
            changeRequestMapper.insert(changeRequest);
        }
        //修改
        if (StringUtils.equals(type, "update")) {
            // 驳回，继续走当前子流程，重新审核
            if (rejected) {
                // 调佣完成 Edit Form, Complete todo接口
                JSONObject jsonObject1 = camundaService.getEditFormTaskId(changeRequestForm.getProgressId());
                Assert.checkArgument(StringUtils.equals(String.valueOf(jsonObject1.get(CommonField.STATUS)), "200"), jsonObject1.get("data"));
                Map<String, Object> xx = new HashMap<>();
                xx.put("rejected", "rejected");
                JSONObject jsonObject2 = camundaService.completeTask(String.valueOf(jsonObject1.get("data")), xx);
                Assert.checkArgument(StringUtils.equals(String.valueOf(jsonObject2.get(CommonField.STATUS)), "200"), jsonObject2.get("data"));
                changeRequest.setRequestStatus("20");
                changeRequest.setRequestStatusValue("Submitted");
            }
            LambdaUpdateWrapper<ChangeRequest> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(ChangeRequest::getRequestNo, changeRequest.getRequestNo());
            changeRequestMapper.update(changeRequest, updateWrapper);
        }
        //提交
        if (changeRequestForm.getIsSubmit()) {
            // status submit
            changeRequest.setRequestStatus("20");
            changeRequest.setRequestStatusValue("Submitted");
            changeRequest.setSubmittedBy(changeRequest.getCorpId());
            changeRequest.setSubmissionDate(new Date());
            // 校验表单数据
            StartProcess startProcess = new StartProcess();
            startProcess.setProcessDefinitionKey("Change_form");
            startProcess.setBusinessKey(changeRequest.getRequestNo());
            Map<String, Object> variables = new HashMap<>();
            String startUser = changeRequest.getCorpId() + "(" + changeRequest.getTeam() + ")";
            // TODO LCB371
            variables.put("duration", "PT60S");
            // 第一道
            variables.put("isUrgentChange", true);
            // 第二大道
            //variables.put("isUrgentChange", false);
            // 第二大道上线
            // variables.put("isStandand", true);
            // 第二大道中线、下线
            variables.put("isStandand", false);
            // 第二大道排他网关
            //variables.put("hasRfc", false);
            variables.put("hasRfc", true);
            // 按照数组顺序会签
            variables.put("impacters", Arrays.asList("LCB37111", "LCB37122", "LCB37133"));
            // 信号触发停留节点
            variables.put("requester", startUser);
            variables.put("withdraw", "LCB371(SC1)");
            //high low medium
            //variables.put("impact", "high");
            //variables.put("impact", "medium");
            variables.put("impact", "low");
            //公共
            variables.put("smApproval", "LCB371(SC1)");
            variables.put("ssmApproval", "LCB371(SC1)");
            variables.put("csmApproval", "LCB371(SC1)");
            variables.put("cmbApproval", "LCB371(SC1)");//cmb?
            variables.put("cbmApproval", "LCB371(SC1)");//cbm?
            variables.put("scApproval", "LCB371(SC1)");
            variables.put("scheduleAcChange", "LCB371(SC1)");
            variables.put("updateCompletion", "LCB371(SC1)");
            startProcess.setVariables(variables);
            startProcess.setStartUser(startUser);
            JSONObject jsonObject = camundaService.startCamunda(startProcess);
            Assert.checkArgument(StringUtils.equals(String.valueOf(jsonObject.get("status")), "200"), "start process fail.");
            changeRequest.setProgressId(jsonObject.get("data").toString());
            LambdaUpdateWrapper<ChangeRequest> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(ChangeRequest::getRequestNo, changeRequest.getRequestNo());
            changeRequestMapper.update(changeRequest, updateWrapper);
            approvalRecordService.saveApprovalRecord(new ApprovalRecord(changeRequest.getRequestNo(), changeRequest.getProgressId(),
                    changeRequest.getCorpId(), changeRequest.getTeam(), startUser + " submit workflow."), false);
        }
        return true;
    }

    @Override
    public IPage<ChangeRequest> draftedPage(ChangeRequestQueryParam param) {
        Page<ChangeRequest> page = new Page<>(param.getPageIndex(), param.getPageSize());
        return changeRequestMapper.selectDraftedPage(page, param);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateChangeRequestStatus(ChangeRequest param) {
        CrmDictionary crmDictionary = crmDictionaryService.getOne(Wrappers.<CrmDictionary>lambdaQuery().eq(CrmDictionary::getType, DictionaryConstant.REQUEST_STATUS).eq(CrmDictionary::getDictKey, param.getRequestStatus()));
        LambdaUpdateWrapper<ChangeRequest> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(ChangeRequest::getRequestNo, param.getRequestNo());
        updateWrapper.set(ChangeRequest::getRequestStatus, param.getRequestStatus()).set(ChangeRequest::getRequestStatusValue, crmDictionary.getDictValue());
        return changeRequestMapper.update(null, updateWrapper) > 0;
    }
}
