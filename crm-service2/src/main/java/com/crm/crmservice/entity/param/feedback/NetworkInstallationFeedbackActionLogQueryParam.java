package com.crm.crmservice.entity.param.feedback;

import lombok.Data;


@Data
public class NetworkInstallationFeedbackActionLogQueryParam {
    private Integer commentId;

    private Integer pageIndex = 1;

    private Integer pageSize = 10;
}
