package com.crm.crmservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 
 * @TableName sys_param
 */
@TableName(value ="sys_param")
@Data
public class SysParam implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 
     */
    private String groupName;

    /**
     * 
     */
    private String sysKey;

    /**
     * 
     */
    private String sysValue;

    /**
     * 
     */
    private String remark;

    /**
     * 
     */
    private String createdBy;

    /**
     * 
     */
    private Date createdDate;

    /**
     * 
     */
    private String lastUpdatedBy;

    /**
     * 
     */
    private Date lastUpdatedDate;

    /**
     * 
     */
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}