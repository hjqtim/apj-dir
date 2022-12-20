import React, { useState } from 'react';
import { Grid, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import _ from 'lodash';
import SearchIcon from '@material-ui/icons/Search';
import RestoreIcon from '@material-ui/icons/Restore';
import ActionLogs from '../ActionLogs';
import ipassignAPI from '../../../../../api/ipassign';
import webAPI from '../../../../../api/webdp/webdp';
import fileAPI from '../../../../../api/file/file';
import envUrl from '../../../../../utils/baseUrl';
import envPrefix from '../../../../../utils/prefix';
import { getDayNumber01 } from '../../../../../utils/date';
import { uploadFileCheck } from '../../../../../utils/auth';
import { CommonTip, Loading } from '../../../../../components';

const HandleSearch = ({
  rows,
  params,
  setParams,
  getIpAdminList,
  listLoading,
  setRows,
  hospitalList,
  hospitalLoading
}) => {
  const [subnetList, setSubnetList] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blockOptions, setBlockOptions] = useState([]);
  const [blockLoading, setBlockLoading] = useState(false);
  const [floorLoading, setFloorLoading] = useState(false);
  const [floorOptions, setFloorOptions] = useState([]);

  const [subnetLoading, setSubnetLoading] = useState(false);

  const getBlockList = (hospital) => {
    setBlockLoading(true);
    webAPI
      .getBlockByHospCodeList(hospital)
      .then((blockResult) => {
        let blockList = blockResult?.data?.data?.blockByHospCodeList || [];
        blockList = blockList.map((item) => item.block);
        setBlockOptions(blockList);
      })
      .finally(() => {
        setBlockLoading(false);
      });
  };

  const getFloorList = (block) => {
    setFloorLoading(true);
    webAPI
      .getBlockAndFloorByHospCodeList({
        hospCode: params?.hospital,
        block
      })
      .then((blockResult) => {
        let floorList = blockResult?.data?.data?.blockAndFloorByHospCodeList || [];
        floorList = floorList.map((item) => item.floor);
        setFloorOptions(floorList);
      })
      .finally(() => {
        setFloorLoading(false);
      });
  };

  const getSubnetList = (data) => {
    setSubnetLoading(true);
    ipassignAPI
      .getSubnetList(data)
      .then((res) => {
        let resSubnetList = res?.data?.data?.subnetList || [];
        resSubnetList = resSubnetList.map((item) => item.newSubnet);
        resSubnetList = resSubnetList.filter((item) => item);
        resSubnetList = _.unionBy(resSubnetList);
        resSubnetList.sort();
        setSubnetList(resSubnetList);
      })
      .finally(() => {
        setSubnetLoading(false);
      });
  };

  const ipAddressBlur = (e) => {
    const lastAddess = e.target.value || '';
    if (lastAddess && !listLoading && params.subnet) {
      let subnet = params?.subnet?.split('.');
      subnet.pop();
      subnet = subnet.join('.');
      const ipAddressList = `${subnet}.${lastAddess}`;
      getIpAdminList({ ipAddressList });
    } else if (!lastAddess && params.subnet && !listLoading) {
      getIpAdminList({ subnet: params.subnet });
    }
  };

  // 导出 xlsx
  const exportExcel = () => {
    console.log('exportExcelIPList', rows);
    let ipsList = [];
    if (rows?.length > 0) {
      for (let i = 0; i < rows.length; i += 1) {
        ipsList = [...ipsList, rows[i].ipAddress];
      }
    }
    // console.log('exportExcel', rows, ipsList);
    if (ipsList.length > 0) {
      ipassignAPI.exportExcelIPList({ ipAddressList: ipsList }).then((res) => {
        console.log('exportExcelIPList', res?.data?.data);
        if (res?.data?.code === 200) {
          const url = res?.data?.data;
          if (url !== '') {
            fetch(url)
              .then((res) => res.blob())
              .then((blob) => {
                // 将链接地址字符内容转变成blob地址
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                // 测试链接console.log(a.href)
                a.download = `ipList${getDayNumber01()}.xlsx`; // 下载文件的名字
                document.body.appendChild(a);
                a.click();
              });
          }
        }
      });
    }
  };
  const fileHandler = (e) => {
    const file = e.currentTarget.files[0];
    if (uploadFileCheck(file)) {
      console.log('test: ', file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append(
        'resumeFile',
        new Blob(
          [
            JSON.stringify({
              groupType: 'IPList',
              requestNo: 0,
              requesterId: 0,
              projectName: 'IPassign'
            })
          ],
          {
            type: 'application/json'
          }
        )
      );

      Loading.show();
      fileAPI.webDPuploadFile(formData).then((res) => {
        // console.log('webDPuploadFile', res);
        const resData = res?.data?.data || [];
        const count = _.countBy(resData?.[0]?.fileUrl)['/'];
        let arr = resData?.[0]?.fileUrl.split('/');
        const fileName = arr?.[arr.length - 1];
        arr = arr?.splice(0, count);
        const dir = arr?.join('/');
        const path = `${envUrl.file}${envPrefix.file}/resumeFile/downloadFile?remoteDir=${dir}/&remoteFile=${fileName}`;
        console.log('path', path);
        updateURL2IPassign(path);
      });
      // .finally(() => {
      //   Loading.hide();
      // });
    }
  };
  const updateURL2IPassign = (path) => {
    Loading.show();
    ipassignAPI
      .importCSV2IPList({ url: path })
      .then((res) => {
        // console.log('importCSV2IPList', res);
        if (res?.data?.code === 200) {
          CommonTip.success('import success');
          // 检查一下 当前 查询框是否有条件，有就执行，没有就不用
          if (rows.length > 0) {
            searchHandle();
          }
        }
        if (res?.data?.code === 422) {
          CommonTip.warning('Excel data format has wrong');
          // 表示 日期格式 不正确
        }
      })
      .finally(() => {
        Loading.hide();
        const files = document.getElementById('import');
        files.value = '';
      });
  };

  const subnetChange = (e, value) => {
    setParams({ ...params, subnet: value || '', ipAddress: '' });
    if (value) {
      getIpAdminList({ subnet: value });
    }
    if (!value) {
      setRows([]);
    }
  };

  const searchHandle = () => {
    if (params.ipAddress) {
      let subnet = params.subnet?.split('.') || [];
      subnet.pop();
      subnet = subnet?.join('.') || '';
      getIpAdminList({ ipAddressList: `${subnet}.${params.ipAddress}` });
    } else if (!params.ipAddress && params.subnet) {
      getIpAdminList({ subnet: params.subnet });
    }
  };

  const btnPros = {
    variant: 'contained',
    color: 'primary',
    style: { marginLeft: '1em', marginBottom: '0.5em' }
  };

  return (
    <>
      <Grid container spacing={3} style={{ alignItems: 'flex-end' }}>
        <Grid item xs={12} sm={6} md={2} xl={2}>
          <Autocomplete
            onChange={(e, value) => {
              if (value) {
                getBlockList(value.hospital);
                getSubnetList({ hospCode: value.hospital });
              }
              setParams({
                ...params,
                hospital: value?.hospital || '',
                block: '',
                floor: '',
                subnet: '',
                ipAddress: ''
              });
              setBlockOptions([]);
              setFloorOptions([]);
              setSubnetList([]);
              setRows([]);
            }}
            value={hospitalList?.find((item) => item.hospital === params?.hospital) || null}
            options={hospitalList || []}
            loading={hospitalLoading}
            disabled={listLoading}
            getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
            renderInput={(params) => <TextField {...params} label="Institution" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} xl={1}>
          <Autocomplete
            onChange={(e, block) => {
              if (block) {
                getFloorList(block);
                getSubnetList({ hospCode: params.hospital, block });
              }
              setParams({ ...params, block: block || '', floor: '', subnet: '', ipAddress: '' });
              setFloorOptions([]);
              setSubnetList([]);
              setRows([]);
            }}
            disabled={!params.hospital || listLoading}
            value={params?.block || ''}
            options={blockOptions || []}
            loading={blockLoading}
            renderInput={(params) => <TextField {...params} label="Block" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} xl={1}>
          <Autocomplete
            onChange={(e, floor) => {
              if (floor) {
                getSubnetList({
                  hospCode: params?.hospital,
                  block: params.block,
                  floor
                });
              }
              setParams({ ...params, floor: floor || '', subnet: '', ipAddress: '' });
              setSubnetList([]);
              setRows([]);
            }}
            value={params?.floor || ''}
            options={floorOptions || []}
            disabled={!params.block || listLoading}
            loading={floorLoading}
            renderInput={(params) => <TextField {...params} label="Floor" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} xl={1}>
          <Autocomplete
            onChange={subnetChange}
            disabled={!params.hospital || listLoading}
            value={params.subnet}
            options={subnetList}
            loading={subnetLoading}
            renderInput={(params) => <TextField {...params} label="Subnet" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} xl={1}>
          <TextField
            size="small"
            fullWidth
            value={params.ipAddress}
            onBlur={ipAddressBlur}
            disabled={!params.subnet || listLoading}
            onChange={(e) => {
              let value = e.target.value || '';
              if ((value && /^[0-9]*$/.test(value)) || !value) {
                value = value > 255 ? 255 : value;
                setParams({ ...params, ipAddress: value || '' });
              }
            }}
          />
        </Grid>
        <Grid item sm={12} md={12} xl={6}>
          <Button
            {...btnPros}
            onClick={searchHandle}
            disabled={!params.hospital || !params.subnet || listLoading}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
          <Button
            {...btnPros}
            startIcon={<CloudDownloadIcon />}
            onClick={exportExcel}
            disabled={rows.length === 0}
          >
            Export
          </Button>

          <Button {...btnPros} component="label" startIcon={<CloudUploadIcon />}>
            Import
            <input type="file" hidden onChange={fileHandler} accept=".xlsx" id="import" />
          </Button>
          <Button {...btnPros} startIcon={<RestoreIcon />} onClick={() => setDrawerOpen(true)}>
            Action Log
          </Button>
        </Grid>
      </Grid>

      <ActionLogs {...{ drawerOpen, setDrawerOpen, module: 'ipList' }} />
    </>
  );
};

export default HandleSearch;
