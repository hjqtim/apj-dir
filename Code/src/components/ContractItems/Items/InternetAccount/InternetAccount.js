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
      1.&nbsp;&nbsp;&nbsp;&nbsp;Not to share the Internet account with others and/or disclose the
      account password to others.
    </p>
    <p>
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      2.&nbsp;&nbsp;&nbsp;&nbsp;User password must be kept confidential and changed every 6 months.
      If the user password is not changed within 6 months, the user account may be disabled and then
      removed after another 1 month. To change password, please visit web page{' '}
      <a href="https://changepassword.home/inet/start" target="_blank" rel="noreferrer">
        https://changepassword.home/inet/start
      </a>
      .
    </p>
    <p>
      3.&nbsp;&nbsp;&nbsp;&nbsp;Inform ITS to remove the Internet account upon resignation or change
      of job function.
    </p>
    <p>
      4.&nbsp;&nbsp;&nbsp;&nbsp;ITS may remove inactivated user account for longer than 6 months
      without prior notice.
    </p>
    <p>
      5.&nbsp;&nbsp;&nbsp;&nbsp;Not to use the services to upload, download, post, email, transmit
      any content and/or initiate activities that is unlawful, offensive, harassing, fraudulent,
      obscene, harmful, threatening, defamatory, vulgar and/or invasive of another&aqot;s privacy.
    </p>
    <p>
      6.&nbsp;&nbsp;&nbsp;&nbsp;Not to upload or download files over 20 Mbytes during office hours
      and 100 Mbytes after office hours.
    </p>
    <p>
      7.&nbsp;&nbsp;&nbsp;&nbsp;Anti-virus program must be installed and running with updated virus
      definitions. (Contact Hospital IT or ITS for details)
    </p>
    <p>
      8.&nbsp;&nbsp;&nbsp;&nbsp;All incoming Internet Email messages including attachments are
      scanned for viruses by HA Internet Email Anti-Virus SMTP Gateways and the suspected
      virus-infected messages will be deleted without notifying the recipients nor senders. As a
      precaution against virus spreading via Internet Email messages, executable/suspected
      attachments and password protected attachments that cannot be opened and scanned for virus
      infection by HA Internet Email Anti-Virus SMTP Gateways will be deleted. Users should not open
      any unknown Email attachment.
    </p>
    <p>
      9.&nbsp;&nbsp;&nbsp;&nbsp;Not to use your Internet password for any registration on un-trusted
      website.
    </p>
    <p>
      10.&nbsp;&nbsp;&nbsp;&nbsp;The Internet account should not be used for the unauthorized
      commercial use.
    </p>
    <p>
      11.&nbsp;&nbsp;&nbsp;&nbsp;All copyrights and licensing requirements of any downloaded and
      transmitted data or program must be strictly adhered to.
    </p>
    <p>
      12.&nbsp;&nbsp;&nbsp;&nbsp;Hospital Authority reserves the rights to monitor, disconnect
      and/or to terminate the user service without prior notice. The Internet access logs collected
      for monitoring the user service are solely used for the purpose of enforcement of Electronic
      Communications Policy, security investigation, performance analysis and trouble-shooting
      problems. The information collected may be passed to management for review and periodic and
      random reviews may be conducted.
    </p>
    <p>
      13.&nbsp;&nbsp;&nbsp;&nbsp;HA staff may face disciplinary action for any breach of the
      confidentiality principle.
    </p>
  </article>
);

export default {
  title: 'Internet Account Application',
  content
};
