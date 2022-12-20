package com.crm.crmservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.crm.crmservice.entity.OperLog;
import com.crm.crmservice.entity.param.OperLogQueryParam;
import com.crm.crmservice.entity.vo.OperLogVo;
import org.apache.ibatis.annotations.Param;

/**
 * @description operation to oper_log for dao
 */
public interface OperLogMapper extends BaseMapper<OperLog> {

    /**
     * select oper_log information for page
     *
     * @param page  page information
     * @param param query param
     * @return
     */
    IPage<OperLogVo> selectOperIpageList(IPage<OperLogVo> page, @Param("param") OperLogQueryParam param);

}
