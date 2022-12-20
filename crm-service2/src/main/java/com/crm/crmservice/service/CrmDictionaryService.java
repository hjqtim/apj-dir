package com.crm.crmservice.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.CrmDictionary;
import com.crm.crmservice.entity.param.CrmDictionaryQueryParam;

import java.util.List;
import java.util.Map;

/**
 * @author lcb371
 */
public interface CrmDictionaryService extends IService<CrmDictionary> {

    IPage<CrmDictionary> crmDictionaryPage(CrmDictionaryQueryParam param);

    Map<String, String> listMap(String type);

    List<CrmDictionary> list(String type);
}
