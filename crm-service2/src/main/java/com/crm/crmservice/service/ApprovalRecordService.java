package com.crm.crmservice.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.ApprovalRecord;
import com.crm.crmservice.entity.param.ApprovalRecordQueryParam;

/**
 * @author lcb371
 */
public interface ApprovalRecordService extends IService<ApprovalRecord> {

    boolean saveApprovalRecord(ApprovalRecord approvalRecord,boolean b) throws Exception;

    IPage<ApprovalRecord> approvalRecordPage(ApprovalRecordQueryParam param);

    IPage<ApprovalRecord> completedPage(ApprovalRecordQueryParam param);
}
