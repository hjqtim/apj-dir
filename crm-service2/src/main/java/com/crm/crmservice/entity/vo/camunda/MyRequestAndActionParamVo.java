package com.crm.crmservice.entity.vo.camunda;

import com.crm.crmservice.entity.vo.ParamKeyValVo;
import lombok.Data;

import java.io.Serializable;
import java.util.List;


@Data
public class MyRequestAndActionParamVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<String> userId;

    private String requestNo;

    private String endTime;

    private String startTime;

    private String state;

    private String isMyTeam;

    private List<String> actIds;

    private List<ParamKeyValVo> paramVo;

    private Integer current;

    private Integer size;
}
