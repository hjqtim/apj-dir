package com.crm.crmservice.controller;


import com.crm.crmservice.entity.BasicOptions;
import com.crm.crmservice.entity.vo.BasicOptionsVo;
import com.crm.crmservice.service.BasicOptionsService;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Api(tags = "Basic Options")
@RestController
@RequestMapping("/basicOptions")
public class BasicOptionsController {

    @Autowired
    private BasicOptionsService basicOptionsService;

    @ApiOperation("getBasicOptionList")
    @GetMapping("/getBasicOptionList")
    public Map<String,Object> getBasicOptionList(String optionKey){
        Map<String,Object> map = new HashMap<>();
        List<BasicOptionsVo> list = new ArrayList<>();
        List<BasicOptions> basicOptionList = basicOptionsService.getBasicOptionList(optionKey);
        if (basicOptionList!=null && !basicOptionList.isEmpty()){
            for (BasicOptions basicOptionsFor : basicOptionList){
                BasicOptionsVo basicOptionsVo = new BasicOptionsVo();
                BeanUtils.copyProperties(basicOptionsFor,basicOptionsVo);
                list.add(basicOptionsVo);
            }
            map.put("total",list.size());
            map.put("optionList",list);
        }
        return ResponseBuilder.ok(map);
    }

    @ApiOperation("getOptionKeyList")
    @GetMapping("/getOptionKeyList")
    public Map<String,Object> getOptionKeyList(){
        return ResponseBuilder.ok(basicOptionsService.getOptionKeyList());
    }

}

