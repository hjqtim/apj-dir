package com.crm.crmservice.entity.param.feedback;


import com.crm.crmservice.entity.pojo.BasicQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;


@EqualsAndHashCode(callSuper = true)
@Data
public class NetworkFeedbackCommentQueryParam extends BasicQuery<NetworkFeedbackCommentQueryParam> {

    private String startTime;

    private String endTime;

    private String requestNo;

    private String requester;

}
