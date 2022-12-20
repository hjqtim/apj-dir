package com.crm.crmservice.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.entity.EmailErrorLog;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.param.EmailErrorLogQueryParam;

/**
* @description 针对表【email_error_log】的数据库操作Service
*/
public interface EmailErrorLogService extends IService<EmailErrorLog> {

    Page<EmailErrorLog> getPage(EmailErrorLogQueryParam param);

}
