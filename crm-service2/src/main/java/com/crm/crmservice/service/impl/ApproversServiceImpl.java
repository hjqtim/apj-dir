package com.crm.crmservice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.Approvers;
import com.crm.crmservice.mapper.ApproversMapper;
import com.crm.crmservice.service.ApproversService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Service
public class ApproversServiceImpl extends ServiceImpl<ApproversMapper, Approvers> implements ApproversService {

    @Resource
    private ApproversMapper approversMapper;

    @Override
    public List<Approvers> getApproverList(String userGroup) {
        QueryWrapper<Approvers> wrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(userGroup)) {
            wrapper.eq("user_group", userGroup);
        }
        return approversMapper.selectList(wrapper);
    }

    @Override
    public List<Approvers> saveApprover(List<Approvers> approversList) {
        List<Approvers> newApproversList = new ArrayList<>();
        Approvers approvers;
        for (Approvers approversFor : approversList){
            approvers = approversMapper.selectById(approversFor.getId());
            if (approvers != null){
                BeanUtils.copyProperties(approversFor, approvers);
                approversMapper.updateById(approvers);
            }else{
                approvers = approversFor;
                approversMapper.insert(approvers);
            }
            newApproversList.add(approvers);
        }
        return newApproversList;
    }

    @Override
    public int deleteByIds(Long[] ids) {
        return approversMapper.deleteBatchIds(Arrays.asList(ids));
    }
}
