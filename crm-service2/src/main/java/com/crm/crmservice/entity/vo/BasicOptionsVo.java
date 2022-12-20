package com.crm.crmservice.entity.vo;

import lombok.Data;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
@Data
public class BasicOptionsVo{

    private Integer id;

    private String optionKey;

    private String optionValue;

    private String impact;

    private Integer scope;

    private String remarks;


}
