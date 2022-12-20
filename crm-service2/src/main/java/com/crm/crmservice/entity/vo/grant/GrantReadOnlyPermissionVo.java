package com.crm.crmservice.entity.vo.grant;

import lombok.Data;

import java.io.Serializable;


@Data
public class GrantReadOnlyPermissionVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String grantName;

    private String grantLoginId;

    private String lastUpdatedBy;

    private String personalDetails;

}
