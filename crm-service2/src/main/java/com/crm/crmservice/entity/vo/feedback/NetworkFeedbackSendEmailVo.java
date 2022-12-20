package com.crm.crmservice.entity.vo.feedback;

import lombok.Data;


@Data
public class NetworkFeedbackSendEmailVo {

    private String feedbackDate;

    private String requestNo;

    private String hospital;

    private Integer rating;

    private String otherComment;

    private String respStaff;

    private Integer requestCommentId;

}
