package com.crm.crmservice.entity.email;

import com.baomidou.mybatisplus.annotation.FieldFill;
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
import java.util.HashMap;
import java.util.Map;

/**
 * 邮件记录
 *
 * @author Ethan Li
 * @since 2022-12-12
 */
@Data
@EqualsAndHashCode(callSuper = false)
@ApiModel(value = "EmailMsg对象", description = "邮件记录")
public class EmailMsg implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "ID")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty(value = "发送者邮箱")
    private String fromEmail;

    @ApiModelProperty(value = "创建人 默认为空")
    private String createdBy;

    @ApiModelProperty(value = "创建时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT)
    private Date createdDate;

    @ApiModelProperty(value = "接收者邮箱")
    private String toEmail;

    /**
     * 接收者邮箱列表.
     */
    @TableField(exist = false)
    @ApiModelProperty(value = "接收者邮箱列表")
    private String[] toEmails;

    @ApiModelProperty(value = "主题")
    private String subject;

    @ApiModelProperty(value = "内容")
    private String content;

    @ApiModelProperty(value = "邮件类型")
    private Integer emailType;

    @ApiModelProperty(value = "发送时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date sendTime;

    @ApiModelProperty(value = "抄送用户")
    private String copyTo;

    @ApiModelProperty(value = "邮件用途")
    private Integer emailUse;

    @ApiModelProperty(value = "密送用户")
    private String bccTo;

    @ApiModelProperty(value = "附件名称")
    private String fileName;

    @ApiModelProperty(value = "请求参数")
    private String paramObj;

    @ApiModelProperty(value = "记录状态：0发送失败，1发送成功，2发送拦截")
    private Integer status;

    @ApiModelProperty(value = "记录失败原因")
    private String errorInfo;

    /**
     * 是否重新发送.
     */
    @TableField(exist = false)
    @ApiModelProperty(value = "是否重新发送")
    private String isResend;

    @TableField(exist = false)
    private Integer pageIndex;

    @TableField(exist = false)
    private Integer pageSize;

    @TableField(exist = false)
    String attachFilePath;

    /**
     * 附件名称数组
     */
    @TableField(exist = false)
    private String[] fileNameList;

    /**
     * 请求参数.
     */
    @TableField(exist = false)
    @ApiModelProperty(value = "请求参数")
    private Map<String, Object> params;

    /**
     * 参数对象.
     *
     * @return 参数集合
     */
    public Map<String, Object> getParams() {
        if (params == null) {
            params = new HashMap<>();
        }
        return params;
    }

}
