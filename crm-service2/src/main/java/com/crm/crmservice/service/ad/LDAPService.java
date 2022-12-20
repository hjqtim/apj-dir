/**
 *
 * @version 1.0
 * @author lidi
 * @date 2021-6-29 13:45
 */
package com.crm.crmservice.service.ad;

import com.crm.crmservice.entity.ad.User;
import com.crm.crmservice.utils.ADUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.NamingException;
import javax.naming.ldap.LdapContext;
import java.util.Hashtable;
import java.util.List;

public class LDAPService {

    private static final Logger log = LoggerFactory.getLogger(LDAPService.class);
    Hashtable<String, String> env;

    public LDAPService(Hashtable<String, String> env) {
        this.env = env;
    }

    public User getAdUser(String name,String adBase) {
        LdapContext ctx = null;
        User user = null;
        try {
            ctx = ADUtils.getContext(env);
            String searchFilter = "(&(objectClass=person)(name=" + name + "))";
            //String searchFilter = "(&(objectClass=person)(|(sAMAccountName=" + name + ")(displayName=" + name + ")))";
            List<User> users = ADUtils.getUsers(ctx, searchFilter,adBase);
            if (users.size() == 1) {
                user = users.get(0);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        } finally {
            if (ctx != null) {
                try {
                    ctx.close();
                } catch (NamingException namingException) {
                    namingException.printStackTrace();
                }
            }
        }
        return user;
    }

    /**
     * 查询所有用户
     */
    public List<User> getLikeUserInfo(String displayName,String adBase) {
        LdapContext ctx;
        List<User> users = null;
        try {
            ctx = ADUtils.getContext(env);
            String searchFilter = "(&(objectClass=person)(displayName=*" + displayName + "*))";
            users = ADUtils.getUsers(ctx,searchFilter,adBase);
            ctx.close();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return users;
    }


}
