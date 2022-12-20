package com.crm.crmservice.entity.vo.feedback;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * feedback list vo
 */
@Data
public class NetworkInstallationFeedbackListVo {


    private String requestNo;

    private String requester;

    private String institution;

    private Integer rating;

    private String comment;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private String createdDate;

    private String respStaff;

    private String handle;

    private long id;

    @ApiModelProperty("1=front permission send email .else 0")
    private Integer state;

    private String appType;

}
