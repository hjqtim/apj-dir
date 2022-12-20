/**
 * @version 1.0
 * @author lidi
 * @date 2021-6-30 11:551
 */
package com.crm.crmservice.service.ad;

import com.baomidou.mybatisplus.extension.service.IService;
import com.crm.crmservice.entity.ad.User;

import java.util.List;

public interface UserService extends IService<User> {
    User getUserInfo(String userName, String adBase);

    /**
     * database get user info
     *
     * @param userName
     * @return
     */
    User getUserInfo(String userName);

    List<User> getLikeUserInfo(String displayName, String adBase);
}
