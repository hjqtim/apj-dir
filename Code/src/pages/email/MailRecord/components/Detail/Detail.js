import React, { useEffect, useState } from 'react';
import { Box, Grid, makeStyles, Button } from '@material-ui/core';
import ReactWEditor from 'wangeditor-for-react';
import { useParams, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import { useGlobalStyles } from '../../../../../style';
import { HAPaper } from '../../../../../components';
import { L } from '../../../../../utils/lang';
import Loading from '../../../../../components/Loading';
import API from '../../../../../api/email/mailRecord';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#909090',
    margin: theme.spacing(16)
  },
  reactWEditor: {
    width: '100%',
    '& .w-e-text-container': {
      flex: 1,
      '& .w-e-text': { minHeight: '100% !important' }
    }
  },
  btn: {
    color: '#5C5C5C',
    background: '#E0E0E0',
    marginTop: '16px'
  }
}));
const Detail = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const myRef = React.createRef();
  const globalClaess = useGlobalStyles();
  const [templateHtml, setTemplateHtml] = useState('');
  const [datas, setDatas] = useState('');
  const flexRows = {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 4,
    xl: 3
  };
  useEffect(() => {
    // 禁用富文本编辑器;
    myRef.current.editor.disable();
    getDetailData();
  }, []);
  // 获取详情数据
  const getDetailData = () => {
    Loading.show();
    API.searchRecordById(id)
      .then((res) => {
        if (res?.data?.data) {
          setDatas(res.data?.data);
          handleReturnRichText(res.data.data.content);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };
  // 将后台给过来的富文本数据转成前端可显示的
  const handleReturnRichText = (templateHtml) => {
    let tempHTML = templateHtml?.replaceAll('<span th:text="', '');
    tempHTML = tempHTML?.replaceAll('"></span>', '');
    setTemplateHtml(tempHTML || '');
  };
  return (
    <div className={globalClaess.pageStyle} style={{ height: '100%' }}>
      {/* 页面主主体 */}
      <HAPaper>
        <Box className={classes.root}>
          <Grid container spacing={8}>
            <Grid item {...flexRows}>
              <span style={{ marginRight: '20px' }}> {L('subject')}:</span>
              <span>{datas?.subject || ''}</span>
            </Grid>
            <Grid item {...flexRows}>
              <span style={{ marginRight: '20px' }}> {L('creator')}:</span>
              <span>{datas?.createBy || ''}</span>
            </Grid>
            <Grid item {...flexRows}>
              <span style={{ marginRight: '20px' }}> {L('sendTime')}:</span>
              <span>{(datas && dayjs(datas?.sendTime).format('YYYY-MM-DD HH:mm:ss')) || ''}</span>
            </Grid>
            <Grid item {...flexRows}>
              <span style={{ marginRight: '20px' }}> {L('copyTo')}:</span>
              <span>{datas?.copyTo || ''}</span>
            </Grid>
            <Grid item {...flexRows} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '20px' }}>{L('toWho')}:</span>
              <Box>
                {datas?.fromEmail?.split(',').map((item) => (
                  <div key={item}>
                    <span {...flexRows}>{item}</span>
                    <br />
                  </div>
                ))}
              </Box>
            </Grid>
            <Grid item {...flexRows} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '20px' }}>{L('accessory')}:</span>
              <Box>
                {datas?.fileNameList?.map((item) => (
                  <div key={item}>
                    <span {...flexRows}>{item}</span>
                    <br />
                  </div>
                ))}
              </Box>
            </Grid>
            <Grid container>
              <ReactWEditor
                ref={myRef}
                value={templateHtml}
                config={{ menus: [], showFullScreen: false }}
                className={classes.reactWEditor}
              />
            </Grid>
            <Grid container style={{ justifyContent: 'flex-end' }}>
              <Button
                className={classes.btn}
                variant="contained"
                onClick={() => {
                  history.goBack();
                }}
              >
                {L('Close')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </HAPaper>
    </div>
  );
};

export default Detail;
