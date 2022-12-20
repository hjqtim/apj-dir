import getIcons from '../../utils/getIcons';
import FileList from '../../pages/file/FileList';

const File = {
  id: 'File',
  name: 'File',
  path: '/file',
  icon: getIcons('fileServiceIcon'),
  component: FileList,
  children: null
  // children: [
  //   {
  // name: 'File List',
  // path: '/file/fileList',
  //     component: FileList
  //   }
  // ]
};

export default File;
