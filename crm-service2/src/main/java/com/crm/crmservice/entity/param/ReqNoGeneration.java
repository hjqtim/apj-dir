package com.crm.crmservice.entity.param;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.crm.crmservice.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.io.Serializable;

/**
 *  Request No generation
 */
@Data
@ApiModel(value = "Request No Object", description = "")
public class ReqNoGeneration extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("req_key")
    private String reqKey;

    @TableField("req_value")
    private String reqValue;

}
