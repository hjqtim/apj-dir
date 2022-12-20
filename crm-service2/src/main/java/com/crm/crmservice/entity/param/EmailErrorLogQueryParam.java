package com.crm.crmservice.entity.param;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.crm.crmservice.entity.BaseQueryParam;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;


@EqualsAndHashCode(callSuper = true)
@Data
public class EmailErrorLogQueryParam extends BaseQueryParam {

    private String requestNo;

    private String prodNo;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date endTime;

}
