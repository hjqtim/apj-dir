package com.crm.crmservice.entity.email;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.crm.crmservice.entity.BaseEntity;
import com.crm.crmservice.entity.file.CrmFile;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 邮件模板
 * @author Ethan Li
 * @since 2022-12-12
 */
@Data
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="EmailTemplate对象", description="邮件模板")
public class EmailTemplate extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "模板id")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty(value = "模板名")
    private String name;

    @ApiModelProperty(value = "备注")
    private String remark;

    @ApiModelProperty(value = "模板内容(Html)")
    private String templateHtml;

    @ApiModelProperty(value = "状态(0:使用,1：禁用)")
    private Integer visible;

    private Integer isDelete;

    /**
     * 文件附件列表.
     */
    @ApiModelProperty(value = "文件附件列表")
    @TableField(exist = false)
    private List<CrmFile> files;

    /**
     * label
     */
    @TableField(exist = false)
    private Map label;


}
