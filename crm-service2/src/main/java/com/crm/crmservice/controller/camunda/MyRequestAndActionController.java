package com.crm.crmservice.controller.camunda;


import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.config.jwt.JwtConfig;
import com.crm.crmservice.entity.vo.camunda.MyRequestAndActionParamVo;
import com.crm.crmservice.entity.vo.crm.MyRequestAndActionVo;
import com.crm.crmservice.service.CamundaService;
import com.crm.crmservice.service.grant.GrantReadOnlyPermissionService;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

//@Api(tags = "My request and Action")
@RestController
@RequestMapping("/camunda")
@Slf4j
public class MyRequestAndActionController {

    @Autowired
    private CamundaService camundaService;

    @Autowired
    private GrantReadOnlyPermissionService grantReadOnlyPermissionService;

    /*@Autowired
    private NetworkFeedbackCommentService networkFeedbackCommentService;*/

    /**
     * MyRequest页面请求接口
     * @param query
     * @param request
     * @return
     */
    @ApiOperation("queryRequestPage")
    @PostMapping("/queryRequestPage")
    public ResultVo<PageInfo<MyRequestAndActionVo>> queryRequestPage(@RequestBody MyRequestAndActionParamVo query, HttpServletRequest request) {
        JwtConfig jwtConfig = new JwtConfig();
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        String username = jwtConfig.getTokenClaim(token).get("username").asString();
        List<String> userIds = grantReadOnlyPermissionService.readOnlyUserIds(username);
        userIds.add(username);
        query.setUserId(userIds);
        ResultVo<PageInfo<MyRequestAndActionVo>> pageInfoResultVo = camundaService.queryRequestPage(query);
        /*if(pageInfoResultVo.getStatus()==200){
            List<MyRequestAndActionVo> list = pageInfoResultVo.getData().getList();
            Iterator<MyRequestAndActionVo> iterator = list.iterator();
            while (iterator.hasNext()) {
                MyRequestAndActionVo vo = iterator.next();
                final List<NetworkFeedbackComment> list1 = networkFeedbackCommentService.lambdaQuery().eq(NetworkFeedbackComment::getRequestNo, vo.getRequestNo()).list();
                if(null!=list1 && !list1.isEmpty()){
                    vo.setFeedBack(true);
                }else{
                    vo.setFeedBack(false);
                }
            }
        }*/
        return pageInfoResultVo;
    }

    /**
     * MyAction的请求接口
     * @param query
     * @param request
     * @return
     */
    @ApiOperation("queryActionPage")
    @PostMapping("/queryActionPage")
    public ResultVo<PageInfo<MyRequestAndActionVo>> queryActionPage(@RequestBody MyRequestAndActionParamVo query, HttpServletRequest request) {
        JwtConfig jwtConfig = new JwtConfig();
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        String username = jwtConfig.getTokenClaim(token).get("username").asString();
        List<String> userIds = grantReadOnlyPermissionService.readOnlyUserIds(username);
        userIds.add(username);
        query.setUserId(userIds);
        ResultVo<PageInfo<MyRequestAndActionVo>> pageInfoResultVo = camundaService.queryActionPage(query);
        /*if(pageInfoResultVo.getStatus()==200){
            List<MyRequestAndActionVo> list = pageInfoResultVo.getData().getList();
            if (list != null && list.size()>0) {
                Iterator<MyRequestAndActionVo> iterator = list.iterator();
                while (iterator.hasNext()) {
                    MyRequestAndActionVo vo = iterator.next();
                    final List<NetworkFeedbackComment> list1 = networkFeedbackCommentService.lambdaQuery().eq(NetworkFeedbackComment::getRequestNo, vo.getRequestNo()).list();
                    if (null != list1 && !list1.isEmpty()) {
                        vo.setFeedBack(true);
                    } else {
                        vo.setFeedBack(false);
                    }
                }
            }
        }*/
        return pageInfoResultVo;
    }

}
