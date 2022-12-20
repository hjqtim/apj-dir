package com.crm.crmservice.service.impl.file;

import cn.hutool.core.collection.ListUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.file.CrmFile;
import com.crm.crmservice.entity.pojo.file.FilePojo;
import com.crm.crmservice.mapper.file.CrmFileMapper;
import com.crm.crmservice.service.file.CrmFileService;
import com.crm.crmservice.utils.file.SmbUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Ethan Li
 * @since 2022-11-24
 */
@Service
@Slf4j
public class CrmFileServiceImpl extends ServiceImpl<CrmFileMapper, CrmFile> implements CrmFileService {

    //文件上传位置
    @Value("${file.upload.path}")
    String filePath;
    @Value("${file.access.path}")
    String fileAccessPath;
    @Value("${file.type}")
    String fileType;
    @Value("${file.size}")
    int ymlFileSize;
    @Value("${smbj.user}")
    String smbjUser;

    @Value("${smbj.pwd}")
    String smbjPwd;

    @Value("${smbj.domain}")
    String smbjDomain;

    @Value("${smbj.server}")
    String smbjServer;

    @Value("${smbj.share}")
    String smbjShare;

    @Resource
    CrmFileMapper crmFileMapper;

    @Autowired
    private SmbUtils smbUtils;

    @Value("${spring.profiles.active}")
    String active;

    /**
     * 可以根据条件搜索、查看文件信息
     * @param page
     * @param crmFile
     * @return
     */
    @Override
    public void getFileList(IPage<CrmFile> page, CrmFile crmFile) {
        QueryWrapper<CrmFile> wrapper = null;
        if (crmFile != null){
            wrapper = new QueryWrapper<>();
            if (crmFile.getCorpId()!=null)
                wrapper.eq("corp_id", crmFile.getCorpId());
            if (crmFile.getRequestNo()!=null)
                wrapper.eq("request_no", crmFile.getRequestNo());
            if (crmFile.getEmailTemplateId()!=null)
                wrapper.eq("email_template_id", crmFile.getEmailTemplateId());
            wrapper.orderByDesc("create_time");
        }
        crmFileMapper.selectPage(page,wrapper);

    }

    /**
     * 文件上传
     * @param attach
     * @return
     */
    @Override
    @Transactional
    public List<CrmFile> uploadFile(MultipartFile[] attach, FilePojo filePojo) throws Exception {
        //定义一个集合，用于存取多个文件,用于最终返回
        List<CrmFile> crmFiles = new ArrayList<>();
        //判断传过来的文件是否为空，requestNo、邮件模板ID是否为空
        if (attach.length>0 && (filePojo.getRequestNo()!=null || filePojo.getEmailTemplateId()!=null)){
            for (MultipartFile multipartFile : attach) {
                CrmFile crmFile = new CrmFile();
                String path = "/";
                //获取源文件名称
                String fileName = multipartFile.getOriginalFilename();
                //获取文件大小，目前单位是(B)
                long fileSize = multipartFile.getSize();
                //判断文件是否大于10M
                if(fileSize/1048576 <= ymlFileSize){
                    //获取源文件后缀名
                    String suffix = FilenameUtils.getExtension(fileName);
                    String soureFileName = fileName.replace("."+suffix,"");
                    //检查上传的文件是否符合 预先定义的类型
                    Boolean status = checkFileType(suffix);
                    //判断文件格式
                    if (status){
                        String fileDatePath = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
                        //使用文件名称加日期重命名文件名称
                        String newFileName= soureFileName+"-"+fileDatePath+"."+suffix;
                        //获取 requestNo 创建文件夹
                        String requestNo = filePojo.getRequestNo();
                        //获取模块创建文件夹
                        String moduleName = filePojo.getModuleName();
                        //使用日期解决同一文件夹中文件过多问题（以当前日期命名文件夹）
                        String datePath = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

                        //****组装最终文件名
                        //String finalName = moduleName +path+ requestNo +path+ datePath +path + newFileName;
                        //构建文件对象
                        //File dest = new File(filePath +finalName);//dest，文件的绝对路径
                        //组装文件路径
                        //StringBuilder absFilePath = new StringBuilder();
                        //absFilePath.append(dest);
                        //判断该文件夹是否存在，不存在则创建
                        //if (!dest.getParentFile().exists()) {
                        //    dest.getParentFile().mkdirs();//创建文件夹
                        //}
                        //****

                        //文件绝对路径
                        String finalPath = filePath +moduleName +path+ requestNo +path+ datePath +path ;
                        /* log.info("test finalPath1 : {}", finalPath1);
                        String finalPath = filePath +projectName +java.io.File.separator+ requestNo +java.io.File.separator+ datePath +java.io.File.separator ;
                        String finalPath = filePath;*/
                        log.info("crmFileServiceImpl add finalPath : {}", finalPath);
                        try (InputStream inputStream = multipartFile.getInputStream()){
                            //****将文件保存到硬盘
                            // multipartFile.transferTo(dest);
                            // log.info("test finalPath 1 : {}", finalPath);
                            uploadInputStreamFile(filePath, moduleName +path+ requestNo +path+ datePath +path, newFileName,inputStream);
                            // log.info("test finalPath 2 : {}", finalPath);
                            //requestNo
                            if (filePojo.getRequestNo()!=null){
                                crmFile.setRequestNo(filePojo.getRequestNo());
                            }
                            //申请人CorpID
                            if (filePojo.getCorpId()!=null){
                                crmFile.setCorpId(filePojo.getCorpId());
                            }
                            //邮件模板ID
                            if (filePojo.getEmailTemplateId()!=null){
                                crmFile.setEmailTemplateId(filePojo.getEmailTemplateId());
                            }
                            //文件名
                            crmFile.setFileName(fileName);
                            //文件大小，单位KB
                            crmFile.setFileSize(Double.valueOf(fileSize));
                            //文件存放路径
                            crmFile.setFileUrl(finalPath+newFileName);
                            //文件类型
                            crmFile.setFileType(suffix);
                            crmFile.setModuleName(filePojo.getModuleName());
                            //把文件信息放入 list
                            crmFiles.add(crmFile);
                        } catch (IOException e) {
                            throw new Exception("File parsing failed");
                        }
                    }else {
                        throw new Exception("The file name("+fileName+"); The current file format is ("+suffix+"),Uploading is not allowed");
                    }
                }else{
                    throw new Exception("A single file cannot be larger than "+ymlFileSize+"M");
                }
            }

            if (!crmFiles.isEmpty()){
                for (int i = 0; i < crmFiles.size(); i++) {
                    //将文件信息入库
                    crmFileMapper.insert(crmFiles.get(i));
                    log.info("upload success....");
                }

            }

        }
        return crmFiles;
    }

    @Override
    public CrmFile updateFile(CrmFile crmFile) {
        //查询该文件是否存在数据库
        CrmFile newCrmFile = crmFileMapper.selectById(crmFile.getId());
        if (newCrmFile != null){
            //若存在则更新
            BeanUtils.copyProperties(crmFile, newCrmFile);
            crmFileMapper.updateById(newCrmFile);
        }
        return newCrmFile;
    }

    @Override
    public int deleteByIds(Long[] crmFileIds) {
        return crmFileMapper.deleteBatchIds(ListUtil.toList(crmFileIds));
    }

    @Override
    public List<CrmFile> getFileByTemplateIdList(Long emailTemplateId) {
        QueryWrapper<CrmFile> wrapper = new QueryWrapper<>();
        wrapper.eq("email_template_id",emailTemplateId);
        return crmFileMapper.selectList(wrapper);
    }

    @Override
    public List<CrmFile> getFileByRequestNoList(String requestNo) {
        QueryWrapper<CrmFile> wrapper = new QueryWrapper<>();
        wrapper.eq("request_no",requestNo);
        return crmFileMapper.selectList(wrapper);
    }

    /**
     * Upload File
     * @param innerDir
     * @param fileName
     * @param inputStream
     * @throws IOException use close InputStream
     */
    private void uploadInputStreamFile(String filePath, String innerDir, String fileName, InputStream inputStream) throws IOException{
        smbUtils.uploadInputStreamFile(smbjServer, smbjUser, smbjPwd, smbjShare, smbjDomain, filePath, innerDir, fileName, inputStream);
    }

    /**
     * Download File
     * @param remoteDir
     * @param remoteFile
     * @param outputStream
     * @throws IOException use close OutputStream
     */
    public void downloadFile(String remoteDir, String remoteFile, OutputStream outputStream) throws IOException {
        smbUtils.downloadFile(smbjServer, smbjUser, smbjPwd, smbjShare, smbjDomain, remoteDir, remoteFile, outputStream);
    }

    @Override
    public void createRemoteDir(String filePath, String dirName) {
        SmbUtils.createRemoteDir1(smbjServer, smbjUser, smbjPwd, smbjShare, smbjDomain, filePath, dirName);
    }

    @Override
    public void createRemoteDirTest(String dirName) {
//        SmbUtils.createRemoteDirTest(smbjServer, smbjUser, smbjPwd, smbjShare, smbjDomain, dirName);
    }
    /**
     * directory structure
     * @param innerDir
     */
    public List<String> dirStructure(String innerDir){
        log.info("dirStructure active:{},smbjShare:{}",active, smbjShare);
        return smbUtils.listFile(smbjServer, smbjUser, smbjPwd, smbjShare, smbjDomain, fileAccessPath+innerDir);
    }

    //检查上传的文件是否符合 预先定义的类型
    public Boolean checkFileType(String crmFileType){
        Boolean status = false;
        String[] split = fileType.split("\\,");
        if (split!=null){
            for (String type : split) {
                if (type.equals(crmFileType)){
                    status = true;
                    break;
                }
            }
        }
        return status;
    }


}
