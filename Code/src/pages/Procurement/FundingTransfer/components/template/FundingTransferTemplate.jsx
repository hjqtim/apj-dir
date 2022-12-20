import dayjs from 'dayjs';

import React, { memo } from 'react';
import style from './FundingTransferTemplate.module.css';
import { formatterMoney, countTotal } from '../../../../../utils/tools';

/**
 *
 * @param {*} selected datas
 * @returns
 */

function FundingTransferTemplate({ isShowIssueBill, selected }) {
  // const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const txCode = selected?.[0]?.txCode || '';
  return (
    <>
      <img src="/static/img/print/FundTransfer.png" alt="" style={{ width: '210mm' }} />
      <div id="orderTemplate" className={style.page}>
        <div className={style.pageHeader}>
          <div className={style.pageHeaderRow}>
            <div>
              <span>From</span>
              <span>:&nbsp;SM(N)3, IT&HID</span>
            </div>
            <div className={style.pageHeaderRowRight}>
              <span>To</span>
              <span>:&nbsp;Corp FMII(AS), FD</span>
            </div>
          </div>

          <div className={style.pageHeaderRow}>
            <div>
              <span>Tel</span>
              <span>:&nbsp;3542 6499</span>
            </div>
            <div className={style.pageHeaderRowRight} />
          </div>

          <div className={style.pageHeaderRow}>
            <div>
              <span>Ref</span>
              <span>: {txCode || ''}</span>
            </div>
            <div className={style.pageHeaderRowRight} />
          </div>

          <div className={style.pageHeaderRow} style={{ borderBottom: '#999 3px solid ' }}>
            <div>
              <span>Date</span>
              <span>:&nbsp;{dayjs(new Date()).format('YYYY-MMM-DD')}</span>
            </div>
            <div className={style.pageHeaderRowRight} />
          </div>
        </div>
        <br />
        {isShowIssueBill ? (
          <IssueBillTemplate data={selected?.[0] || {}} />
        ) : (
          <FundingTransferTemplates selected={selected} />
        )}
      </div>
    </>
  );
}

const FundingTransferTemplates = ({ selected }) => {
  const total = countTotal(selected, 'totalIncome');
  return (
    <div className={style.pageBody}>
      <div className={style.pageBodyHeader}>
        <div>Funding Transfer</div>
      </div>
      <h3 className={style.pageBodyHeader2}>
        I refer to Fund Confirmation of the attached Data Port Installation Request Forms.
      </h3>

      <h3>
        2. Please transfer the respective amount to the COA 803.01.486222.8307053.00.28047 in{' '}
        {dayjs(new Date()).format('MM-YYYY')} for the data ports and cabling services. Details are
        as follows: -
      </h3>

      <div className={`${style.pageBodyRow} ${style.talbeFontSize}`}>
        <table width="100%" cellSpacing="0">
          <thead>
            <tr>
              <td className={style.tdTop}>Item</td>
              <td className={style.tdTop}>DP_REQ</td>
              <td className={style.tdTop}>Institution</td>
              <td className={style.tdTop}>Project</td>
              <td className={style.tdTop}>Fund Party</td>
              <td className={style.tdTop}>Chart of Account</td>
              <td
                style={{
                  textAlign: 'right',
                  width: '100px',
                  borderRight: '#ccc 1px solid',
                  borderLeft: 0
                }}
                className={style.tdTop}
              >
                Total Income
              </td>
            </tr>
          </thead>

          <tbody>
            {selected?.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item?.dpReq || ''}</td>
                <td>{item?.hospital || ''}</td>
                <td>{item?.project || ''}</td>
                <td>{item?.fundParty || ''}</td>
                <td>{item?.costCode || ''}</td>
                <td
                  style={{
                    textAlign: 'right',
                    width: '100px',
                    borderRight: '#ccc 1px solid',
                    borderLeft: 0
                  }}
                >
                  {formatterMoney(item?.totalIncome || '')}
                </td>
              </tr>
            ))}
            <tr style={{ borderLeft: 0, borderBottom: 0 }}>
              <td colSpan={4} style={{ borderLeft: 0, borderBottom: 0 }} />
              <td style={{ textAlign: 'right', width: '100px', border: 'none' }} />
              <td
                style={{
                  border: '1px solid #000',
                  textAlign: 'right',
                  paddingRight: '10px',
                  borderRight: 0
                }}
              >
                Grand Total
              </td>
              <td style={{ textAlign: 'right', width: '100px', border: '1px solid #000' }}>
                {formatterMoney(total) || ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <div className={style.pageBodyText}>
        <br />
        <h3>3. Should you have any enquiry, please contact N3 Team.</h3>
        <br />
        <h3>4. Thank you for your arrangement.</h3>
      </div>
      <div className={style.pageBodyFooter}>
        <div />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h2>Berry LAU</h2>
          <h2>SM(N)3</h2>
        </div>
      </div>
    </div>
  );
};

const IssueBillTemplate = ({ data }) => (
  <div className={style.pageBody}>
    <div className={style.pageBodyHeader}>
      <div>Issue of Bill</div>
    </div>
    <h3 className={style.pageBodyHeader2}>
      Please assist to issue a bill to {data?.extBillCompanyName || ''}. Details are as follows: -
    </h3>
    <br />
    <>
      <div className={style.pageBodyRow}>
        <div className={style.pageBodyRowCenter}>
          <span className={style.pageBodyRowFirst}>Company Name</span>
          <span>:&nbsp;&nbsp;&nbsp;</span>
          <span className={style.pageBodyRowLast}>{data?.extBillCompanyName || ''}</span>
        </div>
      </div>

      <div className={style.pageBodyRow}>
        <div className={style.pageBodyRowCenter}>
          <span className={style.pageBodyRowFirst}>Company Address</span>
          <span>:&nbsp;&nbsp;&nbsp;</span>
          <span className={style.pageBodyRowLast}>{data?.extBillCompanyAdd || ''}</span>
        </div>
      </div>

      <div className={style.pageBodyRow}>
        <div className={style.pageBodyRowCenter}>
          <span className={style.pageBodyRowFirst}>Contact Person </span>
          <span>:&nbsp;&nbsp;&nbsp;</span>
          <span className={style.pageBodyRowLast}>{data?.extBillContactName || ''}</span>
        </div>
      </div>

      <div className={style.pageBodyRow}>
        <div className={style.pageBodyRowCenter}>
          <span className={style.pageBodyRowFirst}>Contact Number</span>
          <span>:&nbsp;&nbsp;&nbsp;</span>
          <span className={style.pageBodyRowLast}>{data?.extBillContactPhone || ''}</span>
        </div>
      </div>

      <div className={style.pageBodyRow}>
        <div className={style.pageBodyRowCenter}>
          <span className={style.pageBodyRowFirst}>Amount</span>
          <span>:&nbsp;&nbsp;&nbsp;</span>
          <span className={style.pageBodyRowLast}>
            HK {formatterMoney(data?.totalIncome) || ''}{' '}
          </span>
        </div>
      </div>
      <div className={style.pageBodyRow}>
        <div
          className={style.pageBodyRowCenter}
          style={{ display: 'flex', borderBottom: '#ccc 1px solid ' }}
        >
          <div style={{ display: 'flex' }}>
            <span className={style.pageBodyRowFirst}>Reason for billing</span>
            <span>:&nbsp;&nbsp;&nbsp;</span>
          </div>
          <div className={style.pageBodyRowLast}>
            Cost for {data?.appType === 'DP' ? 'data port' : 'WLAN access point'} installation at{' '}
            {data?.hospital || ''}
            {data?.dpReq ? `(${data?.dpReq})` : ''}
          </div>
        </div>
      </div>
    </>
    <br />
    <div className={style.pageBodyText}>
      <h3>2. Please credit the amount to the COA 803.01.486222.8307053.00.28047.</h3>
      <br />
      <h3>3. Should you have any enquiry, please contact N3 Team.</h3>
      <br />
      <h3>4. Thank you for your arrangement.</h3>
    </div>
    <div className={style.pageBodyFooter}>
      <div />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2>Berry LAU</h2>
        <h2>SM(N)3</h2>
      </div>
    </div>
  </div>
);

export default memo(FundingTransferTemplate);
