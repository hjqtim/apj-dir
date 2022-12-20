package com.crm.crmservice.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.crm.crmservice.config.jwt.JwtConfig;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * 自动填充处理类
 **/
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override    //在执行mybatisPlus的insert()时，为我们自动给某些字段填充值，这样的话，我们就不需要手动给insert()里的实体类赋值了
    public void insertFill(MetaObject metaObject) {
        String userName = getUserName();
        if (userName == null){
            userName = "unknown";
        }
        //其中方法参数中第一个是前面自动填充所对应的字段，第二个是要自动填充的值。第三个是指定实体类的对象
        this.setFieldValByName("createdDate",new Date(), metaObject);
        this.setFieldValByName("lastUpdatedDate", new Date(), metaObject);
        try {
            this.setFieldValByName("createdBy", userName, metaObject);
            this.setFieldValByName("lastUpdatedBy", userName, metaObject);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override//在执行mybatisPlus的update()时，为我们自动给某些字段填充值，这样的话，我们就不需要手动给update()里的实体类赋值了
    public void updateFill(MetaObject metaObject) {
        String userName = getUserName();
        if (userName == null){
            try {
                Object lastUpdatedBy = this.getFieldValByName("lastUpdatedBy", metaObject);
                if (lastUpdatedBy != null) {
                    userName = lastUpdatedBy.toString();
                }else {
                    userName = "unknown";
                }
            }catch (Exception e){
                userName = "unknown";
            }
        }
        this.setFieldValByName("lastUpdatedDate", new Date(), metaObject);
        try {
            this.setFieldValByName("lastUpdatedBy", userName, metaObject);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * get login info
     * @return
     */
    public String getUserName(){
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null){
            HttpServletRequest request = attributes.getRequest();
            String token = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (token != null){
                // Username that gets the request header token
                JwtConfig jwtConfig = new JwtConfig();
                return jwtConfig.getTokenClaim(token).get("username").asString();
            }
        }
        return "System";
    }
}