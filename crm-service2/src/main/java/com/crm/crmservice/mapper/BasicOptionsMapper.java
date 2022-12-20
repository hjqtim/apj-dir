package com.crm.crmservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.crm.crmservice.entity.BasicOptions;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author Ethan Li
 * @since 2022-11-21
 */
public interface BasicOptionsMapper extends BaseMapper<BasicOptions> {

    @Select("select option_key from basic_options where is_delete = 0 group by option_key")
    List<String> getOptionKeyList();

}
