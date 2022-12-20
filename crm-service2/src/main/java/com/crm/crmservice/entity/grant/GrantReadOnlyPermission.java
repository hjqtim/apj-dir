package com.crm.crmservice.entity.grant;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.crm.crmservice.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.io.Serializable;

/**
 * @description:GrantReadOnlyPermission
 */
@Data
@ApiModel(value = "", description = "")
@TableName("grant_read_only_permission")
public class GrantReadOnlyPermission extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("grant_name")
    private String grantName;

    @TableField("grant_login_id")
    private String grantLoginId;

    @TableField("personal_details")
    private String personalDetails;

    @TableField("is_delete")
    private String isDelete;

}
