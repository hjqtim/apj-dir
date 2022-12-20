import React, { useEffect, memo, useMemo, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from 'react-redux';

import ipassignAPI from '../../../../api/ipassign';
import {
  // CommonTip,
  Loading
} from '../../../../components';
import { setApproveTouch } from '../../../../redux/IPAdreess/ipaddrActions';

import { validSubnet2 } from '../../../../utils/tools';

const RangeIP = (props) => {
  const dispatch = useDispatch();
  const { item, ind, setWrong, DHCPRangeData, setDHCPRangeData, errors, touches } = props;
  const formStatus = useSelector((state) => state.IPAdreess.formStatus);

  const {
    subnetListAndOneDetail,
    subnetSelected,
    ipNumber,
    rangeFrom,
    rangeTo,
    bit,
    rangeIpList,
    saveStatus
  } = item;

  const [subnetError, setSubnetError] = useState(false);

  const optionsMemo = useMemo(
    () => subnetListAndOneDetail.map((optionItem) => optionItem.newSubnet),
    [subnetListAndOneDetail]
  );
  // console.log('RangeIP', item, subnetListAndOneDetail);  //检查传值

  const fieldsTouchesHandler = (field, index) => {
    dispatch(setApproveTouch({ attr: 'rangeTouches', field, index }));
  };

  useEffect(() => {
    initAnalyzer();
  }, []);

  const initAnalyzer = () => {
    // console.log('initAnalyzer 1', DHCPRangeData);

    if (saveStatus === 0 && rangeIpList) {
      if (rangeIpList.length > 0 && rangeIpList.length + 1 >= ipNumber) {
        const tempIP = rangeIpList[0];
        const arr = tempIP.split('.');
        const tempValue = `${arr[0]}.${arr[1]}.${arr[2]}.0`;

        const tempArr = getMinMax(rangeIpList);
        // const bitValue = tempArr[0];
        const rangeFrom = tempArr[0];
        const rangeTo = tempArr[ipNumber - 1];

        const temp = [...DHCPRangeData];
        temp[ind].subnetSelected = tempValue;
        temp[ind].rangeFrom = parseInt(rangeFrom);
        temp[ind].rangeTo = parseInt(rangeTo);
        setDHCPRangeData(temp);
        setWrong(false);
      } else {
        setWrong(true);
      }
    } else if (saveStatus === 1) {
      // console.log('initAnalyzer 2', DHCPRangeData, ind);

      const ipListTempA = DHCPRangeData[ind]?.ipList[0]?.ipAddress;
      const ipListTempB =
        DHCPRangeData[ind]?.ipList[DHCPRangeData[ind]?.ipList.length - 1]?.ipAddress;

      // console.log('ipListTempA', ipListTempA, ipListTempB);
      if (ipListTempA && ipListTempB) {
        const arrA = ipListTempA.split('.');
        const arrB = ipListTempB.split('.');
        const selectedSubA = `${arrA[0]}.${arrA[1]}.${arrA[2]}`;

        const temp = [...DHCPRangeData];
        temp[ind].subnetSelected = selectedSubA;
        temp[ind].rangeFrom = parseInt(arrA[3]);
        temp[ind].rangeTo = parseInt(arrB[3]);
        // console.log('YYYYY', temp);
        // setDHCPRangeData(temp);
        setDHCPRangeData(temp);
      }
    }
  };

  const getMinMax = (rangeIpList) => {
    let arrTemp = [];
    for (let i = 0; i < rangeIpList.length; i += 1) {
      const temp = rangeIpList[i];
      const arr = temp.split('.');
      const temp2 = arr[3];
      arrTemp = [...arrTemp, temp2];
    }
    arrTemp.sort((a, b) => a - b);
    // console.log('GET MIN', arrTemp);
    return arrTemp;
  };

  const subnetChange = (val) => {
    const validSubnetError = validSubnet2(val);
    setSubnetError(!validSubnetError);
    // console.log('subnetChange', val, validSubnetError);

    const temp = [...DHCPRangeData];
    const { ipNumber, bit } = temp[ind];

    if (bit !== '' && bit !== 0 && bit !== null) {
      // console.log('getIpBySubnetAndBit :', bit, ipNumber);
      Loading.show();
      ipassignAPI
        .getIpBySubnetAndBit({
          subnet: val,
          bit,
          ipNum: ipNumber,
          ipType: 'DHCP RANGE'
        })
        .then((res) => {
          console.log('getIpBySubnetAndBit', res);
          if (res?.data?.code === 200) {
            const rangeIpList = res?.data?.data?.rangeIpList;
            if (rangeIpList?.length >= ipNumber) {
              // console.log('getIpBySubnetAndBit', rangeIpList);
              const tempStartArr = rangeIpList[0]?.split('.');
              const tempEndArr = rangeIpList[rangeIpList?.length - 1].split('.');

              temp[ind].subnetSelected = val;
              temp[ind].bit = parseInt(bit);
              temp[ind].rangeFrom = parseInt(tempStartArr[3]);
              temp[ind].rangeTo = parseInt(tempEndArr[3]);
              setDHCPRangeData(temp);
            } else {
              temp[ind].subnetSelected = val;
              temp[ind].rangeFrom = '';
              temp[ind].rangeTo = '';
              setDHCPRangeData(temp);
            }
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
    // console.log('subnetChange', bit, e);
  };

  const bitChange = (value) => {
    // console.log('bitChange: ', value, subnetSelected);
    if (value !== '' || value !== 0) {
      if (value === 0) {
        value = 1;
      }
      if (value > 32) {
        value = 32;
      }
      const temp = [...DHCPRangeData];

      const { subnetSelected } = temp[ind];
      const { ipNumber } = temp[ind];
      if (subnetSelected !== '' && (value !== '' || value !== 0)) {
        Loading.show();
        ipassignAPI
          .getIpBySubnetAndBit({
            subnet: subnetSelected,
            bit: value,
            ipNum: ipNumber,
            ipType: 'DHCP RANGE'
          })
          .then((res) => {
            // console.log('getIpBySubnetAndBit', res);
            if (res?.data?.code === 200) {
              const rangeIpList = res?.data?.data?.rangeIpList;
              if (rangeIpList.length >= ipNumber) {
                // console.log('getIpBySubnetAndBit', rangeIpList);
                const tempStartArr = rangeIpList[0].split('.');
                const tempEndArr = rangeIpList[rangeIpList.length - 1].split('.');

                temp[ind].bit = parseInt(value);
                temp[ind].rangeFrom = parseInt(tempStartArr[3]);
                temp[ind].rangeTo = parseInt(tempEndArr[3]);
              } else {
                temp[ind].bit = parseInt(value);
                temp[ind].rangeFrom = '';
                temp[ind].rangeTo = '';
                setDHCPRangeData(temp);
              }
              setDHCPRangeData(temp);
            } else {
              temp[ind].bit = parseInt(value);
              setDHCPRangeData(temp);
            }
            Loading.hide();
          });
      }
    }
  };

  const ipnumChange = (value) => {
    if (value !== '') {
      if (value > 253) {
        value = 253;
      }
      const temp = [...DHCPRangeData];
      temp[ind].ipNumber = parseInt(value);
      setDHCPRangeData(temp);
      // setError01(false);
    } else {
      // setError01(true);
    }
  };
  const startIPChange = (value) => {
    if (parseInt(value) + parseInt(ipNumber) > 252) {
      value = 252 - parseInt(ipNumber);
    }
    if (parseInt(value) < 2) {
      value = 2;
    }

    const temp = [...DHCPRangeData];
    temp[ind].rangeFrom = parseInt(value);
    temp[ind].rangeTo = parseInt(value) + parseInt(ipNumber) - 1;
    setDHCPRangeData(temp);
    // if (value !== '') {
    //   checkIPRange(value);
    // }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <div style={{ height: 20, fontWeight: 'bold' }}>Subnet</div>
          <div>
            <Autocomplete
              disabled={formStatus === 20 || formStatus === 30}
              freeSolo
              id={`range-${ind}`}
              value={subnetSelected || null}
              options={optionsMemo || []}
              onChange={(_, value) => {
                console.log('Auto complete onchange:', value);
              }}
              onInputChange={(_, newInputValue) => {
                console.log('Auto complete onInputChange:', newInputValue);
              }}
              renderInput={(inputParams) => {
                console.log('inputParams', inputParams.inputProps.value);
                return (
                  <TextField
                    {...inputParams}
                    // label=" *"
                    variant="outlined"
                    size="small"
                    value={subnetSelected || null}
                    // name={`rangeIpList[${index}].ip`}
                    onChange={(e) => {
                      console.log('auto text onchange:', e.target.value);
                      //
                    }}
                    onBlur={(e) => {
                      // console.log('auto text onblur', e.target.value);
                      subnetChange(e.target.value);
                    }}
                    error={subnetError}
                  />
                );
              }}
              style={{ width: 150, background: '#fff' }}
            />
          </div>
        </div>
        <div style={{ marginLeft: 5 }}>
          <div style={{ height: 20, fontWeight: 'bold', marginBottom: 7 }}>Bit</div>
          <br />
          <div style={{ marginTop: -28 }}>
            <NumberFormat
              disabled={formStatus === 20 || formStatus === 30}
              style={
                Boolean(errors?.rangeFrom) && Boolean(touches?.rangeFrom)
                  ? {
                      border: '1px solid #f50101',
                      borderRadius: 5,
                      width: 60,
                      height: 38,
                      textAlign: 'right',
                      padding: 5
                    }
                  : {
                      border: '1px solid #ccc',
                      borderRadius: 5,
                      width: 60,
                      height: 38,
                      textAlign: 'right',
                      padding: 5
                    }
              }
              allowNegative={false}
              value={bit}
              onBlur={(e) => {
                bitChange(e.target.value);

                fieldsTouchesHandler('bit', ind);
              }}
            />
          </div>
        </div>
        <div>
          <div style={{ marginLeft: 5, marginRight: 5 }}>
            <div style={{ height: 20, fontWeight: 'bold', marginBottom: 7 }}>No. of IP</div>
            <br />
            <div style={{ marginTop: -25 }}>
              <NumberFormat
                style={
                  // eslint-disable-next-line
                  false
                    ? {
                        border: '1px solid #f50101',
                        borderRadius: 5,
                        width: 60,
                        height: 38,
                        textAlign: 'center',
                        padding: 5
                      }
                    : {
                        border: '1px solid #f5f5f5',
                        borderRadius: 5,
                        width: 60,
                        height: 38,
                        textAlign: 'center',
                        padding: 5
                      }
                }
                allowNegative={false}
                value={ipNumber}
                onBlur={(e) => {
                  ipnumChange(e.target.value);
                }}
                disabled
              />
            </div>
          </div>
        </div>
        <div style={{ marginRight: 5 }}>
          <div style={{ height: 20, fontWeight: 'bold', marginBottom: 7 }}>Start IP</div>
          <br />
          <div style={{ marginTop: -25 }}>
            <NumberFormat
              // disabled={formStatus === 20 || formStatus === 30}
              disabled
              style={
                Boolean(errors?.rangeFrom) && Boolean(touches?.rangeFrom)
                  ? {
                      // border: '1px solid #f50101',
                      border: '1px solid #f5f5f5',
                      borderRadius: 5,
                      width: 60,
                      height: 38,
                      textAlign: 'right',
                      padding: 5
                    }
                  : {
                      border: '1px solid #ccc',
                      borderRadius: 5,
                      width: 60,
                      height: 38,
                      textAlign: 'right',
                      padding: 5
                    }
              }
              allowNegative={false}
              value={rangeFrom}
              onBlur={(e) => {
                if (ipNumber !== '') {
                  startIPChange(e.target.value);
                }
                fieldsTouchesHandler('rangeFrom', ind);
              }}
            />
          </div>
        </div>
        <div style={{ marginRight: 5 }}>
          <div style={{ height: 20, fontWeight: 'bold', marginBottom: 7 }}>End IP</div>
          <br />
          <div style={{ marginTop: -25 }}>
            <NumberFormat
              style={{
                border: '1px solid #f5f5f5',
                borderRadius: 5,
                width: 60,
                height: 38,
                textAlign: 'right',
                padding: 5
              }}
              allowNegative={false}
              value={rangeTo}
              // onBlur={(e)=>{ }}
              // onValueChange={() => {}}
              disabled
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(RangeIP);
