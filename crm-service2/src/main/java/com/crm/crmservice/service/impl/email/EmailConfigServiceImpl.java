package com.crm.crmservice.service.impl.email;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.email.EmailConfig;
import com.crm.crmservice.exception.CustomException;
import com.crm.crmservice.mapper.email.EmailConfigMapper;
import com.crm.crmservice.service.email.EmailConfigService;
import com.crm.crmservice.utils.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 参数配置表 服务实现类
 * @author Ethan Li
 * @since 2022-12-12
 */
@Service
public class EmailConfigServiceImpl extends ServiceImpl<EmailConfigMapper, EmailConfig> implements EmailConfigService {


    @Resource
    private EmailConfigMapper emailConfigMapper;


    @Override
    public EmailConfig selectConfigById(Long configId) {
        return emailConfigMapper.selectById(configId);
    }

    /**
     * 查询参数配置列表.
     *
     * @param config 参数配置信息
     * @return 参数配置集合
     */
    @Override
    public List<EmailConfig> selectConfigList(EmailConfig config) {
        LambdaQueryWrapper<EmailConfig> queryWrapper = Wrappers.lambdaQuery(EmailConfig.class);
        queryWrapper.like(StrUtil.isNotEmpty(config.getConfigName()), EmailConfig::getConfigName,
                config.getConfigName());
        queryWrapper.eq(StrUtil.isNotEmpty(config.getConfigType()), EmailConfig::getConfigType,
                config.getConfigType());
        queryWrapper.like(StrUtil.isNotEmpty(config.getConfigKey()), EmailConfig::getConfigKey,
                config.getConfigKey());
        queryWrapper.eq(StrUtil.isNotEmpty(config.getConfigEnv()), EmailConfig::getConfigEnv,
                config.getConfigEnv());
        return emailConfigMapper.selectList(queryWrapper);
    }

    @Override
    public IPage<EmailConfig> page(IPage<EmailConfig> page, EmailConfig config) {
        LambdaQueryWrapper<EmailConfig> queryWrapper = Wrappers.lambdaQuery(EmailConfig.class);
        queryWrapper.like(StrUtil.isNotEmpty(config.getConfigName()), EmailConfig::getConfigName,
                config.getConfigName());
        queryWrapper.eq(StrUtil.isNotEmpty(config.getConfigType()), EmailConfig::getConfigType,
                config.getConfigType());
        queryWrapper.like(StrUtil.isNotEmpty(config.getConfigKey()), EmailConfig::getConfigKey,
                config.getConfigKey());
        return emailConfigMapper.selectPage(page, queryWrapper);
    }

    /**
     * 新增参数配置.
     *
     * @param config 参数配置信息
     * @return 结果
     */
    @Override
    public int insertConfig(EmailConfig config) {
        int row = emailConfigMapper.insert(config);
        return row;
    }

    /**
     * 修改参数配置.
     *
     * @param config 参数配置信息
     * @return 结果
     */
    @Override
    public int updateConfig(EmailConfig config) {
        int row = emailConfigMapper.updateById(config);
        return row;
    }

    /**
     * 批量删除参数信息.
     *
     * @param configIds 需要删除的参数ID
     */
    @Override
    public void deleteConfigByIds(Long[] configIds) {
        for (Long configId : configIds) {
            EmailConfig config = selectConfigById(configId);
            if (StringUtils.equals("Y", config.getConfigType())) {
                throw new CustomException(String.format("内置参数【%1$s】不能删除 ", config.getConfigKey()));
            }
            emailConfigMapper.deleteById(configId);
        }
    }



    /**
     * 校验参数键名是否唯一.
     *
     * @param config 参数配置信息
     * @return 结果
     */
    @Override
    public String checkConfigKeyUnique(EmailConfig config) {
        Long configId = ObjectUtil.isNull(config.getConfigId()) ? -1L : config.getConfigId();
        LambdaQueryWrapper<EmailConfig> queryWrapper = Wrappers.lambdaQuery(EmailConfig.class);
        queryWrapper.eq(EmailConfig::getConfigKey, config.getConfigKey());
        EmailConfig info = this.getOne(queryWrapper, false);
        if (ObjectUtil.isNotNull(info) && info.getConfigId().longValue() != configId.longValue()) {
            return "1";
        }
        return "0";
    }


    /**
     * 通过前缀查询并转化为map.
     *
     * @param configValuePrefix 前缀
     * @return configMap
     */
    @Override
    public Map<String, EmailConfig> selectConfigMap(String configValuePrefix, String configEnv) {
        EmailConfig emailConfig = new EmailConfig();
        emailConfig.setConfigKey(configValuePrefix);
        emailConfig.setConfigEnv(configEnv);
        List<EmailConfig> sysConfigs = selectConfigList(emailConfig);
        Map<String, EmailConfig> configMap = sysConfigs.stream()
                .collect(Collectors.toMap(EmailConfig::getConfigKey, a -> a, (k1, k2) -> k1));
        return configMap;
    }

}
