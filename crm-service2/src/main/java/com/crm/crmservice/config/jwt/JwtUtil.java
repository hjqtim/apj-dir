package com.crm.crmservice.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.crm.crmservice.common.constant.ResultMessage;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.Date;
import java.util.HashMap;

/**
 * JwtUtil.
 */
@Slf4j
public class JwtUtil {

  // 过期时间为1小时
  private static final long EXPIRE_TIME = 1 * 60 * 60 * 1000L;
  // token私钥
  private static final String TOKEN_SECRET = "abc";
  private static String tokenUsername;
  private static String newToken;

  private static final JwtUtil jwtUtil=new JwtUtil();

  private JwtUtil() {
  }

  public static String getTokenUsername() {
    return tokenUsername;
  }

  public static void setTokenUsername(String tokenUsername) {
    JwtUtil.tokenUsername = tokenUsername;
  }

  public static String getNewToken() {
    return newToken;
  }

  public static void setNewToken(String newToken) {
    JwtUtil.newToken = newToken;
  }

  /**
   * @param username
   * @param id
   * @return
   */
  public static String sign(String username, Integer id,Date expiresDate,String secret) {
    // 过期时间expiresDate
    // 私钥及加密算法
    Algorithm algorithm = Algorithm.HMAC256(secret);
    // 设置头信息
    HashMap<String, Object> header = new HashMap<>(2);
    header.put("typ", "JWT");
    header.put("alg", "HS256");
    // 附带username和userId生成签名
    return JWT.create().withHeader(header).withClaim("username", username)
        .withClaim("userId", id).withExpiresAt(expiresDate).sign(algorithm);
  }

  public static void checkToken(String token, JwtConfig jwtConfig) {
    synchronized (jwtUtil){
      if (!StringUtils.isEmpty(token)) {
        String username = jwtConfig.getTokenClaim(token).get("username").asString();
        log.info("old username:【{}】",username);
        JwtUtil.setTokenUsername(username);//设置username进内存
        JwtUtil.setNewToken(jwtConfig.createToken(username));
        log.info("new username:【{}】",jwtConfig.getTokenClaim(JwtUtil.getNewToken()).get("username").asString());
        // todo 校验用户是否存在
      } else {
        throw new SignatureException(ResultMessage.TOKEN_ERROR);
      }
    }

  }
}
