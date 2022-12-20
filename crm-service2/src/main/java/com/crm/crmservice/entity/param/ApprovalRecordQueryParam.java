package com.crm.crmservice.entity.param;

import com.crm.crmservice.entity.pojo.BasicQuery;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 审批记录、已办分页对象
 */
@Data
public class ApprovalRecordQueryParam extends BasicQuery {

    private Integer id;
    @ApiModelProperty(value = "1.my 2.team")
    private String type = "1";
    private String requestNo;
    private String progressId;
    private String corpId;
    private String team;
    @ApiModelProperty(value = "系统备注")
    private String comment;
    @ApiModelProperty(value = "审批意见(审批人备注)")
    private String remark;
    @ApiModelProperty(value = "1 submit 2.approval 3.rejected 4.system")
    private String status;
    @ApiModelProperty(value = " submit approval rejected system")
    private String statusValue;
    @ApiModelProperty(value = "0未删除，1已删除")
    private Integer isDelete = 0;

    @ApiModelProperty(value = "create by who")
    private String createdBy;

    /**
     * 创建时间.
     */
    @ApiModelProperty(value = "create datetime")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdDate;

    /**
     * 更新者.
     */
    @ApiModelProperty(value = "last update by who")
    private String lastUpdatedBy;

    /**
     * 更新时间.
     */
    @ApiModelProperty(value = "last update datetime")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date lastUpdatedDate;
}
