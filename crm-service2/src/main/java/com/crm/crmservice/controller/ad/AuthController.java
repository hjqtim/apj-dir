package com.crm.crmservice.controller.ad;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.crm.crmservice.config.jwt.JwtUtil;
import com.crm.crmservice.entity.ad.User;
import com.crm.crmservice.entity.ad.UserPojo;
import com.crm.crmservice.entity.ad.UserVo;
import com.crm.crmservice.mapper.ad.UserMapper;
import com.crm.crmservice.service.ad.UserService;
import com.crm.crmservice.utils.ADUtils;
import com.crm.crmservice.utils.ResponseBuilder;
import com.crm.crmservice.utils.TokenUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Ethan Li
 */
@RestController
@RequestMapping(value = "/auth")
@Api(tags = "AD Module")
@Slf4j
public class AuthController {

    @Resource
    UserService userService;
    @Resource
    private TokenUtils tokenUtils;
    @Value("${ad.ignore}")
    private String ignore;
    @Value("${ad.base}")
    private String adBase;
    @Value("${ad.url}")
    private String adRul;
    @Value("${config.jwt.secret}")
    private String secret;
    //token有效时间
    @Value("${config.jwt.expire}")
    private String expireTime;

    @ApiOperation(value = "login")
    @PostMapping(value = "/login")
    public Map<String, Object> login(@RequestBody UserPojo user) {
        Map<String, Object> result = new HashMap<>();
        String userName = user.getUsername();
        String password = user.getPassword();
        String newToken = "";
        //从AD域获取该用户信息
        User userForAd = userService.getUserInfo(userName,adBase);

        if(userForAd==null){
            result.put("message","Login failed,The user does not exist.");
            return ResponseBuilder.error(result);
        }else{
            UserVo userVo = new UserVo();

            boolean success = true;
            // 是否执行密码校验
            if (!StringUtils.equals("Y", ignore)) {
                //执行登录，第三个参数TRUE代表传过来的密码是加密的
                success = ADUtils.login(userName, password, true,adRul);
            }
            result.put("success", success);
            //判断登录是否成功
            if (success) {
                log.info("Login success...");
                //token过期时间
                Date expiresDate = new Date(System.currentTimeMillis()+Integer.valueOf(expireTime)*60*1000);
                //生成token
                newToken = JwtUtil.sign(userName,1,expiresDate,secret);
                //result.put("newToken", newToken);
                result.put("expireTime", expireTime);
                result.put("corpId", userForAd.getName());
                result.put("user", userVo);

                //对User表进行检验、操作
                QueryWrapper<User> wrapper = new QueryWrapper<>();
                wrapper.eq("name",userForAd.getName());
                List<User> users = userService.list(wrapper);

                //若该用户在user表存在，则更新，否则新增
                //解析 title，获取组信息
                String title = userForAd.getTitle();
                if (StringUtils.isNotBlank(title)){
                    String group = getGroup(title);
                    //String position = title.substring(0,title.indexOf("("));
                    userForAd.setTeam(group);
                    //userForAd.setPosition(position);
                }
                BeanUtils.copyProperties(userForAd,userVo);
                if (users!=null && !users.isEmpty()){
                    User userInfo = users.get(0);
                    UpdateWrapper<User> updateWrapper = new UpdateWrapper<>();
                    updateWrapper.eq("name",userInfo.getName());
                    //AD信息 跟 数据库信息两者匹配，不一致则将 AD信息更新进 数据库
                    if (!userInfo.equals(userForAd)){
                        userService.update(userForAd,updateWrapper);
                        log.info("Update success...");
                    }
                }else{
                    userService.save(userForAd);
                    log.info("Insert success...");
                }

            }else {
                result.put("message","Login failed,Please check the corpId and password.");
                return ResponseBuilder.error(result);
            }
        }
        return ResponseBuilder.loginInfo(result,newToken);
    }

    //@ApiOperation(value = "getUserInfoByToken")
    @GetMapping(value = "/getUserInfoByToken")
    public Map<String,Object> getUserInfoByToken() {
        User user = null;
        String userName = tokenUtils.getUserName();
        if (userName != null) {
            user = userService.getUserInfo(userName,adBase);
            String title = user.getTitle();
            user.setTeam(getGroup(title));
        }
        return ResponseBuilder.ok(user);
    }

    @ApiOperation(value = "getLikeUserInfo")
    @GetMapping(value = "/getLikeUserInfo")
    public Map<String,Object> getLikeUserInfo(String displayName) {
        Map<String,Object> map = new HashMap<>();
        List<User> user = userService.getLikeUserInfo(displayName,adBase);
        if (user!=null && !user.isEmpty()){
            map.put("total",user.size());
            map.put("user",user);
        }
        return ResponseBuilder.ok(map);
    }

    @ApiOperation(value = "getUserInfo")
    @GetMapping(value = "/getUserInfo")
    public Map<String,Object> getUserInfo(String username) {
        return ResponseBuilder.ok(userService.getUserInfo(username));
    }

    //根据title 或者 displayName 截取 group 信息
    public String getGroup(String title){
        return title.substring(title.indexOf("(")+1,title.indexOf(")"));
    }
}
