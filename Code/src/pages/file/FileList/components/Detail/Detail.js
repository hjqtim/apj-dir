import React, { useState } from 'react';
import { makeStyles, Typography, Backdrop } from '@material-ui/core';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import getIcons from '../../../../../utils/getIcons';
import { L } from '../../../../../utils/lang';

const useStyles = makeStyles((theme) => ({
  bbnormalError: {
    padding: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  video: {
    padding: theme.spacing(10),
    minHeight: '250px',
    '& video': {
      borderRadius: '10px'
    }
  },
  audio: { minHeight: '250px' },
  backdrop: {
    zIndex: 9999,
    color: '#fff'
  },
  myBackdrop: {
    overflow: 'auto',
    alignItems: 'stretch'
  }
}));

const Detail = (props) => {
  const classes = useStyles();
  const { open, type, url, handleClose } = props;
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const stopPropagation = (e) => {
    e?.stopPropagation?.();
  };

  const renderView = () => {
    switch (type) {
      case 'pdf':
        return (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="loading..."
            renderMode="canvas"
            onClick={stopPropagation}
          >
            {new Array(numPages).fill('').map((item, index) => (
              <Page
                key={index}
                width={960}
                pageNumber={index || 1}
                loading="loading...."
                renderMode="canvas"
              />
            ))}
          </Document>
        );
      case 'png':
        return <img src={url} alt="" />;
      case 'jpg':
        return <img src={url} alt="" />;
      case 'jpeg':
        return <img src={url} alt="" />;
      case 'mp4':
        return (
          <div className={classes.video} onClick={stopPropagation}>
            <video
              controls
              src={url}
              autoPlay
              controlsList="nodownload"
              style={{ maxWidth: '900px' }}
            >
              <track kind="captions" />
            </video>
          </div>
        );
      case 'mp3':
        return (
          <div className={classes.audio}>
            <audio controls src={url} controlsList="nodownload" autoPlay>
              <track kind="captions" />
            </audio>
          </div>
        );

      default:
        return (
          <div className={classes.bbnormalError}>
            {getIcons('bbnormalIcon')}
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <p> {L('filePreviewFailded')}</p>
            </Typography>
          </div>
        );
    }
  };
  return (
    <div>
      <Backdrop
        open={open}
        className={`${classes.backdrop} ${type === 'pdf' ? classes.myBackdrop : ''}`}
        onClick={handleClose}
      >
        {renderView()}
      </Backdrop>
    </div>
  );
};

export default Detail;
