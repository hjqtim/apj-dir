package com.crm.crmservice.entity.vo.process.crm.sendEmail;

import lombok.Data;

/**
 * webdp process company information
 * @author WZM755
 */
@Data
public class CrmProcessCompany {

    /**
     * company name
     */
    private String name;

    /**
     * company address
     */
    private String address;

    /**
     * company contacts name
     */
    private String person;

    private String phone;

}
