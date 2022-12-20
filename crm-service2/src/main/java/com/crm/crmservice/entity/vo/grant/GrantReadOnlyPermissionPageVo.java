package com.crm.crmservice.entity.vo.grant;

import lombok.Data;

import java.io.Serializable;


@Data
public class GrantReadOnlyPermissionPageVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private String lastUpdatedBy;

    private Integer current;

    private Integer size;

}
