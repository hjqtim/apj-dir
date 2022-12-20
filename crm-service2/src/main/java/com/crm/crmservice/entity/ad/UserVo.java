package com.crm.crmservice.entity.ad;

import lombok.Data;

@Data
public class UserVo{

    private String cn;
    private String name;
    private String displayName;
    private String givenName;
    private String mail;
    private String company;
    private String department;
    private String initials;
    private String sn;
    private String telephoneNumber;
    private String title;
    //private String position;
    private String team;
    private String description;
    private String objectSid;
    private String sAMAccountName;
    private String userPrincipalName;

}

