package com.crm.crmservice.service.impl.param;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.param.ReqNoGeneration;
import com.crm.crmservice.mapper.param.ReqNoGenerationMapper;
import com.crm.crmservice.service.param.ReqNoGenerationService;
import com.crm.crmservice.utils.DateUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;

@Service
public class ReqNoGenerationServiceImpl extends ServiceImpl<ReqNoGenerationMapper, ReqNoGeneration> implements ReqNoGenerationService {
    @Resource
    private ReqNoGenerationMapper reqNoGenerationMapper;

    /**
     * requestNo value
     * @return
     * @throws Exception
     */
    public synchronized String ReqNo() throws Exception {
        ReqNoGeneration entity = reqNoGenerationMapper.selectById(1L);
        if(null==entity)
            throw new NullPointerException("ReqNoGeneration is null ");

        String key = entity.getReqKey();
        String nowNum = entity.getReqValue();
        String yearAndMonth = DateUtils.localDateTimeConverDateStr(LocalDateTime.now(), "yyMMdd");
        String newNum = "01";
        if(StringUtils.equals(key, yearAndMonth))
            newNum = nextNum(nowNum);

        entity.setReqKey(yearAndMonth);
        entity.setReqValue(newNum);
        reqNoGenerationMapper.updateById(entity);
        return yearAndMonth+newNum;
    }

    public String nextNum(String nowNum){
        int nowNumInt = Integer.parseInt(nowNum);
        String newNum = String.valueOf(nowNumInt+1);
        if(StringUtils.equals(newNum, "1"))
            return "00"+newNum;
        if(StringUtils.equals(newNum, "10"))
            return "0"+newNum;;
        if(StringUtils.equals(newNum, "100"))
            return newNum;
        return nowNum.replaceAll(String.valueOf(nowNumInt), newNum);
    }

}
