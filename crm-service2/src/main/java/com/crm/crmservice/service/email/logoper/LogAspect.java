package com.crm.crmservice.service.email.logoper;


import com.alibaba.fastjson.JSON;
import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.entity.email.EmailLog;
import com.crm.crmservice.entity.param.email.EmailMsgQueryParam;
import com.crm.crmservice.service.email.EmailLogService;
import com.crm.crmservice.utils.email.ip.IpUtils;
import com.crm.crmservice.utils.email.ip.ServletUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Date;

/**
 * 系统日志：切面处理类
 */
@Aspect
@Component
public class LogAspect {

    @Resource
    private EmailLogService logsService;

    @Resource
    private JwtConfig jwtConfig;

    //定义切点 @Pointcut
    //在注解的位置切入代码
    @Pointcut("@annotation( com.crm.crmservice.service.email.logoper.MyLog)")
    public void logPoinCut() {
    }

    //切面 配置通知
    @AfterReturning("logPoinCut()")
    public void saveSysLog(JoinPoint joinPoint) {
        //保存日志

        EmailLog sysLog = new EmailLog();

        //从切面织入点处通过反射机制获取织入点处的方法
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        //获取切入点所在的方法
        Method method = signature.getMethod();

        //获取操作
        MyLog myLog = method.getAnnotation(MyLog.class);
        if (myLog != null) {
            String value = myLog.value();
            sysLog.setOperation(value);//保存获取的操作
        }

        //获取请求的类名
        String className = joinPoint.getTarget().getClass().getName();
        //获取请求的方法名
        String methodName = method.getName();
        sysLog.setMethod(className + "." + methodName);

        //请求的参数
        Object[] args = joinPoint.getArgs();
        //将参数所在的数组转换成json
        String params = JSON.toJSONString(args);
        sysLog.setParam(params);

        sysLog.setCreatedDate(new Date());
        String userName = null;
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null){
            HttpServletRequest request = attributes.getRequest();
            String token = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (token != null){
                userName = jwtConfig.getTokenClaim(token).get("username").asString();
            }
        }
        sysLog.setUsername(userName);
        //获取用户ip地址
        String ip = IpUtils.getIpAddr(ServletUtils.getRequest());
        sysLog.setIp(ip);

        //调用service保存SysLog实体类到数据库
//        if (user != null){
//            logsService.save(sysLog);
//        }

        logsService.save(sysLog);

    }
}
