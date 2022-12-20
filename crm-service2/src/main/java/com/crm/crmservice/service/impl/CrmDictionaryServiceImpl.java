package com.crm.crmservice.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.CrmDictionary;
import com.crm.crmservice.entity.param.CrmDictionaryQueryParam;
import com.crm.crmservice.mapper.CrmDictionaryMapper;
import com.crm.crmservice.service.CrmDictionaryService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author lcb371
 */
@Service
public class CrmDictionaryServiceImpl extends ServiceImpl<CrmDictionaryMapper, CrmDictionary> implements CrmDictionaryService {

    @Resource
    private CrmDictionaryMapper crmDictionaryMapper;

    @Override
    public IPage<CrmDictionary> crmDictionaryPage(CrmDictionaryQueryParam param) {
        Page<CrmDictionary> page = new Page<>(param.getPageIndex(), param.getPageSize());
        return crmDictionaryMapper.selectCrmDictionaryPage(page, param);
    }

    @Override
    public Map<String, String> listMap(String type) {
        Map<String, String> map = new HashMap<>(16);
        List<CrmDictionary> crmDictionaries = crmDictionaryMapper.selectList(Wrappers.<CrmDictionary>lambdaQuery().eq(CrmDictionary::getType, type));
        for (CrmDictionary crmDictionary : crmDictionaries) {
            map.put(crmDictionary.getDictKey(), crmDictionary.getDictValue());
        }
        return map;
    }

    @Override
    public List<CrmDictionary> list(String type) {
        return crmDictionaryMapper.selectList(Wrappers.<CrmDictionary>lambdaQuery().eq(CrmDictionary::getType, type));
    }

}
