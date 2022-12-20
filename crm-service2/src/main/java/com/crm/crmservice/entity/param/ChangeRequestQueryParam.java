package com.crm.crmservice.entity.param;

import com.crm.crmservice.entity.pojo.BasicQuery;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 草稿箱分页对象
 */
@Data
public class ChangeRequestQueryParam extends BasicQuery {

    private Integer id;

    @ApiModelProperty(value = "1.my 2.team")
    private String type = "1";

    private String requestNo;

    @ApiModelProperty(value = "1.saved 2.submit ...")
    private String requestStatus;
    @ApiModelProperty(value = "1.saved 2.submit ...")
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
    private String dynamicParameter;

    private String emailAlert;

    @ApiModelProperty(value = "0未删除，1已删除")
    private Integer isDelete;

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
