package com.crm.crmservice.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.Approvers;

import java.util.List;

/**
 *  服务类
 * @author Ethan Li
 * @since 2022-11-21
 */
public interface ApproversService extends IService<Approvers> {

    List<Approvers> getApproverList(String userGroup);
    List<Approvers> saveApprover(List<Approvers> approvers);
    int deleteByIds(Long[] ids);
}
