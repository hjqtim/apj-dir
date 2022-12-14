import React, { memo, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { extend } from 'wangeditor-for-react';
import i18next from 'i18next';
import { makeStyles } from '@material-ui/core';
import _ from 'lodash';
import { useParams } from 'react-router';
import { setMoreInfo } from '../../../../../redux/ResourceMX/resourceAction';

import envUrl from '../../../../../utils/baseUrl';
import fileAPI from '../../../../../api/file/file';
import { getDayNumber } from '../../../../../utils/date';

const useStyles = makeStyles(() => ({
  reactWEditor1: {
    flex: 1,
    display: 'flex',
    height: '368px',
    flexDirection: 'column',
    '& .w-e-text-container': {
      flex: 1,
      '& .w-e-text': { minHeight: '100% !important' }
    }
  },
  reactWEditor2: {
    flex: 1,
    display: 'flex',
    height: '368px',
    flexDirection: 'column',
    '& .w-e-text-container': {
      flex: 1,
      '& .w-e-text': { minHeight: '100% !important' }
    },
    color: '#909090'
  }
}));
const ReactWEditor = extend({ i18next });
const Index = () => {
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus);
  const requestNoT = useParams().requestNo;
  const orderStatus = useParams().status;

  const classes = useStyles();
  const myRef = useRef();
  if (
    (resourceStatus === 'detailSubmited' && !requestNoT) ||
    orderStatus === 'detail' ||
    resourceStatus === 'detailApproved' ||
    resourceStatus === 'detailDone'
  ) {
    // console.log('disable myRef', myRef.current, resourceStatus);
    myRef.current?.editor?.disable();
  }

  const moreInfo = useSelector((state) => state.resourceMX.moreInfo);
  const dispatch = useDispatch();

  const [content, setContent] = useState('');
  const [isReact, setIsReact] = useState(false);

  const customUploadImg = (files, insertImgFn) => {
    const formData = new FormData();
    formData.append('file', files?.[0]);
    formData.append(
      'resumeFile',
      new Blob(
        [
          JSON.stringify({
            requestNo: getDayNumber(),
            projectName: 'Resource'
          })
        ],
        {
          type: 'application/json'
        }
      )
    );
    fileAPI.webDPuploadFile(formData).then((res) => {
      const resData = res?.data?.data || [];
      const count = _.countBy(resData?.[0]?.fileUrl)['/'];
      let arr = resData?.[0]?.fileUrl.split('/');
      const fileName = arr?.[arr.length - 1];
      arr = arr?.splice(0, count);
      const dir = arr?.join('/');
      const isProd = envUrl?.file?.indexOf('inbound') !== -1;
      let path = '';
      if (isProd) {
        path = `${envUrl.file}/file/resumeFile/previewFile?remoteDir=${dir}/&remoteFile=${fileName}`;
      } else {
        path = `${envUrl.file}/resumeFile/previewFile?remoteDir=${dir}/&remoteFile=${fileName}`;
      }
      insertImgFn(path);
    });
  };

  const onHtmlChange = (html) => {
    // const textContent = myRef?.current?.editor?.txt?.text();
    // if (text !== null) {
    //   moreInfo.text = text;
    //   dispatch(setMoreInfo(moreInfo));
    // }
    console.log('onHtmlChange', isReact);
    setContent(html);
  };
  const handleOnBlur = (html, textContent) => {
    // console.log('handleOnBlur', isReact);
    moreInfo.text = textContent;
    moreInfo.html = html;
    // console.log('moreInfo', html, textContent);
    dispatch(setMoreInfo(moreInfo));
  };

  // ??????????????????
  // const setServiceFormReducer = (content) => {
  //   moreInfo.html = content;
  //   moreInfo.text = '';
  //   dispatch(setMoreInfo(moreInfo));
  // };
  // useEffect(() => {
  //   setServiceFormReducer(content);
  // }, [content]);

  useEffect(() => {
    const { html } = moreInfo;
    // console.log('moreInfo init', html);
    if (moreInfo.html !== '') {
      onHtmlChange(html);
    }
  }, [moreInfo]);

  return (
    <>
      <ReactWEditor
        config={{
          lang: 'en',
          uploadImgAccept: ['jpg', 'jpeg', 'png', 'gif'],
          menus: [
            'head', // ??????
            'bold', // ??????
            'fontSize', // ??????
            'fontName', // ??????
            'italic', // ??????
            'underline', // ?????????
            'strikeThrough', // ?????????
            'foreColor', // ????????????
            'backColor', // ????????????
            'list', // ??????
            'justify', // ????????????
            'quote', // ??????
            'emoticon', // ??????
            'table', // ??????
            'image', // ????????????
            'undo', // ??????
            'redo', // ??????
            'fullscreen' // ??????
          ],
          customUploadImg
        }}
        className={
          (resourceStatus === 'detailSubmited' && !requestNoT) ||
          orderStatus === 'detail' ||
          resourceStatus === 'detailApproved' ||
          resourceStatus === 'detailDone'
            ? classes.reactWEditor2
            : classes.reactWEditor1
        }
        ref={myRef}
        placeholder="Please enter the text"
        defaultValue={content}
        value={content}
        onChange={(html) => {
          setIsReact(true);
          const textContent = myRef?.current?.editor?.txt?.text();
          // console.log('wang onfocus', html, textContent);
          setTimeout(() => {
            handleOnBlur(html, textContent);
          }, 200);
        }}
        onBlur={(html) => {
          setIsReact(false);
          const textContent = myRef?.current?.editor?.txt?.text();
          // console.log('wang blur', textContent);
          setTimeout(() => {
            handleOnBlur(html, textContent);
          }, 200);
        }}
        onFocus={(html) => {
          setIsReact(true);
          const textContent = myRef?.current?.editor?.txt?.text();
          // console.log('wang onfocus', html, textContent);
          setTimeout(() => {
            handleOnBlur(html, textContent);
          }, 200);
        }}
      />
    </>
  );
};
export default memo(Index);
