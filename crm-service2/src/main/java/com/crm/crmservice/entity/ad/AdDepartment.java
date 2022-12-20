package com.crm.crmservice.entity.ad;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class AdDepartment {
    List<AdDepartment> child = new ArrayList<>();
    private String userId;
    private String objectSid;
    private String name;
    private String isManager;

    public AdDepartment(String objectSid, String name) {
        this.name = name;
        this.objectSid = objectSid;
    }

    public AdDepartment(String objectSid, String name, String isManager, String userId) {
        this.name = name;
        this.objectSid = objectSid;
        this.isManager = isManager;
        this.userId = userId;
    }
}
