import React from 'react';
import { Grid } from '@material-ui/core';
// import { L } from '../../../../../utils/lang';
import CommonDialog from '../../../../../components/CommonDialog';

export default function Detail(props) {
  const { open, setOpen, actionRow, setActionRow } = props;

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setActionRow({});
    }, 200);
  };

  const getP = (stringValue) => {
    let objValue = {};
    let PList = [];
    try {
      objValue = JSON.parse(stringValue);
      PList = JSON.stringify(objValue, null, 4).split('\n');
    } catch (error) {
      console.log('logging error');
      console.log(error);
    }
    return (
      <>
        {PList &&
          PList.map((el, i) => (
            <pre
              style={{
                fontFamily: 'Arial',
                fontSize: '14px',
                wordBreak: 'break-all'
              }}
              key={i}
            >
              {el}
            </pre>
          ))}
      </>
    );
  };

  const content = (
    <div style={{ padding: '30px 50px' }}>
      <Grid container spacing={4} style={{ fontSize: '16px' }}>
        <article style={{ fontFamily: 'Arial', fontSize: '14px', width: '100%' }}>
          <p style={{ fontSize: '16px' }}>
            <b>Request</b>
          </p>
          {actionRow.operRequParam && getP(actionRow.operRequParam)}
          <hr />
          <p style={{ fontSize: '16px' }}>
            <b>Response</b>
          </p>
          {actionRow.operRespParam && getP(actionRow.operRespParam)}
        </article>
      </Grid>
    </div>
  );

  return (
    <div>
      <CommonDialog
        title="Detail"
        content={content}
        open={open}
        isHideSubmit
        maxWidth="md"
        handleClose={handleClose}
        isClickClose
      />
    </div>
  );
}
