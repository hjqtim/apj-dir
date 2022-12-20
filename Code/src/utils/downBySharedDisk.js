import API from '../api/file/file';

/**
 * 通过共享盘下载文件
 * @param {*} url 共享盘文件路径
 */
const downBySharedDisk = (url) => {
  const index = url?.lastIndexOf?.('/');
  if (index !== -1) {
    const dir = url.slice(0, index);
    const fileName = url.slice(index + 1);
    window.open(API.downloadFile(dir, fileName));
  }
};

export default downBySharedDisk;
