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
        //??????????????????????????????????????????????????? ??????chang request form
        if (attach.length > 0) {
            if (filePojo != null) {
                // ???????????????????????????????????????
                filePojo.setRequestNo(changeRequest.getRequestNo());
            }
            List<CrmFile> crmFileList = crmFileService.uploadFile(attach, filePojo);
            Assert.checkArgument(crmFileList != null && !crmFileList.isEmpty(), CommonField.OPERATION_FAILURE);
        }
        //??????
        if (StringUtils.equals(type, "save")) {
            changeRequestMapper.insert(changeRequest);
        }
        //??????
        if (StringUtils.equals(type, "update")) {
            // ????????????????????????????????????????????????
            if (rejected) {
                // ???????????? Edit Form, Complete todo??????
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
        //??????
        if (changeRequestForm.getIsSubmit()) {
            // status submit
            changeRequest.setRequestStatus("20");
            changeRequest.setRequestStatusValue("Submitted");
            changeRequest.setSubmittedBy(changeRequest.getCorpId());
            changeRequest.setSubmissionDate(new Date());
            // ??????????????????
            StartProcess startProcess = new StartProcess();
            startProcess.setProcessDefinitionKey("Change_form");
            startProcess.setBusinessKey(changeRequest.getRequestNo());
            Map<String, Object> variables = new HashMap<>();
            String startUser = changeRequest.getCorpId() + "(" + changeRequest.getTeam() + ")";
            // TODO LCB371
            variables.put("duration", "PT60S");
            // ?????????
            variables.put("isUrgentChange", true);
            // ????????????
            //variables.put("isUrgentChange", false);
            // ??????????????????
            // variables.put("isStandand", true);
            // ???????????????????????????
            variables.put("isStandand", false);
            // ????????????????????????
            //variables.put("hasRfc", false);
            variables.put("hasRfc", true);
            // ????????????????????????
            variables.put("impacters", Arrays.asList("LCB37111", "LCB37122", "LCB37133"));
            // ????????????????????????
            variables.put("requester", startUser);
            variables.put("withdraw", "LCB371(SC1)");
            //high low medium
            //variables.put("impact", "high");
            //variables.put("impact", "medium");
            variables.put("impact", "low");
            //??????
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
