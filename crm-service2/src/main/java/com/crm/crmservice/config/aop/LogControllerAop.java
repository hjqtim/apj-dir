package com.crm.crmservice.config.aop;

import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.entity.OperLog;
import com.crm.crmservice.service.OperLogService;
import com.crm.crmservice.utils.ThreadParam;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.cglib.beans.BeanCopier;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * 日志拦截器
 */
//@Aspect
//@Component
@Slf4j
public class LogControllerAop {

    @Resource
    private OperLogService operLogService;

    private final static ObjectMapper JSON_MAPPER = new ObjectMapper();

    @Pointcut("@annotation(org.springframework.web.bind.annotation.ExceptionHandler)")
    public void exceptionController() {
    }

    @Pointcut("execution (* com.crm.crmservice.controller..*.*(..))")
    public void controller() {
    }

    @Pointcut("@annotation(org.springframework.web.bind.annotation.PutMapping)")
    public void putMapping() {
    }

    @Pointcut("@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    public void deleteMapping() {
    }

    @AfterReturning(pointcut = "controller()||exceptionController()", returning = "joinPoint")
    public void controllerAfter(Object joinPoint) {
        apiLog(joinPoint);
    }


    private void apiLog(Object joinPoint) {
        Long logId = ThreadParam.LOG_ID.get();
        if (logId != null && joinPoint != null) {
            try {
                log.info("log id:" + logId);
                if (joinPoint instanceof ResultVo) {
                    ResultVo resultVo = (ResultVo) joinPoint;
                    ResultVo<Object> objectResultVo = new ResultVo<>();
                    final BeanCopier copier = BeanCopier.create(resultVo.getClass(), ResultVo.class, false);
                    copier.copy(resultVo, objectResultVo, null);
                    objectResultVo.setData(null);
                    try {
                        String responseBody = JSON_MAPPER.writeValueAsString(objectResultVo);
                        OperLog operLog = operLogService.getById(logId);
                        operLog.setOperRespParam(responseBody);
                        operLogService.updateById(operLog);
                    } catch (JsonProcessingException e) {
                        log.error("analysis error", e);
                    } catch (Exception e) {
                        log.error("other error", e);
                    }
                } else if (joinPoint instanceof Map) {
                    Map resultMap = (Map) joinPoint;
                    if(resultMap.get("status")==null){
                        return;
                    }
                    HashMap<String, String> resultMap1 = new HashMap<>(10);
                    resultMap1.put("status", resultMap.get("status").toString());
                    try {
                        String responseBody = JSON_MAPPER.writeValueAsString(resultMap1);
                        OperLog operLog = operLogService.getById(logId);
                        operLog.setOperRespParam(responseBody);
                        operLogService.updateById(operLog);
                    } catch (JsonProcessingException e) {
                        log.error("analysis error", e);
                    } catch (Exception e) {
                        log.error("other error", e);
                    }
                }
            } catch (Exception e) {
                log.error("logging aop error", e);
            }
            ThreadParam.LOG_ID.remove();
        }

    }

}
