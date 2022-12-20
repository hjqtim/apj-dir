package com.crm.crmservice.entity.pojo;

import lombok.Data;

import java.util.Map;


@Data
public class ExitSubProcessParam {

    private String processId;

    private Map<String,Object> variables;

}
