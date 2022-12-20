package com.crm.crmservice.entity.param;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.crm.crmservice.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.io.Serializable;


@Data
@ApiModel(value = "External Api Log", description = "")
public class ExternalApiLog extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("url")
    private String url;

    @TableField("in_param")
    private String inParam;

    @TableField("out_data")
    private String outData;

    @TableField("log_type")
    private String logType;
}
