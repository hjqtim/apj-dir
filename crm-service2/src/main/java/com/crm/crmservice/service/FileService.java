package com.crm.crmservice.service;

import com.alibaba.fastjson.JSONObject;
import com.crm.crmservice.config.FeignConfig;
import com.crm.crmservice.entity.pojo.file.FilePojo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@FeignClient(url = "${fileService.url}",name = "fileServiceUrl",configuration = {FeignConfig.class})
public interface FileService {

    @GetMapping(value = "/resumeFile/getRequestFileList/{requestNo}")
    JSONObject getRequestFileList(@PathVariable(name = "requestNo") String requestNo);

    @PostMapping(value = "/resumeFile/feignUploadFile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    JSONObject uploadFile(@RequestPart("file") MultipartFile[] attach,@RequestParam("requestNo") String requestNo,
                          @RequestParam("projectName") String projectName);

    @PostMapping(value = "/resumeFile/upload_file",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    JSONObject uploadToFile(@RequestPart("file") MultipartFile[] attach,@RequestParam("filePojo") FilePojo filePojo);

    @PostMapping(value = "/resumeFile/uploadSegmentFile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    JSONObject uploadSegmentFile(@RequestPart("file") MultipartFile[] attach,
                                 @RequestParam("originFileName") String originFileName,
                                 @RequestParam("fileSize") Integer fileSize,
                                 @RequestParam("segmentIndex") Integer segmentIndex,
                                 @RequestParam("segmentSize") Integer segmentSize,
                                 @RequestParam("key") String key);
}




