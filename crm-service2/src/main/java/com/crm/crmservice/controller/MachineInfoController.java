package com.crm.crmservice.controller;

import com.crm.crmservice.entity.MachineInfo;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(tags = "MachineInfo Module")
@RestController
@RequestMapping("/MachineInfo")
public class MachineInfoController {

    @ApiOperation("getMachineInfo")
    @GetMapping("/getMachineInfo")
    public Map<String,Object> getMachineInfo(String machineId,String ip){
        Map<String,Object> map = new HashMap<>();
        List<MachineInfo> machineInfoList = new ArrayList<>();
        MachineInfo machineInfo1 = new MachineInfo();
        machineInfo1.setMachineId("ma001");
        machineInfo1.setIp("192.168.0.1");
        machineInfo1.setLocation("building001");

        MachineInfo machineInfo2 = new MachineInfo();
        machineInfo2.setMachineId("ma002");
        machineInfo2.setIp("192.168.0.2");
        machineInfo2.setLocation("building002");

        MachineInfo machineInfo3 = new MachineInfo();
        machineInfo3.setMachineId("ma003");
        machineInfo3.setIp("192.168.0.3");
        machineInfo3.setLocation("building003");

        MachineInfo machineInfo4 = new MachineInfo();
        machineInfo4.setMachineId("ma004");
        machineInfo4.setIp("192.168.0.4");
        machineInfo4.setLocation("building004");

        machineInfoList.add(machineInfo1);
        machineInfoList.add(machineInfo2);
        machineInfoList.add(machineInfo3);
        machineInfoList.add(machineInfo4);

        for (MachineInfo machineInfo : machineInfoList) {
            if (machineInfo.getMachineId().equals(machineId) || machineInfo.getIp().equals(ip)){
                map.put("machineInfo",machineInfo);
            }
        }

        return ResponseBuilder.ok(map);
    }

}
