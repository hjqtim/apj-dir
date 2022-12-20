package com.crm.crmservice.entity.param.feedback;

import com.crm.crmservice.entity.BaseQueryParam;
import lombok.Data;


@Data
public class NetworkFeedbackEmailQueryParam extends BaseQueryParam {

    private int feedbackCommentId;

}
