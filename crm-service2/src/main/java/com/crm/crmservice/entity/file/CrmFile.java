package com.crm.crmservice.entity.file;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.crm.crmservice.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * @author Ethan Li
 * @since 2022-11-24
 */
@Data
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="CrmFile对象", description="")
public class CrmFile extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty(value = "request_no")
    private String requestNo;

    @ApiModelProperty(value = "申请人ID")
    private String corpId;

    @ApiModelProperty(value = "邮件模板ID")
    private Integer emailTemplateId;

    @ApiModelProperty(value = "文件路径")
    private String fileUrl;

    @ApiModelProperty(value = "文件名")
    private String fileName;

    @ApiModelProperty(value = "文件类型")
    private String fileType;

    @ApiModelProperty(value = "文件大小")
    private Double fileSize;

    @ApiModelProperty(value = "模块名")
    private String moduleName;

    private Integer isDelete;


}
