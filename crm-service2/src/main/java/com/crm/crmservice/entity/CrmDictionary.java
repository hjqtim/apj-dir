package com.crm.crmservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author lcb371
 */
@Data
@ApiModel(value = "字典")
@NoArgsConstructor
public class CrmDictionary extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    @ApiModelProperty(value = "类型", example = "request_status")
    private String type;
    @ApiModelProperty(value = "字典key", example = "10")
    private String dictKey;
    @ApiModelProperty(value = "字典值", example = "Saved")
    private String dictValue;
    @ApiModelProperty(value = "0未删除，1已删除")
    private Integer isDelete = 0;

}
