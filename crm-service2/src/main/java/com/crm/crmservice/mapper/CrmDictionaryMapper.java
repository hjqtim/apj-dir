package com.crm.crmservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.entity.CrmDictionary;
import com.crm.crmservice.entity.param.CrmDictionaryQueryParam;
import org.apache.ibatis.annotations.Param;

/**
 * @author lcb371
 */
public interface CrmDictionaryMapper extends BaseMapper<CrmDictionary> {

    IPage<CrmDictionary> selectCrmDictionaryPage(Page<CrmDictionary> page, @Param(value = "param") CrmDictionaryQueryParam param);

}
