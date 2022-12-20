import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  //   CardMedia,
  //   CardActions,
  //   Collapse,
  //   Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import API from '../../../../../api/file/file';
import fileIcon from '../../../../../utils/fileIcon';
import CommonTip from '../../../../../components/CommonTip';

const config = {
  xl: 2,
  lg: 2,
  md: 3,
  sm: 4,
  xs: 12
};

// get the file suffix
const getSuffix = (name) => {
  let suffix = '';
  const index = name?.lastIndexOf('.');
  if (index > -1) {
    suffix = name.slice(index + 1);
  }
  return suffix?.toLowerCase() || '';
};

const supportMedia = ['mp4', 'mp3', 'pdf', 'jpg', 'png', 'jpeg'];

const File = (props) => {
  const { item, innerDir, setInnerDir, loading, openPreviewMedia } = props;

  const [active, setActive] = useState(false); // 是否激活背景颜色
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
    setActive(false);
  };

  const handleDownload = (fileName) => {
    window.open(API.downloadFile(innerDir, fileName));
    handleClose();
  };

  const open = Boolean(anchorEl);

  const onDoubleClick = () => {
    if (loading) {
      return;
    }

    const suffix = getSuffix(item);

    if (!suffix) {
      // folder
      setInnerDir(`${innerDir}/${item}`);
    } else if (supportMedia.includes(suffix)) {
      openPreviewMedia(innerDir, item, suffix);
    } else {
      CommonTip.warning('Previewing this type of file is not supported');
    }
  };

  return (
    <Grid
      item
      {...config}
      onMouseEnter={() => {
        setActive(true);
      }}
      onMouseLeave={() => {
        setActive(false);
      }}
    >
      <Card style={{ backgroundColor: active ? '#e5f3ff' : '' }} onDoubleClick={onDoubleClick}>
        <CardHeader
          action={
            <div style={{ height: '48px' }}>
              {getSuffix(item) && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  <MoreVert style={{ color: '#999' }} />
                </IconButton>
              )}

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: '200px'
                    // width: '20ch'
                  }
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleDownload(item);
                  }}
                >
                  Download
                </MenuItem>
              </Menu>
            </div>
          }
        />

        <CardContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              height: '150px'
            }}
          >
            <div>{fileIcon(getSuffix(item))}</div>
            <div
              style={{
                textAlign: 'center',
                wordBreak: 'break-all',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                marginTop: '10px'
              }}
            >
              {item}
            </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default File;
