package com.crm.crmservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.entity.ChangeRequest;
import com.crm.crmservice.entity.param.ChangeRequestQueryParam;
import org.apache.ibatis.annotations.Param;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
public interface ChangeRequestMapper extends BaseMapper<ChangeRequest> {

    /**
     * 分页对象
     * @param page
     * @param param
     * @return
     */
    IPage<ChangeRequest> selectDraftedPage(Page<ChangeRequest> page, @Param(value = "param") ChangeRequestQueryParam param);
}
