package com.crm.crmservice.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT的token，区分大小写.
 */
@ConfigurationProperties(prefix = "config.jwt")
@Component
public class JwtConfig {

  // Todo 暂时都加了static,后面删除
  private static String secret;
  private static long expire;
  private String header;
  private static String iss;

  /**
   * 生成token(测试用).
   * expire 此时数值是 1000
   */
  // Todo 暂时加了static,后面删除
  public static String createToken(String username) {
    Map<String, Object> map = new HashMap<>();
    map.put("alg", "HS256");
    map.put("typ", "JWT");
    Date nowDate = new Date();
    Date expireDate = new Date(nowDate.getTime() + expire * 1000 * 60); // 过期时间
    return JWT.create()
            .withHeader(map)
            .withClaim("username", username)
            .withClaim("iss", iss)
            .withExpiresAt(expireDate)// 过期时间
            //.withIssuedAt(startDate)        // 签发时间
            .sign(Algorithm.HMAC256(secret));        // 加密签名算法
  }

  // dataConversion 需要拿一个新的token，这里是因为 dataConversion 太久时间了，所以生成一个几天的 token 给dataConversion 使用
  public static String dataConversionCreateToken(String username) {
    Map<String, Object> map = new HashMap<>();
    map.put("alg", "HS256");
    map.put("typ", "JWT");
    Date nowDate = new Date();
    Date expireDate = new Date(nowDate.getTime() + expire * 4 * 1000 * 60); // 过期时间
    return JWT.create()
            .withHeader(map)
            .withClaim("username", username)
            .withClaim("iss", iss)
            .withExpiresAt(expireDate)// 过期时间
            //.withIssuedAt(startDate)        // 签发时间
            .sign(Algorithm.HMAC256(secret));        // 加密签名算法
  }

  /**
   * 解析token中信息.
   */
  public Map<String, Claim> getTokenClaim(String token) {
    JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
    token = token.replaceAll("Bearer ", "");
    DecodedJWT jwt = verifier.verify(token);
    return jwt.getClaims();
  }

  // --------------------- getter & setter ---------------------

  public String getSecret() {
    return secret;
  }

  public void setSecret(String secret) {
    this.secret = secret;
  }

  public long getExpire() {
    return expire;
  }

  public void setExpire(long expire) {
    this.expire = expire;
  }

  public String getHeader() {
    return header;
  }

  public void setHeader(String header) {
    this.header = header;
  }

  public String getIss() {
    return iss;
  }

  public void setIss(String iss) {
    this.iss = iss;
  }
}

