import React, { useEffect, useState } from 'react';
import { Grid, Breadcrumbs, makeStyles, Link, Typography } from '@material-ui/core';
// import Carousel, { Modal, ModalGateway } from 'react-images';
import { HAPaper } from '../../../../../components';
import Loading from '../../../../../components/Loading';
import File from '../File';
import Detail from '../Detail';
import API from '../../../../../api/file/file';

const useStyles = makeStyles(() => ({
  fileRoot: {
    '& .MuiCardContent-root': {
      paddingTop: '0'
    }
  },
  crumbs: {
    '& .MuiBreadcrumbs-ol': {
      height: '74px'
    }
  }
}));

const List = () => {
  const classes = useStyles();

  const [innerDir, setInnerDir] = useState('SENSE'); // current path
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [suffix, setSuffix] = useState('');

  const getList = () => {
    const params = {
      innerDir
    };
    setLoading(true);
    API.getFileList(params)
      .then((res) => {
        if (res?.data?.data?.dirOrFileList) {
          setList(res.data.data.dirOrFileList);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [innerDir]);

  // preview audio and video
  /**
   *
   * @param {*} remoteDir 文件所在路径
   * @param {*} remoteFile 文件名
   * @param {*} suffixName 后缀名
   */
  const openPreviewMedia = (remoteDir, remoteFile, suffixName) => {
    console.log('openPreviewMedia', remoteDir, remoteFile);
    try {
      Loading.show();
      API.previewImage(remoteDir, remoteFile)
        .then((res) => {
          if (res?.data) {
            setMediaUrl(window.URL.createObjectURL(res.data));
            setSuffix(suffixName);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    } catch (error) {
      console.log('err');
    }
  };

  const closePreviewMedia = () => {
    setMediaUrl('');
    setTimeout(() => {
      setSuffix('');
    }, 200);
  };

  const handleClick = (index) => {
    if (!loading) {
      const pathArr = dirList?.slice(0, index + 1);
      const newPath = pathArr?.join('/');
      setInnerDir(newPath);
    }
  };

  const dirList = innerDir?.split('/') || [];

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* <SearchBar
            onSearchFieldChange={formik.handleChange}
            onSearchButton={formik.handleSubmit}
            onClearButton={handleClear}
            fieldList={searchBarFieldList}
          /> */}

          <HAPaper />

          {/* 面包屑 */}
          <Grid
            style={{
              marginTop: '10px',
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}
            item
            xs
            className={classes.crumbs}
          >
            <div role="presentation" onClick={() => {}}>
              <Breadcrumbs>
                {dirList.map((dir, index) => {
                  if (index === dirList.length - 1) {
                    return <Typography key={dir}>{dir}</Typography>;
                  }
                  return (
                    <Link
                      key={dir}
                      underline="hover"
                      color="inherit"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleClick(index);
                      }}
                    >
                      {dir}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            </div>
          </Grid>

          <Grid container spacing={4} style={{ userSelect: 'none', marginTop: '20px' }}>
            {list.map((item) => (
              <File
                item={item}
                key={item}
                innerDir={innerDir}
                setInnerDir={setInnerDir}
                loading={loading}
                openPreviewMedia={openPreviewMedia}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Detail
        type={suffix}
        url={mediaUrl}
        open={Boolean(mediaUrl)}
        handleClose={closePreviewMedia}
      />
    </>
  );
};

export default List;
