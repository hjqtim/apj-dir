package com.crm.crmservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="Approvers对象", description="")
public class Approvers extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    private String team;

    private String corpId;

    private String displayName;

    private String title;

    private String primaryApprover;

    private String isActSsm;

    private String isActCsm;

    @ApiModelProperty(value = "0未删除，1已删除")
    private Integer isDelete;


}
