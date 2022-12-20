/**
 *
 * @version 1.0
 * @author lidi
 * @date 2021-6-29 17:01
 */
package com.crm.crmservice.entity;


import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.apache.ibatis.type.JdbcType;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Entity基础模型.
 */
@ApiModel(description = "基础模型")
@Data
public class BaseEntity implements Serializable {

    private static final long serialVersionUID = -2029636832587630353L;


    /**
     * 创建者.
     */
    @TableField(value = "created_by", fill = FieldFill.INSERT, jdbcType = JdbcType.VARCHAR)
    @ApiModelProperty(value = "create by who")
    private String createdBy;

    /**
     * 创建时间.
     */
    @ApiModelProperty(value = "create datetime")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT)
    private Date createdDate;

    /**
     * 更新者.
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    @ApiModelProperty(value = "last update by who")
    private String lastUpdatedBy;

    /**
     * 更新时间.
     */
    @ApiModelProperty(value = "last update datetime")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date lastUpdatedDate;

    /**
     * 请求参数.
     */
    @TableField(exist = false)
    @ApiModelProperty(value = "request params")
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
