import React from 'react';
import dayjs from 'dayjs';
import style from './APTemplate.module.css';
import { getDate } from '../../../../../utils/date';
import { formatterMoney } from '../../../../../utils/tools';

// const totalPrice = 0;
function APtemplate(props) {
  const { apLocationList, dpRequest } = props.data;
  const { week, year, mon, day } = getDate();

  // console.log('dpRequest', dpRequest);
  let totalPrice = 0;
  const totalTemp1 = dpRequest?.dustBarriersQty * dpRequest?.dustBarriersCharge;
  const totalTemp2 = dpRequest?.aerialWorkPlatFormQty * dpRequest?.aerialWorkPlatformCharge;
  const totalTemp3 = dpRequest?.additionalcharge;
  const otherTemp3 = totalTemp1 + totalTemp2 + totalTemp3;

  if (apLocationList?.length > 0) {
    for (let i = 1; i < apLocationList.length; i += 1) {
      totalPrice += apLocationList[i].subTotalCharge;
    }

    totalPrice += otherTemp3;
    // console.log('totalPrice', totalPrice, totalTemp1);
  }

  let paymentMethod = '';
  if (dpRequest?.paymentmethod === 1) {
    paymentMethod = 'Transfer from Chart of Account';
  }
  if (dpRequest?.paymentmethod === 2) {
    paymentMethod = 'Other Method';
  }
  if (dpRequest?.paymentmethod === 3) {
    paymentMethod = 'Bill to External Company';
  }

  let quotationStatus = '';
  if (dpRequest?.quotationstatus === 'W') {
    quotationStatus = 'Waiting For Approval';
  }
  if (dpRequest?.quotationstatus === 'R') {
    quotationStatus = 'Ready';
  }

  return (
    <>
      {Object.keys(props.data).length && (
        <div id="APreports" className={style.formStart}>
          {/* <div style={{ height: '20px', display: 'block' }} /> */}

          <div className={style.A4}>
            <div className={style.forTitle01}>
              <span style={{ fontweight: 'bold' }}>
                <div style={{ lineHeight: '5px' }}>WLAN Access Point Installation Request Form</div>
              </span>
              <span style={{ textAlign: 'right', fontSize: '9px' }}>
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
                  <input value={dpRequest.requestername} disabled />
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
                  <input value={dpRequest.requesteremail} disabled />
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
                    value={dpRequest.rmanagerapprovalstatus || ''}
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
              <span style={{ width: '75%', fontSize: '10px', marginRight: '2%' }}>
                This request is relating to the connection of Medical/Specialized Network to the HA
                Network:
              </span>
              <span className="">
                <input
                  value="No "
                  style={{
                    width: '24%',
                    marginLeft: '2%',
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
                zoom: '1'
              }}
            >
              <table width="100%" height="" border="1px" cellSpacing="0" name="table01">
                <thead>
                  <tr>
                    <td style={{ fontSize: 10 }}>DP Information</td>
                    <td style={{ fontSize: 10 }}>Location Details</td>
                    <td style={{ fontSize: 10 }}>Site Contact</td>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(apLocationList).length &&
                    Object.keys(apLocationList).map((key) => {
                      const item = apLocationList[key];
                      return (
                        <tr key={key}>
                          <td style={{ fontSize: 10 }}>
                            <div>
                              <span>Service Type:</span>
                              <span>
                                <input disabled value={item.serviceType} style={{ fontSize: 10 }} />
                              </span>
                            </div>
                            <div>
                              <span>Data Port ID:</span>
                              <span>
                                <input disabled value={item.dataPortID} style={{ fontSize: 10 }} />
                              </span>
                            </div>
                            <div>
                              <span>Conduit Type:</span>
                              <span>
                                <input disabled value={item.conduitType} style={{ fontSize: 10 }} />
                              </span>
                            </div>
                            <div>
                              <span>Project:</span>
                              <span>
                                <input disabled value={item.dataPortID} />
                              </span>
                            </div>
                          </td>

                          <td style={{ fontSize: 10 }}>
                            <div>
                              <span>Dept:</span>
                              <span>
                                <input disabled value={item.dept} style={{ fontSize: 10 }} />
                              </span>
                            </div>
                            <div>
                              <span>Block:</span>
                              <span>
                                <input disabled value={item.block} style={{ fontSize: 10 }} />
                              </span>
                            </div>
                            <div>
                              <span>Floor:</span>
                              <span>
                                <input disabled value={item.floor} style={{ fontSize: 10 }} />
                              </span>
                            </div>
                            <div>
                              <span>Rm/Ward:</span>
                              <span>
                                <input disabled value={item.room} style={{ fontSize: 10 }} />
                              </span>
                            </div>
                          </td>

                          <td style={{ fontSize: 10 }}>
                            <div>
                              <span>Name:</span>
                              <span>
                                <input
                                  disabled
                                  value={item.siteContactPerson}
                                  style={{ fontSize: 10 }}
                                />
                              </span>
                            </div>
                            <div>
                              <span>Title:</span>
                              <span>
                                <input
                                  disabled
                                  value={item.siteContactTitle}
                                  style={{ fontSize: 10 }}
                                />
                              </span>
                            </div>
                            <div>
                              <span>Phone:</span>
                              <span>
                                <input
                                  disabled
                                  value={item.siteContactPhone}
                                  style={{ fontSize: 10 }}
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

              <div className={style.notice01}>
                <p>
                  Note: if the WLAN is for access to clinical IT/IS systems, the requester has to
                  inform CIPO about the WLAN installation.
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  Addressing Radio Interference Concerns on Installing WLAN Equipment in Medical
                  Settings
                </p>
                <p style={{ lineHeight: '18px' }}>
                  The requester has to arrange and conduct interference test with appropriate
                  expertise such as EMSD to ensure that no medical equipment installed nearby is
                  being affected by the WLAN AP.
                </p>
              </div>
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
                <input type="text" disabled value={dpRequest.otherservices} />
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
                <span className={style.form01Left01}> Quotation Status: </span>
                <span className={style.form01Left02}>
                  <input value={quotationStatus} disabled />
                </span>
              </div>

              <div className={style.form01Right}>
                <span className={style.form01Left01}> Last Updated On: </span>
                <span className={style.form01Left02}>
                  <input
                    value={
                      dpRequest.lastUpdatedDate
                        ? dayjs(dpRequest?.lastUpdatedDate).format('DD-MMM-YYYY HH:mm:ss')
                        : ''
                    }
                    disabled
                  />
                </span>
              </div>
            </div>
          </div>

          <div className={style.A4} style={{ marginTop: '10px', zoom: '0.5' }}>
            <table width="100%" height="" cellSpacing="0" border="1px" name="table01">
              <thead>
                <tr>
                  <td rowSpan="2" style={{ width: '8%' }}>
                    Service Type
                  </td>
                  <td rowSpan="2" style={{ width: '8%' }}>
                    Location
                  </td>
                  <td colSpan="3" style={{ width: '10%' }}>
                    Access Point
                  </td>
                  <td colSpan="2" style={{ width: '8%' }}>
                    Controller
                  </td>
                  <td colSpan="3" style={{ width: '10%' }}>
                    Cabling
                  </td>
                  <td colSpan="2" style={{ width: '8%' }}>
                    Switch Port
                  </td>
                  <td colSpan="2" style={{ width: '8%' }}>
                    Others
                  </td>
                  <td rowSpan="2" style={{ width: '10%' }}>
                    Subtotal (HK$)
                  </td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>Qty</td>
                  <td>Unit Charge (HK$)</td>
                  <td>Qty</td>
                  <td>Unit Charge (HK$)</td>
                  <td>Conduit Type</td>
                  <td>Qty</td>
                  <td>Unit Charge (HK$)</td>
                  <td>Qty</td>
                  <td>Unit Charge (HK$)</td>
                  <td>Qty</td>
                  <td>Unit Charge (HK$)</td>
                </tr>
              </thead>
              <tbody style={{ fontSize: 18 }}>
                {Object.keys(apLocationList).length &&
                  Object.keys(apLocationList).map((key) => {
                    const item = apLocationList[key];
                    // console.log('Yancy item', item, dpRequest);
                    return (
                      <tr key={key}>
                        <td>Install new access point</td>
                        <td>
                          {item.room},/{item.floor},{item.block}
                        </td>
                        <td style={{ textAlign: 'left' }}>{item.aptype}</td>
                        <td style={{ textAlign: 'center' }}>{item.apqty}</td>
                        <td style={{ textAlign: 'right' }}> {formatterMoney(item.apcharge)}</td>

                        <td style={{ textAlign: 'center' }}>{item.controllerQty}</td>
                        <td style={{ textAlign: 'right' }}>
                          {' '}
                          {formatterMoney(item.controllerCharge)}
                        </td>

                        <td style={{ textAlign: 'left' }}>{item.conduitType}</td>
                        <td style={{ textAlign: 'center' }}>{item.conduitQty}</td>
                        <td style={{ textAlign: 'right' }}>{formatterMoney(item.conduitCharge)}</td>

                        <td style={{ textAlign: 'center' }}>{item.switchQty}</td>
                        <td style={{ textAlign: 'right' }}>{formatterMoney(item.switchCharge)}</td>

                        <td style={{ textAlign: 'center' }}>{item.boxQty}</td>
                        <td style={{ textAlign: 'right' }}>{formatterMoney(item.boxCharge)}</td>

                        <td style={{ textAlign: 'right' }}>
                          {formatterMoney(item.subTotalCharge)}
                        </td>
                      </tr>
                    );
                  })}
                <tr>
                  <td colSpan="12">Access Point of Project Based Order/Other Charges</td>
                  <td style={{ textAlign: 'center' }} colSpan="2">
                    {formatterMoney(otherTemp3)}
                  </td>
                  <td style={{ textAlign: 'right' }}>$ {formatterMoney(otherTemp3)}</td>
                </tr>
                <tr>
                  <td colSpan="14">Quotation Total($)</td>
                  <td style={{ textAlign: 'right' }}>{formatterMoney(totalPrice)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={style.A4}>
            <div style={{ fontWeight: 600, lineHeight: '25px', marginTop: '10px' }}>
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
                  <input value={dpRequest.budgetholdername} disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Title: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.budgetholdertitle} disabled />
                </span>
              </div>

              <div className={style.form01Left}>
                <span className={style.form01Left01}> Email: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.budgetholderemail} disabled />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Phone: </span>
                <span className={style.form01Left02}>
                  <input value={dpRequest.budgetholderphone} disabled />
                </span>
              </div>
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
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Maximum Cost Committed:</span>
              <span>
                <input type="text" disabled value={formatterMoney(dpRequest.fundConfirmed)} />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Payment Method:</span>
              <span>
                <input type="text" disabled value={paymentMethod} />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Chart of account:</span>
              <span>
                <input
                  type="text"
                  disabled
                  value={dpRequest.chartofaccount ? dpRequest.chartofaccount : ''}
                />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Funding Source:</span>
              <span>
                <input type="text" disabled value={dpRequest.fundparty} />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Fund Approval Status:</span>
              <span>
                <input
                  type="text"
                  disabled
                  value={
                    dpRequest.fundconfirmeddate ? `Approved on: ${dpRequest.fundconfirmeddate}` : ''
                  }
                />
              </span>
            </div>
            <div className={style.form04}>
              <span style={{ width: '35%', display: 'inline-block' }}>Fund Transfer Status:</span>
              <span>
                <input
                  style={{ fontSize: 12 }}
                  type="text"
                  disabled
                  value={
                    dpRequest.fundTransferDate && dpRequest.fundTransferDate != null
                      ? `Informed HO Finance on ${
                          dpRequest.fundTransferDate
                        } for fund transfer(final amount: ${formatterMoney(
                          dpRequest.quotationtotal
                        )})`
                      : ''
                  }
                />
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
                  <input disabled value={dpRequest.staffName ? dpRequest.staffName : ''} />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Title: </span>
                <span className={style.form01Left02}>
                  <input disabled value={dpRequest.staffTitle ? dpRequest.staffTitle : ''} />
                </span>
              </div>

              <div className={style.form01Left}>
                <span className={style.form01Left01}> Phone: </span>
                <span className={style.form01Left02}>
                  <input disabled value={dpRequest.staffPhone ? dpRequest.staffPhone : ''} />
                </span>
              </div>
              <div className={style.form01Right}>
                <span className={style.form01Left01}> Email: </span>
                <span className={style.form01Left02}>
                  <input disabled value={dpRequest.staffEmail ? dpRequest.staffEmail : ''} />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default APtemplate;
