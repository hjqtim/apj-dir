package com.crm.crmservice.service.email;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.config.email.DefaultMailProperties;
import com.crm.crmservice.config.email.MailSenderFactory;
import com.crm.crmservice.entity.email.EmailConfig;
import com.crm.crmservice.entity.email.EmailMsg;
import com.crm.crmservice.entity.vo.email.EmailProperties;
import com.crm.crmservice.mapper.email.EmailMsgMapper;
import com.crm.crmservice.service.impl.email.EmailConfigServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.Assert;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Abstract mail service.
 */
public abstract class AbstractMailService extends ServiceImpl<EmailMsgMapper, EmailMsg> implements EmailMsgService {
    private static final int DEFAULT_POOL_SIZE = 10;
    private static final Logger log = LoggerFactory.getLogger(AbstractMailService.class);
    protected final EmailConfigServiceImpl emailConfigService;
    private JavaMailSender cachedMailSender;
    private DefaultMailProperties cachedMailProperties;
    private String cachedFromName;
    private Map<String, EmailConfig> emailConfigMap;
    @Nullable
    private ExecutorService executorService;

    @Value("${mail.smtpPrefix}")
    private String smtpPrefix;

    protected AbstractMailService(EmailConfigServiceImpl emailConfigService) {
      this.emailConfigService = emailConfigService;
    }

    /**
     * getExecutorService.
     */
    @NonNull
    public ExecutorService getExecutorService() {
      if (this.executorService == null) {
        this.executorService = Executors.newFixedThreadPool(DEFAULT_POOL_SIZE);
      }
      return executorService;
    }

    public void setExecutorService(ExecutorService executorService) {
      this.executorService = executorService;
    }

    /**
     * Test connection with email server.
     */
    @Override
    public int testConnection() {
      log.info("连接到邮箱服务器 testConnection ... ");
      JavaMailSender javaMailSender = getMailSender();
      if (javaMailSender instanceof JavaMailSenderImpl) {
        JavaMailSenderImpl mailSender = (JavaMailSenderImpl) javaMailSender;
        try {
          mailSender.testConnection();
          Session session = mailSender.getSession();
          session.setDebug(true);
        } catch (MessagingException e) {
          log.info("无法连接到邮箱服务器，请检查邮箱配置.[" + e.getMessage() + "]", e);
          return 0;
        }
      }
      return 1;
    }

    /**
     * Send mail template.
     *
     * @param callback mime message callback.
     */
    protected void sendMailTemplateTest(@Nullable Callback callback) throws Exception{
      if (callback == null) {
        log.info("Callback is null, skip to send email");
        return;
      }

      // 检查是否开启邮件服务
      Boolean emailEnabled = Boolean
              .valueOf(getMailMapConfig().get(EmailProperties.ENABLED.getValue()).getConfigValue());

      if (!emailEnabled) {
        // If disabled
        log.info(
                "Email has been disabled by yourself,"
                        + " you can re-enable it through email settings on admin page.");
        return;
      }

      // get mail sender
      JavaMailSender mailSender = getMailSender();
      printMailConfig();
  //    try {
      // create mime message helper
      log.info("MimeMessageHelper messageHelper = new MimeMessageHelper(mailSender.createMimeMessage(), true); ... ");
      MimeMessageHelper messageHelper = new MimeMessageHelper(mailSender.createMimeMessage(), true);
      // set from-name
      InternetAddress fromAddress = getFromAddress(mailSender);
      messageHelper.setFrom(fromAddress.getPersonal());
      // handle message set separately
      callback.handle(messageHelper);

      // get mime message
      MimeMessage mimeMessage = messageHelper.getMimeMessage();
      // send email
      try{
        mailSender.send(mimeMessage);
      }catch (Exception e){
        log.error("mailSender.send(mimeMessage); error body{}... " + e);
        if (e.getMessage().indexOf("No recipient addresses") != -1){ //这里做处理是忽略某个收件邮箱地址不正确的
          log.error("忽略某个收件邮箱地址不正确的 error body{}... ");
          throw new Exception();
        }
        // log.error("email send error");
      }


      log.info("Sent an email to [{}] successfully, subject: [{}], sent date: [{}]",
              Arrays.toString(mimeMessage.getAllRecipients()),
              mimeMessage.getSubject(),
              mimeMessage.getSentDate());
  //    } catch (Exception e) {
  //      log.error(e.getMessage());
  //    }
    }

    /**
     * Send mail template if executor service is enable.
     *
     * @param callback   callback message handler
     * @param tryToAsync if the send procedure should try to asynchronous
     */
    protected void sendMailTemplate(boolean tryToAsync, @Nullable Callback callback) throws Exception {
      log.info("sendMailTemplate... " );
      ExecutorService executorService = getExecutorService();
      // 原本是这样子的，会判断是同步还是异步去执行发送邮件，现在都是同步执行
      if (tryToAsync && executorService != null) {
        // send mail asynchronously
        executorService.execute(() -> {
          try {
            sendMailTemplateTest(callback);
          } catch (Exception e) {
            log.error("sendMailTemplateTest(callback) error body{} "+e );
            e.printStackTrace();
          }
        });
      } else {
        // send mail synchronously
        log.info("else sendMailTemplateTest(callback)... " );
        sendMailTemplateTest(callback);
      }

      // 原本上面这样子的，会判断是同步还是异步去执行发送邮件，现在都是同步执行
      // sendMailTemplateTest(callback);
    }

    /**
     * Get java mail sender.
     *
     * @return java mail sender
     */
    @NonNull
    private synchronized JavaMailSender getMailSender() {
      log.info("JavaMailSender getMailSender()... " );
      if (this.cachedMailSender == null) {
        // create mail sender factory
        MailSenderFactory mailSenderFactory = new MailSenderFactory();
        // get mail sender
        this.cachedMailSender = mailSenderFactory.getMailSender(getMailProperties());
      }

      return this.cachedMailSender;
    }

    /**
     * Get from-address.
     *
     * @param javaMailSender java mail sender.
     * @return from-name internet address
     * @throws UnsupportedEncodingException throws when you give a wrong character encoding
     */
    private synchronized InternetAddress getFromAddress(@NonNull JavaMailSender javaMailSender)
            throws UnsupportedEncodingException {
      log.info("JgetFromAddress... " );
      Assert.notNull(javaMailSender, "Java mail sender must not be null");

      if (StringUtils.isBlank(this.cachedFromName)) {
        log.info("getMailMapConfig().get(EmailProperties.FROM_NAME.getValue())... " );
        // set personal name
        this.cachedFromName = getMailMapConfig().get(EmailProperties.FROM_NAME.getValue())
                .getConfigValue();
      }

      if (javaMailSender instanceof JavaMailSenderImpl) {
        log.info("javaMailSender instanceof JavaMailSenderImpl... " );
        // get user name(email)
        JavaMailSenderImpl mailSender = (JavaMailSenderImpl) javaMailSender;
        String username = mailSender.getUsername();

        // build internet address
        return new InternetAddress(username, this.cachedFromName, mailSender.getDefaultEncoding());
      }

      throw new UnsupportedOperationException(
              "Unsupported java mail sender: " + javaMailSender.getClass().getName());
    }

    /**
     * Get mail properties.
     *
     * @return mail properties
     */
    @NonNull
    protected synchronized DefaultMailProperties getMailProperties() {
      if (cachedMailProperties == null) {
        // create mail properties
        DefaultMailProperties mailProperties = new DefaultMailProperties(true);
        // set properties
        mailProperties
                .setHost(getMailMapConfig().get(EmailProperties.HOST.getValue()).getConfigValue());
        mailProperties.setPort(Integer
                .parseInt(getMailMapConfig().get(EmailProperties.SSL_PORT.getValue()).getConfigValue()));
        mailProperties.setProtocol(
                getMailMapConfig().get(EmailProperties.PROTOCOL.getValue()).getConfigValue());
        // 改动
        mailProperties.setPassword(
                getMailMapConfig().get(EmailProperties.PASSWORD.getValue()).getConfigValue());
        mailProperties.setUsername(
                getMailMapConfig().get(EmailProperties.USERNAME.getValue()).getConfigValue());


        // 这段是最重要的代码
        Map<String,String> properties = new HashMap<>();
        // 改动
        properties.put("mail.smtp.auth","true");
        properties.put("mail.smtp.starttls.enable","true");
        properties.put("mail.smtp.ssl.checkserveridentity","false");
        // 新加入测试
        properties.put("mail.smtp.ssl.trust",mailProperties.getHost());
        // 上面这段是最重要的代码
        mailProperties.setProperties(properties);
        this.cachedMailProperties = mailProperties;
      }

      return this.cachedMailProperties;
    }

    /**
     * Print mail configuration.
     */
    private void printMailConfig() {
      if (!log.isDebugEnabled()) {
        return;
      }

      // get mail properties
      MailProperties mailProperties = getMailProperties();
      log.debug(mailProperties.toString());
    }

    /**
     * Clear cached instance.
     */
    protected void clearCache() {
      this.cachedMailSender = null;
      this.cachedFromName = null;
      this.cachedMailProperties = null;
      log.debug("Cleared all mail caches");
    }

    private Map<String, EmailConfig> getMailMapConfig() {
      if (this.emailConfigMap == null) {
        this.emailConfigMap = emailConfigService.selectConfigMap("email_",smtpPrefix);
      }
      return emailConfigMap;
    }

    /**
     * Message callback.
     */
    protected interface Callback {

      /**
       * Handle message set.
       *
       * @param messageHelper mime message helper
       * @throws Exception if something goes wrong
       */
      void handle(@NonNull MimeMessageHelper messageHelper) throws Exception;
    }
}