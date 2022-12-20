package com.crm.crmservice.entity.vo.process.crm.sendEmail;

import lombok.Data;


@Data
public class CrmProcessAdGroupUserInfo {

    private String email;

    /**
     * user display name
     */
    private String name;

    private String phone;

    /**
     * position
     */
    private String title;

    private String department;

}
