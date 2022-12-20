package com.crm.crmservice.entity.param;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.crm.crmservice.entity.BaseQueryParam;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
public class SwitchToAnotherUserParam extends BaseQueryParam {

    @ApiModelProperty("play the role start time. format example————2022-11-11 11:11:11")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String startTime;

    @ApiModelProperty("util end date time. format example————2022-11-11 11:11:11")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String endTime;

    private String originUserName;

    private String switchUserName;

}
