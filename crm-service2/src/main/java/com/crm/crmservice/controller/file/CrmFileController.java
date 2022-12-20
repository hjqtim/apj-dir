package com.crm.crmservice.controller.file;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.common.constant.CommonField;
import com.crm.crmservice.common.page.ConMonPage;
import com.crm.crmservice.entity.file.CrmFile;
import com.crm.crmservice.entity.file.CrmFileQuery;
import com.crm.crmservice.entity.pojo.file.FilePojo;
import com.crm.crmservice.service.file.CrmFileService;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.*;

/**
 * @author Ethan Li
 * @since 2022-11-24
 */
@RestController
@RequestMapping("/crmFile")
@Api(tags = "File management")
public class CrmFileController {

    @Autowired
    private CrmFileService crmFileService;

    /**
     * detail file info
     * @param query
     * @return
     */
    //@ApiOperation(value = "getFileList")
    @PostMapping("/getFileList")
    public Map<String, Object> getFileList(@RequestBody(required = false) CrmFileQuery query) {
        Page<CrmFile> page = new Page<>();
        page.setCurrent(query.getPageIndex());
        page.setSize(query.getPageSize());
        crmFileService.getFileList(page, query.getQueryEntity());
        return ResponseBuilder.ok(ConMonPage.getConMonPage(page));
    }

    /**
     * detail file info
     * @param innerDir
     * @return
     */
    //@ApiOperation(value = "Dir Or File list")
    @GetMapping("/getDirOrFileList")
    public Map<String, Object> getDirOrFileList(String innerDir) {
        Map<String, List> map = new HashMap<>();
        List<String> dirOrFileList = crmFileService.dirStructure(innerDir);
        map.put("dirOrFileList",dirOrFileList);
        return ResponseBuilder.ok(map);
    }

    /**
     * upload file
     * @param attach
     * @return
     */
    @ApiOperation(value = "Upload file",notes = "")
    @PostMapping("/uploadFile")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile[] attach, @RequestPart("filePojo") FilePojo filePojo){
        if (attach == null){
            return ResponseBuilder.error(CommonField.UPLOAD_FILES);
        }
        try{
            List<CrmFile> re = crmFileService.uploadFile(attach,filePojo);
            return ResponseBuilder.ok(CommonField.UPLOAD_SUCCESSFUL,re);
        }catch (Exception e){
            return ResponseBuilder.error(CommonField.UPLOAD_FAILED);
        }

    }

    /**
     * modify file
     * @param crmFile
     * @return
     */
    //@ApiOperation(value = "Modify file")
    @PostMapping("/updateFile")
    public Map<String, Object> updateFile(@RequestBody CrmFile crmFile){
        if (crmFile == null) {
            return ResponseBuilder.error(CommonField.INCOMING_DATA);
        }else {
            CrmFile newCrmFile = crmFileService.updateFile(crmFile);
            if (newCrmFile != null){
                return ResponseBuilder.ok(CommonField.MODIFY_SUCCESSFULLY,newCrmFile);
            }else{
                return ResponseBuilder.ok(CommonField.DELETE_THE_STATE);
            }
        }
    }

    /**
     * delete file
     * @param crmFileIds
     * @return
     */
    //@ApiOperation(value = "Delete file")
    @DeleteMapping("/deleteFile/{crmFileIds}")
    public Map<String, Object> deleteFile(@PathVariable Long[] crmFileIds){
        int i = crmFileService.deleteByIds(crmFileIds);
        if (i > 0) {
            return ResponseBuilder.ok();
        }
        return ResponseBuilder.fail();
    }

    /**
     * on the basis of emailTemplateId get file info
     */
    //@ApiOperation(value = "Get file by emailTemplateId")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "emailTemplateId",value = "emailTemplateId",required = true)
    })
    @GetMapping("/getFileByTemplateIdAndRequesterId/{emailTemplateId}")
    public Map<String,Object> getFileByTemplateIdList(@PathVariable("emailTemplateId") Long emailTemplateId){
        Map<String, List> map = new HashMap<>();
        List<CrmFile> fileList = crmFileService.getFileByTemplateIdList(emailTemplateId);
        map.put("fileList",fileList);
        return ResponseBuilder.ok(map);
    }

    /**
     * ont the basis of requestNo get file info
     */
    //@ApiOperation(value = "Get file by requestNo")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "requestNo",value = "requestNo",required = true)
    })
    @GetMapping("/getFileByRequestNoList/{dpReq}")
    public Map<String,Object> getFileByRequestNoList(@PathVariable("requestNo") String requestNo){
        Map<String, List> map = new HashMap<>();
        List<CrmFile> fileList = crmFileService.getFileByRequestNoList(requestNo);
        map.put("fileList",fileList);
        return ResponseBuilder.ok(map);
    }

    /**
     * 根据 requestNo查询 所有文件，且根据 moduleName拆分出 各个模块下有哪些文件 ***（暂时保留） ***
     */
    @ApiOperation(value = "Get requestNo fileList")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "requestNo",value = "requestNo",required = true),
    })
    @GetMapping("/getRequestFileList/{requestNo}")
    public Map<String,Object> getRequestFileList(@PathVariable("requestNo") String requestNo){
        Map<String, List> map = new HashMap<>();
        List<CrmFile> files = new ArrayList<>();
        List<CrmFile> crmFiles = new ArrayList<>();
        List<CrmFile> fileList = crmFileService.getFileByRequestNoList(requestNo);
        Iterator<CrmFile> fileListIterator = fileList.iterator();
        while(fileListIterator.hasNext()){
            CrmFile entity = fileListIterator.next();
            if (entity.getModuleName() != null && entity.getModuleName().equals("crm")){
                crmFiles.add(entity);
            }else {
                files.add(entity);
            }
        }
        map.put("fileList",files);

        return ResponseBuilder.ok(map);
    }

    @ApiOperation(value = "Download File")
    @GetMapping("/downloadFile")
    public String downloadFile(HttpServletResponse response, String remoteDir, String remoteFile) throws UnsupportedEncodingException {
        try(OutputStream os = response.getOutputStream()) {
            response.setContentType("application/vnd.ms-excel;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            // response.setContentType("application/force-download");
            response.setHeader("Content-Disposition", "attachment;fileName=" +   java.net.URLEncoder.encode(remoteFile,"UTF-8"));
            crmFileService.downloadFile(remoteDir,remoteFile,os);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    //@ApiOperation(value = "PreviewFile")
    @GetMapping("/previewFile")
    public String previewFile(HttpServletResponse response, String remoteDir, String remoteFile) throws UnsupportedEncodingException {
        try(OutputStream os = response.getOutputStream()) {
//            response.setContentType("application/vnd.ms-excel;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            // response.setContentType("application/force-download");
//            response.setHeader("Content-Disposition", "attachment;fileName=" +   java.net.URLEncoder.encode(remoteFile,"UTF-8"));
            response.setContentType("image/png");
            crmFileService.downloadFile(remoteDir,remoteFile,os);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    //@ApiOperation(value = "createRemoteDirTest")
    @PostMapping("/createRemoteDirTest")
    public Map<String,Object> createRemoteDirTest(@RequestParam String filePath, @RequestParam String dirName){
        crmFileService.createRemoteDir(filePath, dirName);
        return ResponseBuilder.ok();
    }

    //@ApiOperation(value = "createRemoteDirTest1")
    @PostMapping("/createRemoteDirTest1")
    public Map<String,Object> createRemoteDirTest1(@RequestBody String dirName){
        crmFileService.createRemoteDirTest(dirName);
        return ResponseBuilder.ok();
    }

}

