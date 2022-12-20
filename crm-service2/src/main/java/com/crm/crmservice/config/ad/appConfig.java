/**
 *
 * @version 1.0
 * @author lidi
 * @date 2021-6-29 13:44
 */
package com.crm.crmservice.config.ad;

import com.crm.crmservice.service.ad.LDAPService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.naming.Context;
import java.util.Hashtable;

@Configuration
public class appConfig {
    private static final Logger log = LoggerFactory.getLogger(appConfig.class);

    @Value("${ad.loginUser}")
    private String loginUser;
    @Value("${ad.loginPassword}")
    private String password;
    @Value("${ad.url}")
    private String url;

    @Bean
    public LDAPService getLdapService() {
        Hashtable<String, String> env = new Hashtable<>();
        String ldapURL = url;//ip:port
        env.put(Context.INITIAL_CONTEXT_FACTORY,"com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.SECURITY_AUTHENTICATION, "simple");//LDAP访问安全级别："none","simple","strong"
        env.put(Context.SECURITY_PRINCIPAL, loginUser);// AD User
        env.put(Context.SECURITY_CREDENTIALS, password);// AD Password
        env.put(Context.PROVIDER_URL, ldapURL);// LDAP工厂类
        env.put("com.sun.jndi.ldap.connect.timeout", "3000");//连接超时设置为3秒
        env.put("java.naming.ldap.attributes.binary", "objectSid");
        return new LDAPService(env);
    }
}

