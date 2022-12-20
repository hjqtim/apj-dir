package com.crm.crmservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @author lcb371
 */
@Data
@ApiModel(value = "审批记录")
@NoArgsConstructor
public class ApprovalRecord extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private String requestNo;
    private String progressId;
    private String corpId;
    private String team;
    @ApiModelProperty(value = "系统备注")
    private String comment;
    @ApiModelProperty(value = "审批意见(审批人备注)")
    private String remark;
    @ApiModelProperty(value = "是否高亮 1 是 2 否")
    private Integer bright = 1;
    @ApiModelProperty(value = "1 submit 2.approval 3.rejected 4.system")
    private Integer status = 1;
    @ApiModelProperty(value = " submit approval rejected system")
    private String statusValue;
    @ApiModelProperty(value = "0未删除，1已删除")
    private Integer isDelete = 0;

    @ApiModelProperty(value = "crm dictionary(request_status)")
    private String requestStatus = "20";

    @TableField(exist = false)
    private Boolean needCheck = true;
    @TableField(exist = false)
    @ApiModelProperty(value = "crm dictionary(request_status)")
    private String requestStatusValue;

    public ApprovalRecord(String requestNo, String progressId, String corpId, String team, String comment) {
        this.requestNo = requestNo;
        this.progressId = progressId;
        this.corpId = corpId;
        this.team = team;
        this.comment = comment;
        if (status == 1) {
            statusValue = "Submit";
        }
        if (status == 2) {
            statusValue = "Approval";
        }
        if (status == 3) {
            statusValue = "Rejected";
        }
        if (status == 4) {
            statusValue = "System";
        }
    }

    public ApprovalRecord(String requestNo, String progressId, String corpId, String team, String comment, Integer status) {
        this(requestNo, progressId, corpId, team, comment);
        this.status = status;
        if (status == 1) {
            statusValue = "Submit";
        }
        if (status == 2) {
            statusValue = "Approval";
        }
        if (status == 3) {
            statusValue = "Rejected";
        }
        if (status == 4) {
            statusValue = "System";
        }
    }
}
