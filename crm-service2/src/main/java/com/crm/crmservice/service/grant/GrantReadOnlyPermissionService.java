package com.crm.crmservice.service.grant;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.grant.GrantReadOnlyPermission;
import com.crm.crmservice.entity.vo.grant.GrantReadOnlyPermissionPageVo;
import com.crm.crmservice.entity.vo.grant.GrantReadOnlyPermissionVo;

import java.util.List;
import java.util.Map;

/**
 * @author :Sam Li
 * @date :Created in 2/10/2022
 * @description:GrantReadOnlyPermission
 * @modified By:
 */
public interface GrantReadOnlyPermissionService {

    ResultVo<GrantReadOnlyPermission> add(GrantReadOnlyPermissionVo vo);

    ResultVo<Long> delete(Long id);

    IPage<GrantReadOnlyPermission> dt(GrantReadOnlyPermissionPageVo query);

    List<String> readOnlyUserIds(String userId);

    public List<Map<String,Object>> getGroups(String corpId);
}
