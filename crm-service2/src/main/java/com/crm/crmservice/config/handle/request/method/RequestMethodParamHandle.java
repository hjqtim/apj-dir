package com.crm.crmservice.config.handle.request.method;

import javax.servlet.http.HttpServletRequest;

/**
 * 请求参数处理
 */
public interface RequestMethodParamHandle {

    /**
     * 请求方法名
     * @return
     */
    String methodName();

    /**
     * 处理
     * @param request 请求
     * @return 组装后的参数
     */
    String handle(HttpServletRequest request);

}
