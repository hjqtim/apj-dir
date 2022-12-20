package com.crm.crmservice.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.crm.crmservice.common.constant.CommonField;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.ApprovalRecord;
import com.crm.crmservice.entity.CrmDictionary;
import com.crm.crmservice.entity.param.ApprovalRecordQueryParam;
import com.crm.crmservice.entity.param.CrmDictionaryQueryParam;
import com.crm.crmservice.service.CrmDictionaryService;
import com.crm.crmservice.utils.Assert;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

/**
 * @author lcb371
 */
@Api(tags = "Crm Dictionary")
@RestController
@RequestMapping("/crmDictionary")
public class CrmDictionaryController {

    @Resource
    private CrmDictionaryService crmDictionaryService;

    @ApiOperation("Crm Dictionary Page")
    @PostMapping("/crmDictionaryPage")
    public ResultVo<IPage<CrmDictionary>> crmDictionaryPage(@RequestBody CrmDictionaryQueryParam param) {
        IPage<CrmDictionary> dataPage = crmDictionaryService.crmDictionaryPage(param);
        return ResultVo.success(dataPage);
    }

    @ApiOperation("get CrmDictionary List")
    @GetMapping("/getCrmDictionaryList")
    public Map<String, Object> getCrmDictionaryList(String type) {
        Assert.checkNotNull(type, CommonField.TYPE_EMPTY);
        return ResponseBuilder.ok(crmDictionaryService.list(Wrappers.<CrmDictionary>lambdaQuery().eq(CrmDictionary::getType, type)));
    }

    @ApiOperation("get CrmDictionary Map")
    @GetMapping("/getCrmDictionaryMap")
    public Map<String, Object> getCrmDictionaryMap(String type) {
        Assert.checkNotNull(type, CommonField.TYPE_EMPTY);
        return ResponseBuilder.ok(crmDictionaryService.listMap(type));
    }

    @ApiOperation("get CrmDictionary Map")
    @GetMapping("/saveOrUpdateCrmDictionary")
    public Map<String, Object> saveOrUpdateCrmDictionary(@RequestBody CrmDictionary param) {
        Assert.checkNotNull(param.getType(), CommonField.TYPE_EMPTY);
        Assert.checkNotNull(param.getDictKey(), "dict key cannot be empty.");
        Assert.checkNotNull(param.getDictValue(), "dict value cannot be empty.");
        boolean b;
        if (ObjectUtils.isEmpty(param.getId())) {
            b = crmDictionaryService.save(param);
        } else {
            b = crmDictionaryService.updateById(param);
        }
        return ResponseBuilder.customize(b);
    }
}

