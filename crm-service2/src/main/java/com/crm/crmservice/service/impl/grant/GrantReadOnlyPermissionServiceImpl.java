package com.crm.crmservice.service.impl.grant;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.common.enums.ResultCode;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.grant.GrantReadOnlyPermission;
import com.crm.crmservice.entity.vo.grant.GrantReadOnlyPermissionPageVo;
import com.crm.crmservice.entity.vo.grant.GrantReadOnlyPermissionVo;
import com.crm.crmservice.mapper.GrantReadOnlyPermissionMapper;
import com.crm.crmservice.service.grant.GrantReadOnlyPermissionService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * GrantReadOnlyPermission
 */
@Service
public class GrantReadOnlyPermissionServiceImpl extends ServiceImpl<GrantReadOnlyPermissionMapper, GrantReadOnlyPermission> implements GrantReadOnlyPermissionService {

    public ResultVo<GrantReadOnlyPermission> add(GrantReadOnlyPermissionVo vo){
        GrantReadOnlyPermission entity = new GrantReadOnlyPermission();
        final List<GrantReadOnlyPermission> list = this.lambdaQuery().eq(GrantReadOnlyPermission::getIsDelete, "0")
                .eq(GrantReadOnlyPermission::getGrantLoginId, vo.getGrantLoginId())
                .eq(GrantReadOnlyPermission::getLastUpdatedBy, vo.getLastUpdatedBy()).list();
        if(null!=list && !list.isEmpty())
            return new ResultVo<>(ResultCode.FAIL, "Data already exists");

        BeanUtils.copyProperties(vo, entity);
        entity.setCreatedBy(vo.getLastUpdatedBy());
        int num = this.baseMapper.insert(entity);
        if(num>0){
            return new ResultVo<>(entity);
        }
        return new ResultVo<>(ResultCode.FAIL, "error");
    }

    public ResultVo<Long> delete(Long id){
        int num = this.baseMapper.deleteById(id);
        if(num>0){
            return new ResultVo<>(id);
        }
        return new ResultVo<>(ResultCode.FAIL, "error");
    }

    public IPage<GrantReadOnlyPermission> dt(GrantReadOnlyPermissionPageVo query){
        QueryWrapper<GrantReadOnlyPermission> wrapper = new QueryWrapper<>();
        wrapper.eq("is_delete", "0");
        wrapper.eq("created_by", query.getLastUpdatedBy());
        wrapper.orderByDesc("id");
        IPage<GrantReadOnlyPermission> page = new Page<>(query.getCurrent(), query.getSize());
        IPage<GrantReadOnlyPermission> page1 = this.page(page,wrapper);
        return page1;
    }

    public List<String> readOnlyUserIds(String userId){
        List<String> list = new ArrayList<>();
        List<GrantReadOnlyPermission> queryList = this.lambdaQuery().eq(GrantReadOnlyPermission::getGrantLoginId, userId).eq(GrantReadOnlyPermission::getIsDelete, "0").list();
        final Iterator<GrantReadOnlyPermission> iterator = queryList.iterator();
        while (iterator.hasNext()){
            list.add(iterator.next().getCreatedBy());
        }
        return list;
    }

    /**
     * get groups info List
     * @param corpId
     * @return
     */
    public List<Map<String,Object>> getGroups(String corpId){
        QueryWrapper<GrantReadOnlyPermission> wrapper = new QueryWrapper<>();
        wrapper.eq("grant_login_id",corpId);
        List<GrantReadOnlyPermission> grantReadOnlyPermissions = this.baseMapper.selectList(wrapper);
        List<Map<String,Object>> groupList = new ArrayList<>();
        if (grantReadOnlyPermissions.size() != 0){
            for (GrantReadOnlyPermission grantReadOnlyPermission : grantReadOnlyPermissions) {
                if (grantReadOnlyPermission.getPersonalDetails() != null){
                    Map<String,Object> map =  JSON.parseObject(grantReadOnlyPermission.getPersonalDetails());
                    groupList.add(map);
                }
            }
        }
        return groupList;
    }
}
