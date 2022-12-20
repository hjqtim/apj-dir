package com.crm.crmservice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.EmailErrorLog;
import com.crm.crmservice.entity.param.EmailErrorLogQueryParam;
import com.crm.crmservice.mapper.EmailErrorLogMapper;
import com.crm.crmservice.service.EmailErrorLogService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;


@Service
public class EmailErrorLogServiceImpl extends ServiceImpl<EmailErrorLogMapper, EmailErrorLog>
    implements EmailErrorLogService {

    @Override
    public Page<EmailErrorLog> getPage(EmailErrorLogQueryParam param) {
        Page<EmailErrorLog> emailErrorLogPage = new Page<>();
        emailErrorLogPage.setCurrent(param.getPageIndex());
        emailErrorLogPage.setSize(param.getPageSize());
        QueryWrapper<EmailErrorLog> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotEmpty(param.getRequestNo())){
            queryWrapper.eq("request_no",param.getRequestNo());
        }
        if(StringUtils.isNotEmpty(param.getProdNo())){
            queryWrapper.eq("prod_num",param.getProdNo());
        }
        if(param.getStartTime()!=null){
            queryWrapper.ge("created_date",param.getStartTime());
        }
        if(param.getEndTime()!=null){
            queryWrapper.le("created_date",param.getEndTime());
        }
        return super.getBaseMapper().selectPage(emailErrorLogPage,queryWrapper);
    }
}




