package com.crm.crmservice.service.impl.email;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.email.EmailLog;
import com.crm.crmservice.mapper.email.EmailLogMapper;
import com.crm.crmservice.service.email.EmailLogService;
import org.springframework.stereotype.Service;

/**
 *  服务实现类
 * @author Ethan Li
 * @since 2022-12-12
 */
@Service
public class EmailLogServiceImpl extends ServiceImpl<EmailLogMapper, EmailLog> implements EmailLogService {

}
