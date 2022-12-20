import React from 'react';

const content = (
  <article style={{ fontFamily: 'Arial', fontSize: '11px' }}>
    <p style={{ fontSize: '14px' }}>
      <b>
        Declaration on IT Security, Confidentiality and Copyrights
        <br />
      </b>
    </p>
    <p>
      1.&nbsp;&nbsp;&nbsp;&nbsp;The user account information such as username and/or password cannot
      be shared with others.
    </p>
    <p>
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      2.&nbsp;&nbsp;&nbsp;&nbsp;User password/PIN must be kept confidential. User without token must
      change the password every 6 months. If the user password is not changed within 6 months, the
      user account may be disabled and then removed after another 1 month. To change password,
      please visit web page{' '}
      <a href="http://admin.ha.org.hk/password" target="_blank" rel="noreferrer">
        http://admin.ha.org.hk/password
      </a>
    </p>
    <p>
      3.&nbsp;&nbsp;&nbsp;&nbsp;Inform HOIT to remove/change the IBRA account or account profile
      upon resignation or change of job functions.
    </p>
    <p>
      4.&nbsp;&nbsp;&nbsp;&nbsp;HOIT may remove inactive IBRA account for longer than 3 months
      without prior notice.
    </p>
    <p>
      5.&nbsp;&nbsp;&nbsp;&nbsp;Not to use the IBRA service to upload, download, post, email,
      transmit any content and/or initiate activities that are unlawful, offensive, harassing,
      fraudulent, obscene, harmful, threatening, defamatory, vulgar and/or invasive of another’s
      privacy.
    </p>
    <p>
      6.&nbsp;&nbsp;&nbsp;&nbsp;The user must not use the IBRA account for unauthorized transmission
      of the HA proprietary information and software and unauthorized commercial use.
    </p>
    <p>
      7.&nbsp;&nbsp;&nbsp;&nbsp;Anti-virus program must be installed and running with updated virus
      definitions. (Please contact Hospital IT or HOIT for details.)
    </p>
    <p>
      8.&nbsp;&nbsp;&nbsp;&nbsp;Not to connect to other Internet site and/or network while IBRA
      connection to HA is active.
    </p>
    <p>
      9.&nbsp;&nbsp;&nbsp;&nbsp;All copyrights and licensing requirements of any downloaded and
      transmitted data or program must be strictly adhered to.
    </p>
    <p>
      10.&nbsp;&nbsp;&nbsp;&nbsp;Hospital Authority reserves the rights to monitor, disconnect
      and/or to terminate the user service without prior notice. The IBRA access logs collected for
      monitoring the user service are solely used for the purpose of enforcement of the acceptable
      use of VPN service as stipulated in the ITD circular no. 1/01, user authentication and
      authorization, virus, security, usage and performance analysis and trouble-shooting problems.
      The information collected may be passed to management for review and periodic and random
      reviews may be conducted.
    </p>
    <p>
      11.&nbsp;&nbsp;&nbsp;&nbsp;HA staff may face disciplinary action or criminal prosecution for
      any breach of the confidentially principle.
    </p>
  </article>
);

export default {
  title: 'IBRA Account Application',
  content
};
