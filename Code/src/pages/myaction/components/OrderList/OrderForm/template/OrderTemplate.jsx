import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import style from './OrderTemplate.module.css';
import { formatterMoney } from '../../../../../../utils/tools';

function setPageSize(cssPageSize) {
  const style = document.createElement('style');
  style.innerHTML = `@page {size: ${cssPageSize}}`;
  style.id = 'page-orientation';
  document.head.appendChild(style);
}

function OrderTemplate({
  acquisitionItem,
  institutio,
  project,
  currentContract,
  fromStaff,
  reqNo
}) {
  const user = useSelector((state) => state.userReducer?.currentUser) || {};

  useEffect(() => {
    // 横屏样式
    setPageSize('landscape');
    return () => {
      const child = document.getElementById('page-orientation');
      child.parentNode.removeChild(child);
    };
  }, []);
  let total = 0;
  if (acquisitionItem)
    total = acquisitionItem.reduce((prev, cur) => cur.unitPrice * cur.qty + prev, 0);

  // 头部的From字符
  const fromStr = () => {
    let team = [];
    if (user) {
      const regex = /\((.+?)\)/;
      team = user?.displayName?.match(regex);
    }
    // 去掉括号中的内容
    const regex2 = /\(.*\)/;
    const newDisplayName = user?.displayName?.replace(regex2, '');
    const displayNameArr = newDisplayName?.split(' ');
    let str = '';
    if (team) {
      str += `${team[1]} Team, `;
    }
    str += `${user?.department}, `;
    if (displayNameArr) {
      str += `${displayNameArr[displayNameArr?.length - 1]}  `;
    }
    return str || '';
  };
  return (
    <>
      <div id="orderTemplate" className={style.formStart}>
        <div className={style.formTitle}>
          <div className={style.formTitleRow}>
            <div>
              <span>To:</span>
              <span>{currentContract?.vendorFullName || ''}</span>
            </div>
            <div className={style.formTitleRowRight}>
              <span>From:</span>
              <span>{fromStr()}</span>
            </div>
          </div>

          <div className={style.formTitleRow}>
            <div>
              <span>Attn:</span>
              <span>{currentContract?.vendorCoordinator || ''}</span>
            </div>
            <div className={style.formTitleRowRight}>
              <span>Requester:</span>
              <span>{fromStaff?.displayName || ''}</span>
            </div>
          </div>

          <div className={style.formTitleRow}>
            <div>
              <span>Fax:</span>
              <span>{currentContract?.vendorFax || ''}</span>
            </div>
            <div className={style.formTitleRowRight}>
              <span>Tel:</span>
              <span>{fromStaff?.phone || ''}</span>
            </div>
          </div>

          <div className={style.formTitleRow}>
            <div>
              <span>Date:</span>
              <span>{dayjs(new Date()).format('DD-MMM-YYYY')}</span>
            </div>
            <div className={style.formTitleRowRight}>
              {/* <span>Fax:</span>
              <span>{fromStaff?.staffTelNo||''}</span> */}
            </div>
          </div>
        </div>

        <div className={style.A4}>
          <p className={style.fontBar} />
        </div>

        <div className={style.A4}>
          <div className={style.formTableTitle}>
            <div style={{ borderBottom: '2px solid #000', fontWeight: 700, width: '350px' }}>
              Acquisition List for Equipment(Contract No.:{currentContract?.contract || ''} )
            </div>
          </div>
        </div>

        <div className={style.formTitleRow}>
          <div>
            <span>Our Ref.:</span>
            <span>{reqNo || ''}</span>
          </div>
        </div>
        <div className={style.formTitleRow}>
          <div>
            <span>Institution.:</span>
            <span>{institutio || ''}</span>
          </div>
        </div>
        <div className={style.formTitleRow}>
          <div>
            <span>Project:</span>
            <span>{project || ''}</span>
          </div>
        </div>

        {acquisitionItem && (
          <div className={style.A4} style={{ marginTop: '10px', zoom: '0.83' }}>
            {/* <div style={{ height: '200px', display: 'block' }} /> */}
            <table
              width="120%"
              cellSpacing="0"
              border="1px"
              name="table02"
              style={{ borderBottom: 0, borderLeft: 0 }}
            >
              <thead>
                <tr>
                  <td style={{ borderLeft: '1px solid #000' }}>Item No.</td>
                  <td colSpan={8}>Description</td>
                  <td>Unit</td>
                  <td style={{ textAlign: 'right' }}>Unit Price</td>
                  <td>Est. Qty</td>
                  <td style={{ textAlign: 'right' }}>Total(Hk$)</td>
                </tr>
              </thead>
              <tbody>
                {acquisitionItem.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: '200px', borderLeft: '1px solid #000' }}>
                      {item.partNo || ''}
                    </td>
                    <td colSpan={8}>{item.description || ''}</td>
                    <td style={{ textAlign: 'left', width: '100px' }}>{item.unit || ''}</td>
                    <td style={{ textAlign: 'right', width: '100px' }}>
                      {formatterMoney(item?.unitPrice)}
                    </td>
                    <td style={{ textAlign: 'left', width: '100px' }}>{item.qty || ''}</td>
                    <td style={{ textAlign: 'right', width: '100px' }}>
                      {formatterMoney(Number(item.unitPrice * item.qty).toFixed(2))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{ borderBottom: 0 }}>
                <tr colSpan={10} style={{ borderLeft: 0, borderBottom: 0 }}>
                  <td colSpan={10} style={{ borderLeft: 0, borderBottom: 0 }}>
                    {' '}
                  </td>
                  <td colSpan={2} style={{ borderBottom: '1px solid #000', textAlign: 'right' }}>
                    Grand Total(Hk$)
                  </td>
                  <td
                    style={{ textAlign: 'right', width: '100px', borderBottom: '1px solid #000' }}
                  >
                    {formatterMoney(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderTemplate;
