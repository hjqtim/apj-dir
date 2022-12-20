package com.crm.crmservice.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.ApprovalRecord;
import com.crm.crmservice.entity.param.ApprovalRecordQueryParam;
import com.crm.crmservice.mapper.ApprovalRecordMapper;
import com.crm.crmservice.service.ApprovalRecordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

/**
 * @author lcb371
 */
@Service
public class ApprovalRecordServiceImpl extends ServiceImpl<ApprovalRecordMapper, ApprovalRecord> implements ApprovalRecordService {

    @Resource
    private ApprovalRecordMapper approvalRecordMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean saveApprovalRecord(ApprovalRecord approvalRecord, boolean b) {
        int insert = approvalRecordMapper.insert(approvalRecord);
        if (insert > 0 && b) {
            approvalRecordMapper.update(null,
                    Wrappers.<ApprovalRecord>lambdaUpdate().set(ApprovalRecord::getBright, "2")
                            // where
                            .eq(ApprovalRecord::getRequestNo, approvalRecord.getRequestNo()).eq(ApprovalRecord::getBright, "1")
                            .ne(ApprovalRecord::getRequestStatus, "20"));
        }
        return true;
    }

    @Override
    public IPage<ApprovalRecord> approvalRecordPage(ApprovalRecordQueryParam param) {
        Page<ApprovalRecord> page = new Page<>(param.getPageIndex(), param.getPageSize());
        return approvalRecordMapper.selectApprovalRecordPage(page, param);
    }

    @Override
    public IPage<ApprovalRecord> completedPage(ApprovalRecordQueryParam param) {
        Page<ApprovalRecord> page = new Page<>(param.getPageIndex(), param.getPageSize());
        return approvalRecordMapper.selectCompletedPage(page, param);
    }
}
