package com.crm.crmservice.service;


import com.alibaba.fastjson.JSONObject;
import com.crm.crmservice.common.response.ResultVo;
import com.crm.crmservice.config.FeignConfig;
import com.crm.crmservice.entity.pojo.ExitSubProcessParam;
import com.crm.crmservice.entity.pojo.camunda.Fallback;
import com.crm.crmservice.entity.pojo.camunda.StartProcess;
import com.crm.crmservice.entity.pojo.camunda.TaskVo;
import com.crm.crmservice.entity.vo.camunda.MyRequestAndActionParamVo;
import com.crm.crmservice.entity.vo.crm.MyRequestAndActionVo;
import com.github.pagehelper.PageInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(url = "${camunda.url}", name = "camundaUrl", configuration = {FeignConfig.class})
public interface CamundaService {

    @GetMapping(value = "/publish/{modelId}")
    JSONObject publishCamunda(@PathVariable(name = "modelId") String modelId);

    /**
     * 开启流程实例
     *
     * @param startProcess
     * @return
     */
    @PostMapping(value = "/camunda/process/instance/start", consumes = "application/json")
    JSONObject startCamunda(@RequestBody StartProcess startProcess);

    /**
     * 我的待办 Old (MyRequest TeamRequest)
     *
     * @param map
     * @return
     */
    @PostMapping(value = "/task/myApproval", consumes = "application/json")
    JSONObject getMyApproval(@RequestBody Map<String, Object> map);

    @PostMapping(value = "/ReuqestTask/getRequesterList", consumes = "application/json")
    JSONObject getRequesterList();

    @PostMapping(value = "/task/actionTask", consumes = "application/json")
    JSONObject actionTask(@RequestBody TaskVo taskVo);

    @GetMapping(value = "/task/getTaskId", consumes = "application/json")
    String getTaskId(@RequestParam("pid") String pid);

    @GetMapping(value = "/camunda/process/task/queryTaskIdByCandidateUserBool", consumes = "application/json")
    JSONObject queryTaskIdByCandidateUserBool(@RequestParam("candidateUser") String candidateUser, @RequestParam("businessKey") String businessKey);

    @PostMapping(value = "/camunda/process/task/candidateUserBusinessKeyComplete/{businessKey}/{candidateUser}", consumes = "application/json")
    JSONObject candidateUserBusinessKeyComplete(@PathVariable(name = "businessKey") String businessKey, @PathVariable(name = "candidateUser") String candidateUser, @RequestBody Map<String, Object> variables);

    // 手动携带token
    @PostMapping(value = "/camunda/process/task/candidateUserBusinessKeyComplete/{businessKey}/{candidateUser}", consumes = "application/json")
    JSONObject candidateUserBusinessKeyCompleteAndToken(@PathVariable(name = "businessKey") String businessKey, @PathVariable(name = "candidateUser") String candidateUser, @RequestBody Map<String, Object> variables, @RequestHeader(name = HttpHeaders.AUTHORIZATION) String authorization);


    // repairProcess 所用
    @PostMapping(value = "/camunda/process/task/dataConversionUserBusinessKeyComplete/{processInstanceId}/{candidateUser}", consumes = "application/json")
    JSONObject dataConversionUserBusinessKeyComplete(@PathVariable(name = "processInstanceId") String processInstanceId, @PathVariable(name = "candidateUser") String candidateUser,
                                                     @RequestBody Map<String, Object> variables);

    /**
     * 完成待办任务
     *
     * @param taskId
     * @param variables
     * @return
     */
    @PostMapping(value = "/camunda/process/task/completeTask/{taskId}", consumes = "application/json")
    JSONObject completeTask(@PathVariable(name = "taskId") String taskId, @RequestBody Map<String, Object> variables);

    /**
     * 根据流程ID 找Edit Form 节点 taskId
     *
     * @param processInstanceId
     * @return
     */
    @GetMapping(value = "/camunda/process/task/getEditFormTaskId/{processInstanceId}", consumes = "application/json")
    JSONObject getEditFormTaskId(@PathVariable(name = "processInstanceId") String processInstanceId);

    @GetMapping(value = "/task/getAllStepName", consumes = "application/json")
    JSONObject getStepName();

    @PostMapping(value = "/task/receiveNext")
    JSONObject nextTestResci(@RequestParam("processInstanceId") String processInstanceId, @RequestBody Map<String, Object> variables, @RequestHeader(name = HttpHeaders.AUTHORIZATION) String authorization);


    @PostMapping(value = "/history/queryRequestPage", consumes = "application/json")
    ResultVo<PageInfo<MyRequestAndActionVo>> queryRequestPage(@RequestBody MyRequestAndActionParamVo vo);

    @PostMapping(value = "/history/queryActionPage", consumes = "application/json")
    ResultVo<PageInfo<MyRequestAndActionVo>> queryActionPage(@RequestBody MyRequestAndActionParamVo vo);

    @PostMapping(value = "/camunda/process/task/setVariable/{requestNo}", consumes = "application/json")
    JSONObject setVariable(@PathVariable(name = "requestNo") String requestNo, @RequestBody Map<String, Object> variables);

    @GetMapping(value = "/history/queryRequestAndActionCount/{userId}", consumes = "application/json")
    ResultVo<Map<String, Object>> queryRequestAndActionCount(@PathVariable(name = "userId") String userId);

    @GetMapping(value = "/history/queryBusinessKey/{requestNo}/{userId}", consumes = "application/json")
    ResultVo<List<String>> queryBusinessKey(@PathVariable(name = "requestNo") String requestNo, @PathVariable(name = "userId") String userId);

    @PostMapping(value = "/task/fallbackAnyNode", consumes = "application/json")
    ResultVo<List<String>> fallbackAnyNode(@RequestBody Fallback fallback);

    @GetMapping(value = "/task/getCurrentTaskId", consumes = "application/json")
    ResultVo<String> getCurrentTaskId(@RequestParam(name = "processInstanceId") String processInstanceId);

    @GetMapping(value = "/task/getTaskIdByBusinessKey", consumes = "application/json")
    ResultVo<String> getTaskIdByBusinessKey(@RequestParam(name = "businessKey") String businessKey);

    @GetMapping(value = "/conversion/updateStartTime/{requestNo}/{startTime}", consumes = "application/json")
    ResultVo<String> conversionUpdateStartTime(@RequestParam(name = "requestNo") String requestNo, @PathVariable(name = "startTime") String startTime);

    @GetMapping(value = "/task/stopProcess", consumes = "application/json")
    ResultVo<Object> stopProcess(@RequestParam(name = "processInstanceId") String processInstanceId, @RequestHeader(name = "dataConversion") String dataConversion);

    @GetMapping(value = "/task/getNodeList", consumes = "application/json")
    ResultVo<List<String>> getNodeList(@RequestParam(name = "processId") String processId);

    @GetMapping(value = "/task/rollbackThePreviousProcess", consumes = "application/json")
    ResultVo rollbackThePreviousProcess(@RequestParam("processId") String processId, @RequestParam("username") String username);

    @GetMapping(value = "/task/rollbackThePendingProcess", consumes = "application/json")
    ResultVo rollbackThePendingProcess(@RequestParam("processId") String processId, @RequestParam("username") String username);

    @PostMapping(value = "/task/pendingSubprocess", consumes = "application/json")
    ResultVo pendingSubprocess(@RequestBody ExitSubProcessParam param);

    @PostMapping(value = "task/exitSubprocess", consumes = "application/json")
    ResultVo exitSubProcess(@RequestBody ExitSubProcessParam param);
}
