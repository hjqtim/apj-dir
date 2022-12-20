package com.crm.crmservice.service.email;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.email.EmailConfig;

import java.util.List;
import java.util.Map;

/**
 * 参数配置表 服务类
 * @author Ethan Li
 * @since 2022-12-12
 */
public interface EmailConfigService extends IService<EmailConfig> {

    //查询参数配置信息.
    EmailConfig selectConfigById(Long configId);

    //查询参数配置列表.
    List<EmailConfig> selectConfigList(EmailConfig config);

    //查询参数配置分页列表.
    IPage<EmailConfig> page(IPage<EmailConfig> page, EmailConfig config);

    //新增参数配置.
    int insertConfig(EmailConfig config);

    //修改参数配置.
    int updateConfig(EmailConfig config);

    //批量删除参数信息.
    void deleteConfigByIds(Long[] configIds);


    //校验参数键名是否唯一.
    String checkConfigKeyUnique(EmailConfig config);

    //获取配置文件转化为key SysConfig形式.
    Map<String, EmailConfig> selectConfigMap(String configValuePrefix, String configEnv);

}
