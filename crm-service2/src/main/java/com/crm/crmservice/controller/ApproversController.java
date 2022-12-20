package com.crm.crmservice.controller;


import com.crm.crmservice.entity.Approvers;
import com.crm.crmservice.service.ApproversService;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Api(tags = "Approvers")
@RestController
@RequestMapping("/approvers")
public class ApproversController {

    @Autowired
    private ApproversService approversService;

    @ApiOperation("getApproversList")
    @GetMapping("/getApproverList")
    public Map<String,Object> getApproverList(String userGroup){
        Map<String,Object> map = new HashMap<>();
        List<Approvers> approverList = approversService.getApproverList(userGroup);
        if (approverList!=null && !approverList.isEmpty()){
            map.put("total",approverList.size());
            map.put("approverList",approverList);
        }
        return ResponseBuilder.ok(map);
    }

    /**
     * save Approver
     */
    @ApiOperation("Save Approver")
    @PostMapping("/saveApprover")
    @ResponseBody
    public Map<String,Object> saveApprover(@RequestBody List<Approvers> approvers) {
        Map<String,Object> map = new HashMap<>();
        List<Approvers> approverList = approversService.saveApprover(approvers);
        if (approverList!=null && !approverList.isEmpty()){
            map.put("total",approverList.size());
            map.put("approverList",approverList);
        }
        return ResponseBuilder.ok(map);
    }

    /**
     * delete Approver
     */
    @ApiOperation(value = "Delete Approver")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "ids:(1,2,3)", required = true, name = "ids")
    })
    @DeleteMapping("/deleteApprover/{ids}")
    public Map<String, Object> deleteApprover(@PathVariable Long[] ids){
        int i = approversService.deleteByIds(ids);
        if (i > 0) {
            return ResponseBuilder.ok();
        }
        return ResponseBuilder.fail();
    }



}

