package com.crm.crmservice.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.feedback.NetworkFeedbackComment;

/**
* @description 针对表【network_feedback_comment】的数据库操作Service
*/
public interface NetworkFeedbackCommentService extends IService<NetworkFeedbackComment> {

    /**
     * save network installation action log
     * @param param
     *//*
    void saveActionLog(NetworkFeedbackActionParam param);

    *//**
     * update network installation feedback state
     * @param param
     *//*
    void updateState(NetworkFeedbackCommentParam param);

    *//**
     * save network installation feedback
     * @param param
     *//*
    void save(NetworkFeedbackCommentParam param);

    *//**
     * select Network Installation Feedback List information for page by param
     * @param param
     * @return
     *//*
    IPage<NetworkInstallationFeedbackListVo> getFeedbackListPage(NetworkFeedbackCommentQueryParam param);

    *//**
     * select network installation feedback action log for page by comment id
     * @param param page information and comment id
     * @return
     *//*
    IPage<NetworkFeedbackAction> getFeedbackActionLogPage(NetworkInstallationFeedbackActionLogQueryParam param);

    *//**
     * get feedback sended email by page
     * @param param feedback comment table id
     * @return
     *//*
    IPage<NetworkFeedbackEmail> getEmailPage(NetworkFeedbackEmailQueryParam param);

    *//**
     * send email for feedback report increment
     *//*
    void sendFeedbackReport();

    *//**
     * appoint one feedback and its action log to send email
     * @param param
     *//*
    void sendFeedbackEmail(NetworkFeedbackSendEmailParam param);*/
}
