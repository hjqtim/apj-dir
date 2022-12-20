package com.crm.crmservice.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.ChangeRequest;
import com.crm.crmservice.entity.param.ChangeRequestQueryParam;
import com.crm.crmservice.entity.pojo.ChangeRequestFormPojo;
import com.crm.crmservice.entity.pojo.file.FilePojo;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
public interface ChangeRequestService extends IService<ChangeRequest> {

    boolean saveChangeRequest(MultipartFile[] attach, FilePojo filePojo, ChangeRequestFormPojo changeRequestForm, String type, boolean rejected) throws Exception;

    IPage<ChangeRequest> draftedPage(ChangeRequestQueryParam param);

    boolean updateChangeRequestStatus(ChangeRequest param);
}
