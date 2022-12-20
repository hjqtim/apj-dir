package com.crm.crmservice.entity.ad;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

/**
 * @ClassName User
 */
@Data
@TableName("user")
public class User implements Serializable {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    private String cn;
    private String name;
    @TableField(exist = false)
    private String password;
    private String displayName;
    private String givenName;
    private String mail;
    private String company;
    private String department;
    private String initials;
    private String sn;
    private String telephoneNumber;
    private String title;
    @TableField(exist = false)
    private String position;
    private String team;
    private String description;
    private String objectSid;
    private String sAMAccountName;
    private String userPrincipalName;

    /**
     * 创建时间.
     */
    @ApiModelProperty(value = "create datetime")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT)
    private Date createdDate;

    /**
     * 更新时间.
     */
    @ApiModelProperty(value = "last update datetime")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date lastUpdatedDate;

    private Integer isDelete;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(cn, user.cn) && Objects.equals(name, user.name) && Objects.equals(displayName, user.displayName) && Objects.equals(givenName, user.givenName) && Objects.equals(mail, user.mail) && Objects.equals(company, user.company) && Objects.equals(department, user.department) && Objects.equals(initials, user.initials) && Objects.equals(sn, user.sn) && Objects.equals(telephoneNumber, user.telephoneNumber) && Objects.equals(title, user.title) && Objects.equals(position, user.position) && Objects.equals(team, user.team) && Objects.equals(description, user.description) && Objects.equals(objectSid, user.objectSid) && Objects.equals(sAMAccountName, user.sAMAccountName) && Objects.equals(userPrincipalName, user.userPrincipalName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cn, name, displayName, givenName, mail, company, department, initials, sn, telephoneNumber, title, position, team, description, objectSid, sAMAccountName, userPrincipalName);
    }
}

