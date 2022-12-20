package com.crm.crmservice.service;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.OperLog;
import com.crm.crmservice.entity.param.OperLogQueryParam;
import com.crm.crmservice.entity.vo.OperLogVo;


/**
* @description 针对表【oper_log(oper_log)】的数据库操作Service
*/
public interface OperLogService extends IService<OperLog> {
    /**
     * getOperLogForPage
     * @param param
     * @return
     */
    IPage<OperLogVo> getOperlogPage(OperLogQueryParam param);

}
