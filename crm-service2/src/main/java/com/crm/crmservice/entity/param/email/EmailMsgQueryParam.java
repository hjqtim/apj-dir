package com.crm.crmservice.entity.param.email;

import com.baomidou.mybatisplus.annotation.TableField;
import com.crm.crmservice.entity.BaseQueryParam;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * MsgEmail.
 */
@Data
@ApiModel(description = "邮件Vo表")
public class EmailMsgQueryParam extends BaseQueryParam {

    private static final long serialVersionUID = 1L;

    /**
     * ID.
     */
    @ApiModelProperty(value = "邮箱ID")
    private Long mailId;

    String attachFilePath;
    String fileName;

    /**
     * 接收者邮箱列表.
     */
    @ApiModelProperty(value = "接收者邮箱列表")
    private String toEmails;
    /**
     * 主题.
     */
    @ApiModelProperty(value = "主题")
    private String subject;
    /**
     * 内容.
     */
    @ApiModelProperty(value = "内容")
    private String content;
    /**
     * 邮件类型.
     */
    @ApiModelProperty(value = "邮件类型")
    private Integer emailType;
    /**
     * 发送时间.
     */
    @ApiModelProperty(value = "发送时间")
    private Date sendTime;

    @ApiModelProperty(value = "抄送用户")
    private String copyTos;
    @ApiModelProperty(value = "密送用户")
    private String bccTos;
    /**
     * 邮件用途.
     */
    private Integer emailUse;
    /**
     * 是否重新发送.
     */
    @TableField(exist = false)
    @ApiModelProperty(value = "是否重新发送")
    private String isResend;

    @ApiModelProperty("dear 后面的人名")
    private String dearName;

    /**
     * 请求参数.
     */
    @TableField(exist = false)
    @ApiModelProperty(value = "请求参数")
    private Map<String, Object> params;

    @ApiModelProperty(value = "邮件模板ID")
    private Long emailTemplateId;
    @ApiModelProperty(value = "邮件内容", hidden = true)
    private String templateHtml;

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
