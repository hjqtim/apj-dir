package com.crm.crmservice.entity.param;

import com.crm.crmservice.entity.pojo.BasicQuery;
import lombok.Data;


@Data
public class OperLogQueryParam extends BasicQuery {

    /**
     * operator
     */
    private String createdBy;

    /**
     * create time start
     */
    private String startTime;

    /**
     * create time end
     */
    private String endTime;

    /**
     * temporary not exist
     */
    private String systemName;

    /**
     * temporary not exist
     */
    private String module;

}
