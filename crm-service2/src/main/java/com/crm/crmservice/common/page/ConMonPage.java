package com.crm.crmservice.common.page;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.crmservice.common.constant.CommonField;

import java.util.HashMap;
import java.util.Map;

public class ConMonPage {

    private ConMonPage() {
    }

    /**
     * 公共分页处理数据 返回方法
     * @param page
     * @return
     */
    public static Map<String,Object> getConMonPage(Page<?> page){
        Map<String, Object> result = new HashMap<>();
        result.put(CommonField.ITEMS, page.getRecords());
        result.put(CommonField.TOTAL, page.getTotal());
        result.put(CommonField.PAGE_SIZE, page.getSize());
        return result;
    }
}
