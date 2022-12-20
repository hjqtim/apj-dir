package com.crm.crmservice.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.crm.crmservice.common.constant.CommonField;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.ApprovalRecord;
import com.crm.crmservice.entity.BaseEntity;
import com.crm.crmservice.entity.ChangeRequest;
import com.crm.crmservice.entity.ad.User;
import com.crm.crmservice.entity.param.ApprovalRecordQueryParam;
import com.crm.crmservice.service.ApprovalRecordService;
import com.crm.crmservice.service.ChangeRequestService;
import com.crm.crmservice.service.ad.UserService;
import com.crm.crmservice.service.param.ReqNoGenerationService;
import com.crm.crmservice.utils.Assert;
import com.crm.crmservice.utils.ResponseBuilder;
import com.crm.crmservice.utils.TokenUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author lcb371
 */
@Api(tags = "Approval Record")
@RestController
@RequestMapping("/approvalRecord")
@Slf4j
public class ApprovalRecordController {

    @Resource
    private TokenUtils tokenUtils;
    @Resource
    private ReqNoGenerationService reqNoGenerationService;
    @Resource
    private ChangeRequestService changeRequestService;
    @Resource
    private ApprovalRecordService approvalRecordService;
    @Resource
    UserService userService;

    @ApiOperation(value = "save Approval Record", hidden = true)
    @PostMapping("/saveApprovalRecord")
    public Map<String, Object> saveApprovalRecord(@RequestBody ApprovalRecord param) throws Exception {
        // 1. user 表 team = chang_request 表team  2. corpId = user 表name
        if (param.getNeedCheck()) {
            if (StringUtils.isBlank(param.getCorpId()) || StringUtils.isBlank(param.getTeam())) {
                String username = tokenUtils.getUserName();
                // LCB371
                param.setCorpId(username);
                User user = userService.getOne(Wrappers.<User>lambdaQuery().eq(User::getName, username));
                param.setTeam(user.getTeam());
            }
        }
        boolean b = false;
        if (StringUtils.equals(param.getRequestStatus(), "30")) {
            b = true;
        }
        boolean bool = approvalRecordService.saveApprovalRecord(param, b);
        return ResponseBuilder.customize(bool);
    }

    @ApiOperation("Approval Record Page")
    @PostMapping("/approvalRecordPage")
    public ResultVo<IPage<ApprovalRecord>> approvalRecordPage(@RequestBody ApprovalRecordQueryParam param) throws Exception {
        IPage<ApprovalRecord> dataPage = approvalRecordService.approvalRecordPage(param);
        return ResultVo.success(dataPage);
    }

    @ApiOperation("GET Approval Record ")
    @GetMapping("/approvalRecord/{requestNo}")
    public ResultVo<Map<String, Object>> approvalRecord(@PathVariable String requestNo, @RequestParam(value = "bright", required = false) String bright) {
        Map<String, Object> map = new HashMap<>(16);
        ChangeRequest cq = changeRequestService.getOne(Wrappers.<ChangeRequest>lambdaQuery().eq(ChangeRequest::getRequestNo, requestNo));
        Assert.checkNotNull(cq, "The data corresponding to requestNo does not exist.");
        LambdaQueryWrapper<ApprovalRecord> wrapper = Wrappers.<ApprovalRecord>lambdaQuery().eq(ApprovalRecord::getRequestNo, requestNo);
        if (StringUtils.isNotBlank(bright)) {
            Assert.checkArgument(StringUtils.equals("1", bright) || StringUtils.equals("2", bright), "The highlighting tye is wong.");
            // 高亮 状态
            wrapper.eq(ApprovalRecord::getBright, bright);
        }
        wrapper.orderByDesc(BaseEntity::getCreatedDate);
        List<ApprovalRecord> list = approvalRecordService.list(wrapper);
        map.put("approvalRecord", list);
        int rejectedCount = approvalRecordService.count(Wrappers.<ApprovalRecord>lambdaQuery().eq(ApprovalRecord::getRequestNo, requestNo).eq(ApprovalRecord::getStatus, "3"));
        map.put("rejectedCount", rejectedCount);
        return ResultVo.success(map);
    }
}

