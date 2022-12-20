package com.crm.crmservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.entity.ApprovalRecord;
import com.crm.crmservice.entity.ChangeRequest;
import com.crm.crmservice.entity.param.ApprovalRecordQueryParam;
import com.crm.crmservice.entity.param.ChangeRequestQueryParam;
import org.apache.ibatis.annotations.Param;

/**
 * @author lcb371
 */
public interface ApprovalRecordMapper extends BaseMapper<ApprovalRecord> {
    IPage<ApprovalRecord> selectApprovalRecordPage(Page<ApprovalRecord> page, @Param(value = "param") ApprovalRecordQueryParam param);

    IPage<ApprovalRecord> selectCompletedPage(Page<ApprovalRecord> page, ApprovalRecordQueryParam param);
}
