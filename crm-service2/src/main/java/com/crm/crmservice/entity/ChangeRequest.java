package com.crm.crmservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@ApiModel(value = "ChangeRequest对象", description = "")
public class ChangeRequest extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    private String requestNo;

    @ApiModelProperty(value = "crm dictionary(request_status)")
    private String requestStatus;
    @ApiModelProperty(value = "crm dictionary(request_status)")
    private String requestStatusValue;

    private String progressId;

    private String submittedBy;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submissionDate;

    private String corpId;

    private String team;

    private String displayName;

    private String title;

    private String environment;

    private String changePurpose;

    private String details;

    private String platform;

    private String infraService;

    private String changeType;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date endDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date effectiveDate;

    private String machineId;

    @ApiModelProperty(value = "No. of enhancement included")
    private String noOf;

    private String serviceLocation;

    private String doneBy;

    private String changeCategory;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date dueDate;

    private String wellTested;

    private String impacts;

    @ApiModelProperty("Duration of User Impact (hr(s))")
    private Integer durationImpactTime;

    private String scopeOfChange;

    private String pastChangeHistory;

    @ApiModelProperty(value = "Past Incidents in Production")
    private String pastIncidentsInProd;

    private String errorBudget;

    @ApiModelProperty(value = "Change Dependancy (Call-out to)")
    private String changeDependTo;

    @ApiModelProperty(value = "Change Dependancy (Call-out by)")
    private String changeDependBy;

    @ApiModelProperty(value = "Change Impact to Own Project")
    private String changeImpactProject;

    private String maxImpactMarks;

    private String maxImpactLevel;

    @ApiModelProperty(value = "Affected Parties / Systems")
    private String affectedOption;

    @ApiModelProperty(value = "Failure Handling / Fallback")
    private String failureOption;

    @ApiModelProperty(value = "Duration of Failure Handling /Fallback (min(s))")
    private String durationFailureTime;

    private Integer alertCallCentre;

    @ApiModelProperty(value = "Remarks / Ext. Ref")
    private String remarks;

    @ApiModelProperty(value = "动态参数（存的是json），根据自定义的字段(会对数据进行JSON格式强校验)", example = "{}")
    private String dynamicParameter = "{}";

    private String emailAlert;

    @ApiModelProperty(value = "0未删除，1已删除")
    private Integer isDelete = 0;

    @TableField(exist = false)
    private List<String> requestNos;

    public ChangeRequest() {

    }

    public ChangeRequest(String requestNo, String requestStatus) {
        this.requestNo = requestNo;
        this.requestStatus = requestStatus;
    }
}
