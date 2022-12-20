package com.crm.crmservice.service.file;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.file.CrmFile;
import com.crm.crmservice.entity.pojo.file.FilePojo;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

/**
 * @author Ethan Li
 * @since 2022-11-24
 */
public interface CrmFileService extends IService<CrmFile> {


    //get All file info
    void getFileList(IPage<CrmFile> page, CrmFile crmFile);

    //add file
    List<CrmFile> uploadFile(MultipartFile[] attach, FilePojo filePojo) throws Exception;

    //update file
    CrmFile updateFile(CrmFile crmFile);

    //delete filec
    public int deleteByIds(Long[] crmFileIds);

    /**
     * on the basis of emailTemplateId get file info
     * @return
     */
    List<CrmFile> getFileByTemplateIdList(Long emailTemplateId);

    /**
     * on the basis of requestNo get file info
     */
    List<CrmFile> getFileByRequestNoList(String requestNo);


    List<String> dirStructure(String innerDir);

    void downloadFile(String remoteDir, String remoteFile, OutputStream outputStream) throws IOException;

    void createRemoteDir(String filePath, String dirName);

    void createRemoteDirTest(String dirName);


}
