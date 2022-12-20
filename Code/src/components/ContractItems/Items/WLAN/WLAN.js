import React from 'react';

const content = (
  <article style={{ fontFamily: 'Arial', fontSize: '11px' }}>
    <p>1.&nbsp;&nbsp;&nbsp;&nbsp;The user account cannot be shared with others.</p>
    <p>
      2.&nbsp;&nbsp;&nbsp;&nbsp;Inform ITS to remove the ID upon resignation or change of job
      function.
    </p>
    <p>3.&nbsp;&nbsp;&nbsp;&nbsp;User password must be kept confidential.</p>
    <p>
      4.&nbsp;&nbsp;&nbsp;&nbsp;Any HA related information retrieved from the wireless connection
      should be considered to be strictly confidential. The information must not be used for any
      unauthorized purpose and/or disclosed to any unauthorized person within or outside the HA.
      Staff is required to take due care of confidential information at all times. The users of the
      wireless account are held accountable for any consequences due to the leakage of the
      information.
    </p>
    <p>
      5.&nbsp;&nbsp;&nbsp;&nbsp;Anti-virus program must be installed and running with updated virus
      definitions. (Please contact Hospital IT or HOIT for details.)
    </p>
    <p>
      6.&nbsp;&nbsp;&nbsp;&nbsp;Disk encryption program must be installed and all harddisks must be
      fully encrypted (Please contact Hospital IT or HOIT for details)
    </p>
    <p>
      7.&nbsp;&nbsp;&nbsp;&nbsp;The user must not use the account for unauthorized transmission of
      HA proprietary information and software, and unauthorized commercial use.
    </p>
    <p>
      8.&nbsp;&nbsp;&nbsp;&nbsp;All copyright and licensing requirements of any downloaded and
      transmitted data or program must be strictly adhered to.
    </p>
    <p>
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      9.&nbsp;&nbsp;&nbsp;&nbsp;When using the wireless connection to the HA network, it must not be
      used concurrently with any other network connection. (Please contact N1/NMS via email{' '}
      <a href="mailto:n1.support@ha.org.hk" target="_blank" rel="noreferrer">
        <u style={{ color: '#0563c1' }}>n1.support@ha.org.hk</u>
      </a>
      for details.)
    </p>
    <p>
      10.&nbsp;&nbsp;&nbsp;&nbsp;Hospital Authority reserves the rights to monitor, to disconnect,
      and/or to terminate the user service without prior notice.
    </p>
    <p>
      11.&nbsp;&nbsp;&nbsp;&nbsp;Hospital staff may face disciplinary action or criminal prosecution
      for any breach of the confidentiality principle.
    </p>
    <p>
      12.&nbsp;&nbsp;&nbsp;&nbsp;Client PC security guidelines must be followed when connected to HA
      network. (Please refer to Security Guidelines for Client PC)
    </p>
    <p>
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      13.&nbsp;&nbsp;&nbsp;&nbsp;Staff owned PCs would NOT be allowed to connect to the HA corporate
      network, unless the colleague chooses to submit his own PC to be managed by hospital ITs in
      the same way as a standard corporate PC. (Please refer to
      <a href="http://ha.home/ho/ecp/ecp-intro.htm" target="_blank" rel="noreferrer">
        <u style={{ color: '#0563c1' }}>Electronic Communications Policy</u>
      </a>
      )
    </p>
    <p>
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      14.&nbsp;&nbsp;&nbsp;&nbsp;If you have any enquiries about WLAN services, please feel free to
      contact our Call Centre at 2515 2653 or email to{' '}
      <a href="mailto:hoitcallcentre@pyn.ha.org.hk" target="_blank" rel="noreferrer">
        <u style={{ color: '#0563c1' }}>hoitcallcentre@pyn.ha.org.hk</u>
      </a>
    </p>
  </article>
);

export default {
  title: 'Wireless LAN (WLAN) Application',
  content
};
