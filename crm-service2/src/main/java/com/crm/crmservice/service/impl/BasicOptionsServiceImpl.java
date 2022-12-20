package com.crm.crmservice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.BasicOptions;
import com.crm.crmservice.mapper.BasicOptionsMapper;
import com.crm.crmservice.service.BasicOptionsService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Service
public class BasicOptionsServiceImpl extends ServiceImpl<BasicOptionsMapper, BasicOptions> implements BasicOptionsService {

    @Resource
    private BasicOptionsMapper basicOptionsMapper;

    @Override
    public List<BasicOptions> getBasicOptionList(String optionKey) {
        QueryWrapper<BasicOptions> wrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(optionKey)){
            wrapper.like("option_key",optionKey);
            if (!(optionKey.equals("Scope of Change") || optionKey.equals("Past Change History") || optionKey.equals("Past Incidents in Product") ||
                optionKey.equals("Error Budget") || optionKey.equals("Change Dependancy (Call-out to)") || optionKey.equals("Change Dependancy (Call-out by)") ||
                optionKey.equals("Change Impact to Own Project"))){
                wrapper.orderByAsc("option_value");
            }
        }
        return basicOptionsMapper.selectList(wrapper);
    }

    @Override
    public List<String> getOptionKeyList() {
        return basicOptionsMapper.getOptionKeyList();
    }
}
