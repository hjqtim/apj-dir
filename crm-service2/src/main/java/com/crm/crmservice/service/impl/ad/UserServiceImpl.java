
package com.crm.crmservice.service.impl.ad;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crm.crmservice.entity.ad.User;
import com.crm.crmservice.mapper.ad.UserMapper;
import com.crm.crmservice.service.ad.LDAPService;
import com.crm.crmservice.service.ad.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private UserMapper userMapper;

    @Resource
    LDAPService ldapService;

    @Override
    public User getUserInfo(String userName, String adBase) {
        return ldapService.getAdUser(userName, adBase);
    }

    @Override
    public User getUserInfo(String username) {
        return userMapper.selectOne(Wrappers.<User>lambdaQuery().eq(User::getName, username));
    }

    @Override
    public List<User> getLikeUserInfo(String displayName, String adBase) {
        return ldapService.getLikeUserInfo(displayName, adBase);
    }


}
