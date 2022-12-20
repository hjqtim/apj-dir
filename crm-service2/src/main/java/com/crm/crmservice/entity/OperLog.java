package com.crm.crmservice.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.Date;

/**
 * 请求记录表
 * @TableName oper_log
 */
@ApiModel
public class OperLog implements Serializable {
    /**
     * 
     */
    private Long id;

    /**
     * request param
     */
    @ApiModelProperty("request param")
    private String operRequParam;

    /**
     * request_token
     */
    private String operRequToken;

    /**
     * respose param
     */
    private String operRespParam;

    /**
     * method
     */
    @ApiModelProperty("request method(get/post/put/delete)")
    private String operMethod;

    /**
     * URL
     */
    private String operUri;

    /**
     * IP
     */
    private String operIp;

    /**
     * 
     */
    @ApiModelProperty("operator")
    private String createdBy;

    /**
     *
     */
    @JsonFormat(pattern = "yyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date createdDate;

    private static final long serialVersionUID = 1L;

    /**
     * 
     */
    public Long getId() {
        return id;
    }

    /**
     * 
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * request param
     */
    public String getOperRequParam() {
        return operRequParam;
    }

    /**
     * request param
     */
    public void setOperRequParam(String operRequParam) {
        this.operRequParam = operRequParam;
    }

    /**
     * request_token
     */
    public String getOperRequToken() {
        return operRequToken;
    }

    /**
     * request_token
     */
    public void setOperRequToken(String operRequToken) {
        this.operRequToken = operRequToken;
    }

    /**
     * respose param
     */
    public String getOperRespParam() {
        return operRespParam;
    }

    /**
     * respose param
     */
    public void setOperRespParam(String operRespParam) {
        this.operRespParam = operRespParam;
    }

    /**
     * method
     */
    public String getOperMethod() {
        return operMethod;
    }

    /**
     * method
     */
    public void setOperMethod(String operMethod) {
        this.operMethod = operMethod;
    }

    /**
     * URL
     */
    public String getOperUri() {
        return operUri;
    }

    /**
     * URL
     */
    public void setOperUri(String operUri) {
        this.operUri = operUri;
    }

    /**
     * IP
     */
    public String getOperIp() {
        return operIp;
    }

    /**
     * IP
     */
    public void setOperIp(String operIp) {
        this.operIp = operIp;
    }

    /**
     * 
     */
    public String getCreatedBy() {
        return createdBy;
    }

    /**
     * 
     */
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * 
     */
    public Date getCreatedDate() {
        return createdDate;
    }

    /**
     * 
     */
    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        OperLog other = (OperLog) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getOperRequParam() == null ? other.getOperRequParam() == null : this.getOperRequParam().equals(other.getOperRequParam()))
            && (this.getOperRequToken() == null ? other.getOperRequToken() == null : this.getOperRequToken().equals(other.getOperRequToken()))
            && (this.getOperRespParam() == null ? other.getOperRespParam() == null : this.getOperRespParam().equals(other.getOperRespParam()))
            && (this.getOperMethod() == null ? other.getOperMethod() == null : this.getOperMethod().equals(other.getOperMethod()))
            && (this.getOperUri() == null ? other.getOperUri() == null : this.getOperUri().equals(other.getOperUri()))
            && (this.getOperIp() == null ? other.getOperIp() == null : this.getOperIp().equals(other.getOperIp()))
            && (this.getCreatedBy() == null ? other.getCreatedBy() == null : this.getCreatedBy().equals(other.getCreatedBy()))
            && (this.getCreatedDate() == null ? other.getCreatedDate() == null : this.getCreatedDate().equals(other.getCreatedDate()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getOperRequParam() == null) ? 0 : getOperRequParam().hashCode());
        result = prime * result + ((getOperRequToken() == null) ? 0 : getOperRequToken().hashCode());
        result = prime * result + ((getOperRespParam() == null) ? 0 : getOperRespParam().hashCode());
        result = prime * result + ((getOperMethod() == null) ? 0 : getOperMethod().hashCode());
        result = prime * result + ((getOperUri() == null) ? 0 : getOperUri().hashCode());
        result = prime * result + ((getOperIp() == null) ? 0 : getOperIp().hashCode());
        result = prime * result + ((getCreatedBy() == null) ? 0 : getCreatedBy().hashCode());
        result = prime * result + ((getCreatedDate() == null) ? 0 : getCreatedDate().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", operRequParam=").append(operRequParam);
        sb.append(", operRequToken=").append(operRequToken);
        sb.append(", operRespParam=").append(operRespParam);
        sb.append(", operMethod=").append(operMethod);
        sb.append(", operUri=").append(operUri);
        sb.append(", operIp=").append(operIp);
        sb.append(", createdBy=").append(createdBy);
        sb.append(", createdDate=").append(createdDate);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}