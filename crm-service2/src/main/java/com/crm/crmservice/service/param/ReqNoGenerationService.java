package com.crm.crmservice.service.param;

import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.param.ReqNoGeneration;


public interface ReqNoGenerationService extends IService<ReqNoGeneration> {

    String ReqNo() throws Exception;

}
