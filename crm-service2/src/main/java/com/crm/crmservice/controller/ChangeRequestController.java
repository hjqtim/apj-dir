package com.crm.crmservice.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.crm.crmservice.common.constant.DictionaryConstant;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.ApprovalRecord;
import com.crm.crmservice.entity.BaseEntity;
import com.crm.crmservice.entity.ChangeRequest;
import com.crm.crmservice.entity.CrmDictionary;
import com.crm.crmservice.entity.ad.User;
import com.crm.crmservice.entity.param.ApprovalRecordQueryParam;
import com.crm.crmservice.entity.param.ChangeRequestQueryParam;
import com.crm.crmservice.entity.pojo.ChangeRequestFormPojo;
import com.crm.crmservice.entity.pojo.file.FilePojo;
import com.crm.crmservice.entity.vo.ApproverVo;
import com.crm.crmservice.service.ApprovalRecordService;
import com.crm.crmservice.service.ChangeRequestService;
import com.crm.crmservice.service.CrmDictionaryService;
import com.crm.crmservice.service.ad.UserService;
import com.crm.crmservice.service.param.ReqNoGenerationService;
import com.crm.crmservice.utils.Assert;
import com.crm.crmservice.utils.ResponseBuilder;
import com.crm.crmservice.utils.TokenUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Api(tags = "Request Module")
@RestController
@RequestMapping("/changeRequest")
@Slf4j
public class ChangeRequestController {
    @Resource
    UserService userService;
    @Resource
    private TokenUtils tokenUtils;
    @Resource
    private ReqNoGenerationService reqNoGenerationService;
    @Resource
    private ChangeRequestService changeRequestService;
    @Resource
    private ApprovalRecordService approvalRecordService;
    @Resource
    private CrmDictionaryService crmDictionaryService;

    @ApiOperation("drafted Page")
    @PostMapping("/draftedPage")
    public ResultVo<IPage<ChangeRequest>> draftedPage(@RequestBody ChangeRequestQueryParam param) {
        String username = tokenUtils.getUserName();
        // my
        if (StringUtils.equals(param.getType(), "1")) {
            param.setCorpId(username);
            param.setTeam(null);
        }
        // team
        if (StringUtils.equals(param.getType(), "2")) {
            User user = userService.getOne(Wrappers.<User>lambdaQuery().eq(User::getName, username));
            param.setCorpId(null);
            param.setTeam(user.getTeam());
        }
        IPage<ChangeRequest> dataPage = changeRequestService.draftedPage(param);
        return ResultVo.success(dataPage);
    }

    @ApiOperation("completed Page")
    @PostMapping("/completedPage")
    public ResultVo<IPage<ApprovalRecord>> completedPage(@RequestBody ApprovalRecordQueryParam param) {
        String username = tokenUtils.getUserName();
        param.setCorpId(username);
        // my
        if (StringUtils.equals(param.getType(), "1")) {
            param.setCorpId(username);
            param.setTeam(null);
        }
        // team
        if (StringUtils.equals(param.getType(), "2")) {
            User user = userService.getOne(Wrappers.<User>lambdaQuery().eq(User::getName, username));
            param.setCorpId(null);
            param.setTeam(user.getTeam());
        }
        IPage<ApprovalRecord> dataPage = approvalRecordService.completedPage(param);
        return ResultVo.success(dataPage);
    }

    @ApiOperation(value = "update change request", hidden = true)
    @PostMapping("/updateChangeRequestStatus")
    public Map<String, Object> updateChangeRequestStatus(@RequestBody ChangeRequest param) {
        boolean update = changeRequestService.updateChangeRequestStatus(param);
        return ResponseBuilder.customize(update);
    }

    /**
     * Save the change request form
     *
     * @param changeRequestForm
     * @return
     */
    @ApiOperation(value = "Save change request form", notes = "Abbreviate yes or No")
    @PostMapping("/saveChangeRequest")
    public Map<String, Object> saveChangeRequest(@RequestParam(value = "file", required = false) MultipartFile[] attach,
                                                 @RequestPart("filePojo") FilePojo filePojo,
                                                 @RequestPart("changeRequestForm") ChangeRequestFormPojo changeRequestForm) throws Exception {
        ChangeRequest changeRequest = changeRequestForm.getChangeRequest();
        // Username that gets the request header token
        String username = tokenUtils.getUserName();
        // saved
        changeRequest.setRequestStatus("10");
        changeRequest.setRequestStatusValue("Saved");
        //获取是否有requestNo
        String processRequestNo = changeRequest.getRequestNo();
        String type = "save";
        boolean rejected = false;
        // save
        if (StringUtils.isBlank(processRequestNo)) {
            //没有则生成requestNo，格式：CR年月日001（例如CR221214001）
            processRequestNo = reqNoGenerationService.ReqNo();
            changeRequest.setRequestNo("CR"+processRequestNo);
            changeRequest.setCorpId(username);
            User user = userService.getOne(Wrappers.<User>lambdaQuery().eq(User::getName, username));
            changeRequest.setDisplayName(user.getDisplayName());
            changeRequest.setTitle(user.getTitle());
        } else {
            // update
            ChangeRequest cq = changeRequestService.getOne(Wrappers.<ChangeRequest>lambdaQuery().eq(ChangeRequest::getRequestNo, changeRequest.getRequestNo()));
            Assert.checkNotNull(cq, "The data corresponding to requestNo does not exist.");
            Assert.checkArgument((StringUtils.equals(cq.getRequestStatus(), "10") || StringUtils.equals(cq.getRequestStatus(), "30")), "Only the draft or rejected state can be modified.");
            changeRequest.setRequestStatus(cq.getRequestStatus());
            changeRequest.setRequestStatusValue(cq.getRequestStatusValue());
            changeRequest.setCorpId(cq.getCorpId());
            changeRequest.setProgressId(cq.getProgressId());
            changeRequest.setTeam(cq.getTeam());
            changeRequest.setDisplayName(cq.getDisplayName());
            changeRequest.setTitle(cq.getTitle());
            changeRequest.setCreatedBy(null);
            changeRequest.setSubmittedBy(null);
            type = "update";
            if (StringUtils.equals(cq.getRequestStatus(), "30")) {
                // 重启流程，不在发起流程
                changeRequestForm.setIsSubmit(false);
                rejected = true;
                changeRequestForm.setProgressId(cq.getProgressId());
            }
        }
        boolean b = changeRequestService.saveChangeRequest(attach, filePojo, changeRequestForm, type, rejected);
        return ResponseBuilder.customize(b, changeRequest.getRequestNo());
    }

    @ApiOperation("GET Change Request")
    @GetMapping("/changeRequest/{requestNo}")
    public ResultVo<Map<String, Object>> changeRequest(@PathVariable String requestNo) {
        Map<String, Object> map = new HashMap<>(16);
        ChangeRequest cq = changeRequestService.getOne(Wrappers.<ChangeRequest>lambdaQuery().eq(ChangeRequest::getRequestNo, requestNo));
        Assert.checkNotNull(cq, "The data corresponding to requestNo does not exist.");
        map.put("changeRequest", cq);
        int rejectedFrequency = approvalRecordService.count(Wrappers.<ApprovalRecord>lambdaQuery().eq(ApprovalRecord::getRequestNo, requestNo).eq(ApprovalRecord::getStatus, "3"));
        map.put("rejectedFrequency", rejectedFrequency);
        Map<String, String> mapDict = new HashMap<>(16);
        List<CrmDictionary> crmDictionaries = crmDictionaryService.list(DictionaryConstant.REQUEST_STATUS);
        List<String> dictKeys = crmDictionaries.stream().map(CrmDictionary::getDictKey).collect(Collectors.toList());
        for (CrmDictionary crmDictionary : crmDictionaries) {
            mapDict.put(crmDictionary.getDictKey(), crmDictionary.getDictValue());
        }
        List<ApprovalRecord> list = approvalRecordService.list(Wrappers.<ApprovalRecord>lambdaQuery().eq(ApprovalRecord::getRequestNo, requestNo).eq(ApprovalRecord::getBright, 1)
                .in(ApprovalRecord::getRequestStatus, dictKeys).orderByDesc(BaseEntity::getCreatedDate));
        List<ApproverVo> approvers = new ArrayList<>();
        for (CrmDictionary crmDictionary : crmDictionaries) {
            if (StringUtils.equals("10", crmDictionary.getDictKey()) || StringUtils.equals("140", crmDictionary.getDictKey())) {
                continue;
            }
            ApproverVo approverVo = new ApproverVo();
            approverVo.setProgress(crmDictionary.getDictValue());
            for (ApprovalRecord approvalRecord : list) {
                if (StringUtils.equals(approvalRecord.getRequestStatus(), crmDictionary.getDictKey())) {
                    approverVo.setState(true);
                    approverVo.setApprover(approvalRecord.getCorpId());
                    approverVo.setTeam(approvalRecord.getTeam());
                    approverVo.setComments(approvalRecord.getRemark());
                    approverVo.setActionTime(approvalRecord.getCreatedDate());
                    break;
                }
            }
            approvers.add(approverVo);
        }
        map.put("approver", approvers);
        return ResultVo.success(map);
    }

    @ApiOperation("GET Change Request List")
    @PostMapping("/changeRequestList")
    public ResultVo<List<ChangeRequest>> changeRequestList(@RequestBody ChangeRequest param) {
        Assert.checkNotNull(param.getRequestNos(), "The data corresponding to requestNos does not exists");
        List<ChangeRequest> list = changeRequestService.list(Wrappers.<ChangeRequest>lambdaQuery().in(ChangeRequest::getRequestNo, param.getRequestNos()));
        return ResultVo.success(list);
    }

}

