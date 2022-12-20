package com.crm.crmservice.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.service.OperLogService;
import com.crm.crmservice.entity.OperLog;
import com.crm.crmservice.entity.param.OperLogQueryParam;
import com.crm.crmservice.entity.vo.OperLogVo;
import com.crm.crmservice.mapper.OperLogMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @description 针对表【oper_log(oper_log)】的数据库操作Service实现
 */
@Service
public class OperLogServiceImpl extends ServiceImpl<OperLogMapper, OperLog>
        implements OperLogService {

    @Resource
    private OperLogMapper operLogMapper;

    @Override
    public IPage<OperLogVo> getOperlogPage(OperLogQueryParam param) {
        Page<OperLogVo> page = new Page<>();
        page.setSize(param.getPageSize());
        page.setCurrent(param.getPageIndex());
        IPage<OperLogVo> operLogVoPage = operLogMapper.selectOperIpageList(page, param);
        for (OperLogVo record : operLogVoPage.getRecords()) {
            if (record.getOperUri().indexOf("/", 2) > 0) {
                record.setModule(record.getOperUri().substring(1, record.getOperUri().indexOf("/", 2)));
            }
        }
        return operLogVoPage;
    }
}
