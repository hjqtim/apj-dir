package com.crm.crmservice.config.email;

import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import java.util.Properties;

/**
 * Java mail sender factory.
 */
public class MailSenderFactory {

  /**
   * Get mail sender.
   *
   * @param mailProperties mail properties must not be null
   * @return java mail sender
   */
  @NonNull
  public JavaMailSender getMailSender(@NonNull DefaultMailProperties mailProperties) {
    Assert.notNull(mailProperties, "Mail properties must not be null");

    // create mail sender
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    // set properties
    setProperties(mailSender, mailProperties);

    return mailSender;
  }

  private void setProperties(@NonNull JavaMailSenderImpl mailSender,
      @NonNull DefaultMailProperties mailProperties) {
    mailSender.setHost(mailProperties.getHost());
    mailSender.setPort(mailProperties.getPort());
    // 改动
    mailSender.setUsername(mailProperties.getUsername());
    mailSender.setPassword(mailProperties.getPassword());
    mailSender.setProtocol(mailProperties.getProtocol());
    mailSender.setDefaultEncoding(mailProperties.getDefaultEncoding().name());

    if (!CollectionUtils.isEmpty(mailProperties.getProperties())) {
      Properties properties = new Properties();
      properties.putAll(mailProperties.getProperties());
      mailSender.setJavaMailProperties(properties);
    }
  }
}