package com.crm.crmservice.entity.param.email;


import com.crm.crmservice.entity.pojo.BasicQuery;
import lombok.Data;

/**
 * SysTemplateVO.
 */
@Data
public class EmailTemplateQueryParam extends BasicQuery {

    private String name;
    private String remark;
}
