package com.crm.crmservice.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@Api(tags = "Camunda management")
@RestController
@RequestMapping("/camunda")
public class CamundaController {
    /*@Resource
    private DpRequestService dpRequestService;

    @ApiOperation(value = "camunda Listen java class function")
    @PostMapping("/camundaListen")
    @ResponseBody
    public Map<String,Object> camundaListen(@RequestBody Map<String,Object> map){
        DpRequest dpRequest = new DpRequest();
        UpdateWrapper<DpRequest> wrapper = null;
        if (map.get("currentActivityId").toString().equals("End")){
            wrapper = new UpdateWrapper<>();
            dpRequest.setDprequeststatus("Completed");
            wrapper.eq("process_id",String.valueOf(map.get("processInstanceId")));
//            int dpRequest1 = dpRequestService.updateDpRequest(dpRequest, wrapper);
//            return ResponseBuilder.ok(CommonField.OPERATE_SUCCESSFULLY,dpRequest1);
            return ResponseBuilder.ok();
        }
        return ResponseBuilder.fail();
    }*/

}
