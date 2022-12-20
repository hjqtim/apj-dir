package com.crm.crmservice.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.crm.crmservice.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * http流解析工具类
 *
 * @author WZM755
 */
@Slf4j
public class HttpAnalysis {

    private HttpAnalysis() {

    }

    private final static ObjectMapper JSON_MAPPER = new ObjectMapper();

    /**
     * 解析json请求
     *
     * @param request
     * @return
     */
    public static String getRequestJsonToStr(HttpServletRequest request) {
        String contentType = request.getContentType();
        int contentLength = request.getContentLength();
        if (contentLength < 0) {
            return null;
        }
        byte[] buffer = new byte[contentLength];
        try {
            HttpServletRequest httpServletRequest = new RepeatedReadRequestWrapper(request);
            for (int i = 0; i < contentLength; ) {
                int readLine = httpServletRequest.getInputStream().read(buffer, i, contentLength - i);
                if (readLine == -1) {
                    break;
                }
                i += readLine;
            }
            String characterEncoding = request.getCharacterEncoding();
            if (StringUtils.isEmpty(characterEncoding)) {
                return new String(buffer, StandardCharsets.UTF_8);
            }
            return new String(buffer, characterEncoding);

        } catch (Exception e) {
            log.error("analysis-error", e);
            throw new CustomException("request-analysis-error");
        }
    }

    /**
     * 解析请求
     *
     * @param request         请求
     * @param requestParamStr 请求参数初始化
     * @return
     */
    public static String getRequestStr(HttpServletRequest request, String requestParamStr) {
        if (StringUtils.isNotEmpty(request.getHeader("content-type"))) {
            if (request.getHeader("content-type").indexOf("application/json") > -1) {
                requestParamStr = requestParamStr + HttpAnalysis.getRequestJsonToStr(request);
            } else {
                requestParamStr = requestParamStr + requestFormAnalysis(request);
            }
            log.info("request-params：" + requestParamStr);
        }

        return requestParamStr;
    }

    /**
     * form表单请求解析
     *
     * @param request
     * @return
     */
    private static String requestFormAnalysis(HttpServletRequest request) {
        String requestParamStr;
        Enumeration<String> parameterNames = request.getParameterNames();
        ConcurrentHashMap<String, Object> paramMap = new ConcurrentHashMap<>(10);
        while (parameterNames.hasMoreElements()) {
            String parameterKey = parameterNames.nextElement();
            String parameterValue = request.getParameter(parameterKey);
            paramMap.put(parameterKey, parameterValue);
        }
        try {
            requestParamStr = JSON_MAPPER.writeValueAsString(paramMap);
        } catch (JsonProcessingException e) {
            log.error("analysis-error", e);
            throw new CustomException("request-analysis-error");
        }
        return requestParamStr;
    }


    /**
     * 获取ip地址
     *
     * @param request 请求
     * @return 请求方的ip地址
     */
    public static String getIP(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        String forwarded = request.getHeader("X-Forwarded-For");
        log.info("forwarded:" + forwarded);
        String realIp = request.getHeader("X-Real-IP");
        log.info("realIp:" + realIp);
        String ip = null;
        if (realIp == null) {
            if (forwarded == null) {
                ip = remoteAddr;
            } else {
                ip = remoteAddr + "/" + forwarded.split(",")[0];
            }
        } else {
            if (realIp.equals(forwarded)) {
                ip = realIp;
            } else {
                if (forwarded != null) {
                    forwarded = forwarded.split(",")[0];
                }
                ip = realIp + "/" + forwarded;
            }
        }
        return ip;
    }

    private static boolean skipFlag(String s){
        ArrayList<String> skipList = new ArrayList<>();
        skipList.add("file");
        for (String skipStr : skipList) {
            if(s.equals(skipStr)){
                return true;
            }
        }
        return false;
    }
}
