/**
 * TODO
 *
 * @version 1.0
 * @author lidi
 * @date 2021-7-6 14:37
 */
package com.crm.crmservice.entity.pojo;

import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;


@lombok.Data
@lombok.EqualsAndHashCode(callSuper = false)
public class BasicQuery<T> {

    private T queryEntity;

    /** 页码 */
    private Integer pageIndex = 1;

    /** 页数据量 */
    private Integer pageSize = 10;

    /** 开始时间 */
    private String startTime;

    /** 结束时间 */
    private String endTime;

    /** 关键字 */
    private String keyWord;

    /** 排序字段 */
    private String sortName;

    /** 是否升序 */
    private Boolean sortAsc;



    public Map<String,Object> getParams() {
        Map<String,Object> params = new HashMap<String, Object>();

        if (StringUtils.isNotBlank(this.keyWord)) {
            params.put("keyWord", this.keyWord);
        }
        if (StringUtils.isNotBlank(this.sortName)) {
            params.put("sortName", this.sortName);
            params.put("sortAsc", this.sortAsc ? "" : "DESC");
        }
        return params;
    }
}
