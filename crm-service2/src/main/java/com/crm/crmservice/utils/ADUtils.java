package com.crm.crmservice.utils;


import com.crm.crmservice.entity.ad.AdDepartment;
import com.crm.crmservice.entity.ad.User;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

/**
 * @ClassName ADUtils
 */
public class ADUtils {


    private ADUtils() {
    }

    private static final Logger _logger = LoggerFactory.getLogger(ADUtils.class);

    // 连接ad域
    public static LdapContext getContext(Hashtable<String, String> hashtable) throws NamingException {
        return new InitialLdapContext(hashtable, null);
    }


    public static NamingEnumeration<SearchResult> getSearchResult(LdapContext ctx, String searchFilter, String searchBase) throws NamingException {
        //搜索控制器
        SearchControls searchCtls = new SearchControls();
        //创建搜索控制器
        searchCtls.setSearchScope(SearchControls.SUBTREE_SCOPE);
        String[] returnedAtts = {"cn","mail","objectSid", "displayName", "description","givenName",
                "name", "sAMAccountName","userPrincipalName","company","department","initials","sn","telephoneNumber","title"}; // 定制返回属性
        searchCtls.setReturningAttributes(returnedAtts);
        return ctx.search(searchBase, searchFilter, searchCtls);
    }

    private static Hashtable<String, String> getEnv(String userName, String password,String adRul) throws NamingException {
        Hashtable<String, String> env = new Hashtable<>();
        //String ldapURL = "LDAP://160.80.38.54:3268";//ip:port
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.SECURITY_AUTHENTICATION, "simple");//LDAP访问安全级别："none","simple","strong"
        env.put(Context.SECURITY_PRINCIPAL, userName+"@corpdev.hadev.org.hk");// AD User  加上 @corpdev.hadev.org.hk 才可以指向 sAMAccountName
        env.put(Context.SECURITY_CREDENTIALS, password);// AD Password
        env.put(Context.PROVIDER_URL, adRul);// LDAP工厂类
        env.put("com.sun.jndi.ldap.connect.timeout", "3000");//连接超时设置为3秒
        env.put("java.naming.ldap.attributes.binary", "objectSid");
        return env;
    }

    /**
     * 登录
     * @param userName 用户名
     * @param password 密码
     * @param encrypt true|false -> password加密|未加密
     * @return
     */
    public static boolean login(String userName, String password, boolean encrypt,String adRul) {
        if (StringUtils.isEmpty(userName) || StringUtils.isEmpty(password)){
            return false;
        }
        LdapContext ldapContext = null;
        try {
            String encryptPassword = encrypt ? EncryptUtils.rsaDecrypt(password, EncryptUtils.RSA_PRIVATE_KEY) : password;
            ldapContext = new InitialLdapContext(getEnv(userName, encryptPassword,adRul), null);
            return true;
        } catch (Exception exception) {
            return false;
        } finally {
            if (ldapContext != null){
                try {
                    ldapContext.close();
                } catch (NamingException e) {
                    //return false;
                }
            }
        }
    }

    public static List<User> getUsers(LdapContext ctx, String searchFilter,String adBase) throws NamingException {
        //LDAP搜索过滤器类，此处只获取AD域用户，所以条件为用户user或者person均可
        //AD域节点结构
        //String searchBase = "DC=corpdev,DC=hadev,DC=org,DC=hk";
        NamingEnumeration<SearchResult> answer = getSearchResult(ctx, searchFilter, adBase);
        List<User> users = new ArrayList<>();
        while (answer.hasMoreElements()) {
            SearchResult sr = answer.next();
            User u = new User();
            u.setCn(getAttrValue(sr, "cn"));
            u.setObjectSid(getObjectSid(sr.getAttributes()));
            u.setDisplayName(getAttrValue(sr, "displayName"));
            u.setGivenName(getAttrValue(sr, "givenName"));
            u.setDescription(getAttrValue(sr, "description"));
            u.setMail(getAttrValue(sr, "mail"));
            u.setName(getAttrValue(sr, "name"));
            u.setCompany(getAttrValue(sr, "company"));
            u.setDepartment(getAttrValue(sr, "department"));
            u.setInitials(getAttrValue(sr, "initials"));
            u.setSn(getAttrValue(sr, "sn"));
            u.setTelephoneNumber(getAttrValue(sr, "telephoneNumber"));
            u.setTitle(getAttrValue(sr, "title"));
            u.setSAMAccountName(getAttrValue(sr, "sAMAccountName"));
            u.setUserPrincipalName(getAttrValue(sr, "userPrincipalName"));
            users.add(u);
        }
        return users;
    }




    //获取AD 里objectSid
    private static String getObjectSid(Attributes attrs) throws NamingException {
        if (attrs.get("objectSid") != null) {
            Object object = attrs.get("objectSid").get();
            byte[] SID = (byte[]) object;
            // byte[] SID = object.toString().getBytes();//不可以用这种转换类型，有损耗
            StringBuilder strSID = new StringBuilder("S-");
            strSID.append(SID[0]).append('-');
            // bytes[2..7] :
            StringBuilder tmpBuff = new StringBuilder();
            for (int t = 2; t <= 7; t++) {
                String hexString = Integer.toHexString(SID[t] & 0xFF);
                tmpBuff.append(hexString);
            }
            strSID.append(Long.parseLong(tmpBuff.toString(), 16));
            // bytes[1] : the sub authorities count
            int count = SID[1];
            // bytes[8..end] : the sub authorities (these are Integers - notice
            // the endian)
            for (int i = 0; i < count; i++) {
                int currSubAuthOffset = i * 4;
                tmpBuff.setLength(0);
                tmpBuff.append(String.format("%02X%02X%02X%02X",
                        (SID[11 + currSubAuthOffset] & 0xFF),
                        (SID[10 + currSubAuthOffset] & 0xFF),
                        (SID[9 + currSubAuthOffset] & 0xFF),
                        (SID[8 + currSubAuthOffset] & 0xFF)));
                strSID.append('-').append(
                        Long.parseLong(tmpBuff.toString(), 16));

            }
            return strSID.toString();
        }
        return null;
    }

    private static List<AdDepartment> creatChild(String name, List<AdDepartment> child) {
        //如果已经存在
        AdDepartment dir;
        for (AdDepartment dirEle : child) {
            if (dirEle.getName().equals(name)) {
                return dirEle.getChild();
            }
        }

        dir = new AdDepartment(null, name);

        child.add(dir);
        return dir.getChild();
    }

    private static List<AdDepartment> creatChild(String objectSid, String name, List<AdDepartment> child,
                                                 String eqName, String isManager, String userId) {
        //如果已经存在
        AdDepartment dir;
        for (AdDepartment dirEle : child) {
            if (dirEle.getName().equals(name)) {
                return dirEle.getChild();
            }
        }
        if (StringUtils.equals(name, eqName)) {
            dir = new AdDepartment(objectSid, name, isManager, userId);
        } else {
            dir = new AdDepartment(null, name);
        }
        child.add(dir);
        return dir.getChild();
    }


    private static String getAttrValue(SearchResult sr, String attr) throws NamingException {
        Attributes Attrs = sr.getAttributes();
        if (Attrs.get(attr) == null) {
            return null;
        }
        return Attrs.get(attr).getAll().next().toString();
    }

}