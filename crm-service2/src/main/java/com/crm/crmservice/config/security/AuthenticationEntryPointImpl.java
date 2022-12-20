package com.crm.crmservice.config.security;


import com.alibaba.fastjson.JSON;
import com.crm.crmservice.common.enums.ResultCode;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证失败处理类 返回未授权.
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint, Serializable {

  private static final long serialVersionUID = -8970718410437077606L;

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException e) throws IOException, ServletException {
    response.setStatus(ResultCode.UNAUTHORISED.getCode());
    Map<String,Object> map = new HashMap<>();
    map.put("code",ResultCode.UNAUTHORISED.getCode());
    map.put("message",e.getMessage());
    response.getWriter().print(JSON.toJSON(map));
    //response.getWriter().print(e.getMessage());
    response.setContentType("application/json");
    response.setCharacterEncoding("utf-8");
  }
}
