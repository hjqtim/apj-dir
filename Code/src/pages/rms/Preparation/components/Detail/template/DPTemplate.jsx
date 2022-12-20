import React from 'react';
import dayjs from 'dayjs';
import style from './DPTemplate.module.css';
import { getDate } from '../../../../../../utils/date';

function DPtemplate(props) {
  const { dpLocationList, dpRequest } = props.data;
  const { week, year, mon, day } = getDate();

  const getUserName = (value) => {
    const arr = value?.split?.(',') || [];
    if (arr?.[0]) {
      return arr[0];
    }
    return '';
  };
  return (
    <>
      {Object.keys(props.data).length && (
        <div id="DPreports" className={style.formStart}>
          {/* <div className={style.A4} style={{ height: '30px', display: 'block' }} /> */}

          <div className={style.A4}>
            <div className={style.forTitle01}>
              <span style={{ fontweight: 'bold' }}>
                <div style={{ lineHeight: '5px' }}>Data Port Installation Request Form</div>
              </span>
              <span style={{ textAlign: 'right', fontSize: '16px' }}>
                <div style={{ border: 0, padding: 0 }}>
                  <p style={{ fontWeight: 'bold' }}>Request Number:{dpRequest.requestNo}</p>
                  <p>Print Date：{`${week}, ${mon} ${day}, ${year}`}</p>
                </div>
              </span>
            </div>
          </div>

          <div className={style.A4}>
            <p className={style.fontBar} />
          </div>

          <div className={style.A4}>
            <div style={{ fontWeight: 600, lineHeight: '25px' }}>Requester Information</div>
            <div className={style.form01}>
              <div className={style.form01Left}>
                <span className={style.form01Left01}> Name: </span>
                <span className={style.form01Left02}>
                  <input
                    value={getUserName(dpRequest.requestername || '')}
                    disabled
                    id="PrequesterName"
                  />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Title: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.requestertitle} disabled />
                </span>
              </div>

              <div className={style.form01Left}>
                <span className={style.form01Left01}> ID: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.requesterid} disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Email: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.requesteremail || undefined} disabled />
                </span>
              </div>

              <div className={style.form01Left}>
                <span className={style.form01Left01}> Phone: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.requesterphone} disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Institution/Dept: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.requesterhosp} disabled />
                </span>
              </div>
            </div>

            <div style={{ fontWeight: 600, lineHeight: '25px', marginTop: '10px' }}>
              Requester's Manage Information
            </div>
            <div className={style.form01}>
              <div className={style.form01Left}>
                <span className={style.form01Left01}> Name: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.rmanagername} disabled />
                </span>
              </div>

              <div className={style.form01Right}>
                <span className={style.form01Left01}> Title: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.rmanagertitle} disabled />
                </span>
              </div>
              <div className={style.form01Left}>
                <span className={style.form01Left01}> ID: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.rmanagerid} disabled />
                </span>
              </div>

              <div className={style.form01Right}>
                <span className={style.form01Left01}> Email: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.rmanageremail} disabled />
                </span>
              </div>
              <div className="">
                <span className={style.form01Left01}> Status: </span>
                <span className="">
                  <input
                    value={dpRequest.rmanagerapprovalstatus}
                    style={{
                      width: '83%',
                      marginLeft: '3%',
                      border: 'none',
                      borderBottom: '1px solid #000'
                    }}
                    disabled
                  />
                </span>
              </div>
            </div>

            <div style={{ fontWeight: 600, lineHeight: '25px', marginTop: '10px' }}>
              Service Required
            </div>
            <div className={style.form01}>
              <div className={style.form01Left} style={{ width: '59%' }}>
                <span className={style.form01Left01} style={{ width: '5cm' }}>
                  Institution/Location:
                </span>
                <span className="">
                  <input
                    value={`${dpRequest.serviceathosp}---${dpRequest.hospName}`}
                    disabled
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #000',
                      width: '59%'
                    }}
                  />
                </span>
              </div>
              <div className={style.form01Right} style={{ width: '39%' }}>
                <span className={style.form01Left01}> Request Date: </span>
                <span className="">
                  <input
                    value={
                      dpRequest?.requestdate
                        ? dayjs(dpRequest?.requestdate).format('DD-MMM-YYYY HH:mm:ss')
                        : ''
                    }
                    disabled
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #000',
                      width: '63%'
                    }}
                  />
                </span>
              </div>

              <div className={style.form01Left} style={{ width: '59%' }}>
                <span className={style.form01Left01} style={{ width: '5cm' }}>
                  Expected Completion Date:
                </span>
                <span className="">
                  <input
                    value={
                      dpRequest?.expectedcompletiondate
                        ? dayjs(dpRequest?.expectedcompletiondate).format('DD-MMM-YYYY')
                        : ''
                    }
                    disabled
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #000',
                      width: '59%'
                    }}
                  />
                </span>
              </div>
              <div className={style.form01Right} style={{ width: '39%' }}>
                <span className={style.form01Left01}> Institution Ref: </span>
                <span className="">
                  <input
                    value={dpRequest.hospitalreference}
                    disabled
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #000',
                      width: '63%'
                    }}
                  />
                </span>
              </div>
            </div>

            <div style={{ zoom: '0.84', marginTop: '20px' }}>
              <span style={{ width: '75%', fontSize: '16px', marginRight: '2%' }}>
                This request is relating to the connection of Medical/Specialized Network to the HA
                Network:
              </span>
              <span className="">
                <input
                  value="No"
                  style={{
                    width: '24%',
                    // marginLeft: '3%',
                    border: 'none',
                    borderBottom: '1px solid #000'
                  }}
                  disabled
                />
              </span>
            </div>
          </div>

          <div className={style.A4}>
            <div
              className={style.form02}
              style={{
                marginTop: '20px',
                fontSize: '10px',
                fontWeight: 600,
                zoom: '0.83'
              }}
            >
              <table width="120%" height="" border="1px" cellSpacing="0" name="table01">
                <thead>
                  <tr>
                    <td>No. Of DP</td>
                    <td>DP Information</td>
                    <td>Location Details</td>
                    <td>Site Contact</td>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(dpLocationList).length &&
                    Object.keys(dpLocationList).map((key) => {
                      const item = dpLocationList[key];
                      console.log(item);
                      return (
                        <tr key={key}>
                          <td style={{ width: '80px', textAlign: 'center' }}>{item.numOfDP}</td>
                          <td>
                            <div>
                              <span>Service Type:</span>
                              <span>
                                <input disabled value={item.serviceType} />
                              </span>
                            </div>
                            <div>
                              <span>Data Port ID:</span>
                              <span>
                                <input disabled value={item.dataPortID} />
                              </span>
                            </div>
                            <div>
                              <span>Conduit Type:</span>
                              <span>
                                <input disabled value={item.conduitType} />
                              </span>
                            </div>
                            <div>
                              <span>Project:</span>
                              <span>
                                <input disabled />
                              </span>
                            </div>
                          </td>

                          <td>
                            <div>
                              <span>Dept:</span>
                              <span>
                                <input value={item.dept} disabled />
                              </span>
                            </div>
                            <div>
                              <span>Block:</span>
                              <span>
                                <input value={item.block} disabled />
                              </span>
                            </div>
                            <div>
                              <span>Floor:</span>
                              <span>
                                <input value={item.floor} disabled />
                              </span>
                            </div>
                            <div>
                              <span>Rm/Ward:</span>
                              <span>
                                <input value={item.dept} disabled />
                              </span>
                            </div>
                          </td>

                          <td>
                            <div>
                              <span>Name:</span>
                              <span>
                                <input
                                  value={item.siteContactPerson}
                                  disabled
                                  style={{ width: '100px' }}
                                />
                              </span>
                            </div>
                            <div>
                              <span>Title:</span>
                              <span>
                                <input
                                  disabled
                                  value={item.siteContactTitle}
                                  style={{ width: '100px' }}
                                />
                              </span>
                            </div>
                            <div>
                              <span>Phone:</span>
                              <span>
                                <input
                                  disabled
                                  value={item.siteContactPhone}
                                  style={{ width: '100px' }}
                                />
                              </span>
                            </div>
                            <div>&nbsp;</div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className={style.A4} style={{ marginTop: '20px' }}>
            <div className={style.form03}>
              <span style={{ width: '30%', display: 'inline-block' }}>
                Tentative Installation Schedule:
              </span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
            <div className={style.form03}>
              <span style={{ width: '30%', display: 'inline-block' }}>Special Requirements:</span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
            <div className={style.form03}>
              <span style={{ width: '30%', display: 'inline-block' }}>
                Justification for using WLAN:
              </span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
          </div>

          <div className={style.A4}>
            <div style={{ fontWeight: 600, lineHeight: '25px', marginTop: '10px' }}>
              Cost Estimate
            </div>
            <div className={style.form01}>
              <div className={style.form01Left}>
                <span className={style.form01Left01} style={{ width: '25%' }}>
                  {' '}
                  Quotation Status:{' '}
                </span>
                <span className={style.form01Left02}>
                  <input value="Waiting" disabled />
                </span>
              </div>

              <div className={style.form01Right}>
                <span className={style.form01Left01} style={{ width: '28%' }}>
                  {' '}
                  Last Updated On:{' '}
                </span>
                <span className={style.form01Left02}>
                  <input value="2021-11-12 3:41:36 PM" disabled />
                </span>
              </div>
            </div>
          </div>

          <div className={style.A4} style={{ marginTop: '10px', zoom: '0.83' }}>
            <table width="120%" height="" cellSpacing="0" border="1px" name="table01">
              <thead>
                <tr>
                  <td style={{ width: '30%' }}>Service Type</td>
                  <td style={{ width: '20%' }}>Location</td>
                  <td>No. Of DP</td>
                  <td>Cabling Charge</td>
                  <td>Switch Port Charge (HK$)</td>
                  <td>Subtotal (HK$)</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Install new data port with metallic conduit protection</td>
                  <td>,,/F,BLK</td>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'center' }}>1 x $ 2450.00</td>
                  <td style={{ textAlign: 'center' }}>1 x $ 800.00</td>
                  <td style={{ textAlign: 'center' }}>$ 3250.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={style.A4}>
            <div style={{ fontWeight: 600, lineHeight: '25px', marginTop: '20px' }}>
              Fund Confirmation
            </div>
            <div
              style={{
                fontWeight: 600,
                lineHeight: '25px',
                textDecoration: 'underline'
              }}
            >
              Budget Holder (or Delegate) Information:
            </div>
            <div className={style.form01}>
              <div className={style.form01Left}>
                <span className={style.form01Left01}> Name: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Title: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>

              <div className={style.form01Left}>
                <span className={style.form01Left01}> Email: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> ID: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>
            </div>
            <div
              style={{
                fontWeight: 600,
                lineHeight: '25px',
                textDecoration: 'underline',
                marginTop: '20px'
              }}
            >
              Payment Information:
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Maximum Cost Committed:</span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Payment Method:</span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Funding Source:</span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Fund Approval Status:</span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Fund Transfer Status:</span>
              <span>
                <input type="text" disabled />
              </span>
            </div>
          </div>

          <div className={style.A4}>
            <div style={{ fontWeight: 600, lineHeight: '25px', marginTop: '10px' }}>
              HO IT&HI N3 Team Responsible Staff Information
            </div>
            <div className={style.form01}>
              <div className={style.form01Left}>
                <span className={style.form01Left01}> Name: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Title: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>

              <div className={style.form01Left}>
                <span className={style.form01Left01}> Phone: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Email: </span>
                <span className={style.form01Left02}>
                  <input value="" disabled />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DPtemplate;
