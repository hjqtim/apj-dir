package com.crm.crmservice.entity;

import lombok.Data;

/**
 *  page query base param
 */
@Data
public class BaseQueryParam {

    private int pageIndex=1;

    private int pageSize=10;

}
