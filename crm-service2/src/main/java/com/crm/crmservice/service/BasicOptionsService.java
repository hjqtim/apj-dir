package com.crm.crmservice.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.BasicOptions;

import java.util.List;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
public interface BasicOptionsService extends IService<BasicOptions> {

    List<BasicOptions> getBasicOptionList(String optionKey);

    List<String> getOptionKeyList();

}
