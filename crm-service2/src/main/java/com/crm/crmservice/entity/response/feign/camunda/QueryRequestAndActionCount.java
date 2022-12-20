package com.crm.crmservice.entity.response.feign.camunda;

import lombok.Data;


@Data
public class QueryRequestAndActionCount {

    private Integer queryRequestCount;

    private Integer queryActionCount;

}
