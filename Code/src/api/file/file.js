import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.file + envPrefix.file;

class File {
  // 文件列表
  getFileList(params) {
    return http(`${path}/resumeFile/getDirOrFileList`, {
      method: 'GET',
      params
    });
  }

  // DP 上传文件
  webDPuploadFile(data) {
    return http(`${path}/resumeFile/upload_file`, {
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // delete files
  deleteFile(ids) {
    return http(`${path}/resumeFile/delete_file/${ids}`, {
      method: 'DELETE'
    });
  }

  downloadFile(remoteDir, remoteFile) {
    return `${path}/resumeFile/downloadFile?remoteDir=${remoteDir}&remoteFile=${remoteFile}`;
  }

  previewImage(remoteDir, remoteFile) {
    return http(`${path}/resumeFile/downloadFile`, {
      method: 'GET',
      responseType: 'blob',
      params: {
        remoteDir,
        remoteFile
      }
    });
  }

  getRequestFileList(requestNo) {
    return http(`${path}/resumeFile/getRequestFileList/${requestNo}`);
  }

  // 通过浏览器预览图片
  previewFile(url) {
    const index = url?.lastIndexOf?.('/');
    if (index !== -1) {
      const dir = url.slice(0, index);
      const fileName = url.slice(index + 1);
      window.open(`${path}/resumeFile/previewFile?remoteDir=${dir}&remoteFile=${fileName}`);
    }
  }
}

export default new File();
