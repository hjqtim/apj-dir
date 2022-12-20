package com.crm.crmservice.config.jwt;

import com.crm.crmservice.config.security.HeaderMapRequestWrapper;
import com.crm.crmservice.utils.RsaUtils;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.annotation.Resource;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 对请求中的token进行拦截.
 */
@ConfigurationProperties(prefix = "spring.profiles")
@Component
@Slf4j
public class TokenInterceptor extends OncePerRequestFilter {
    @Resource
    private JwtConfig jwtConfig;

    // 私钥
    private static final String privateKey = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZsTfiLuppe77OSpFIKSE7aQDWs7Fl2g2KHrGvoh+I+DwjewXqPoOXvlgWA8QeJ7wZjSlu+jyHn6k2gKmUlmdEdr3hE/eHxLncRG8hDjzKpOMokjH5kC34JRGMj5mczTc0fmdQLzeEXrA+aDBGI2VI9duUg54AmI5ve8SEN7D7sLkzXDvu7rT3fJTDEt5kPltzvGzVHgLokREUXQmiGUJjdz6PTDCF8np1fBHOAfmneg22KVy12f57GkQ9iF+eJtAnsG4wKz3/m9EoG6brxZpZXR+NdF/pIARy2jnNMv90yScbtoM3Q8AXmRBU19xvShY0RYHI65sMBnV2NsIVCuAjAgMBAAECggEAam29XCTO8SLfG62pc4X/3Es3aHZhBz37mETvGMe0/L2hr5Q2oWKO79rA1uXevl8Xs738Djy9A9H9dJ+eTyXj9xYfISkZhWwmpLDDH+njERUjtOmgL8i2/Jp2z5Z1co7thq1tz6oS0NhdRaoSm89RCTgvyWVnWdRK9kqH6GNEbNV8qddaEm1YrPTKbjCl500VEUsIl8YxYJ1e6AGw1xU4AlJzx8ks6dMlqus7oO1/SxRuJWu6oUpsHkc6K0iofu4dsyu1jhkcidOrXiYf2fh8sh+vkCh11uVe1Zi/5NFwhQOxbVoSPDcTltfBw7OPyDm2/hgOO560s7+4sUn/Ks31AQKBgQDet71Idyfy5hzqlJk8sZVBB5jG+IEuiUobJYc8vxBoX3EIkHoAcEbJa6UGZ5V9sSyi07hgacuwInO2ksZ6CB0QFSCQOcldyPeRr7E9NDwtKdxBFlYsW/gcOY2xCK9xd1OfUfJBaHUeMwG3CgBAw9KGtF/qfTox28vxUQD9iK25gQKBgQCwqNlxGk9xDrhH4joXnXfFisBxQYpZZX6vGSqlSgaBJuNPauDCie3Ib7njrofI6tjruotLV7WrKbpSeABzI/+mSVOz9icmk/85EaoPGfCmnKWH5UdP5oMJe42tkMYcBlv1NDrRwu5s7PAQq0nCg5sUdjpk5XDvD5DEtISvzWFDowKBgADJ1bmz8khB2EhcTk6Qsl6QkFHj/1ES21hNQbVNV9mGvPeyyzvFKfr8jpD/POA9CFNrPHPa7AWrmY1D57/212N/L6ZTDgtu8rFpVc9JqAzg4Q657YQqry4qZf4CcdyM95bQy3K/0+pPc+oZ9vZDuzMO4GgMGXCjvo0UJFTBbxwBAoGBAKlHcuzlKECOuVjwV3gvhQh+t38PLZISJn2EoQ+3ylnRuLluEad4YajSHo8ku6p0F55yp21vw34bQxYpNU0frqZZ12I3ujZGVKcL3SgRVD9jFV8N/fJ7UQ8yHIW3l45dLZreDIrZvnwT4somSEyirWTDEZuDHF+HS9KhpA+Nvuj/AoGARPgYu99Rv10mGObEomu0L3GfQ/XwMKlK3KfwY5XRhdnwiZxxrLTgd497Jvu7CYz7urlv4vEQRbu/cNW3bss6lhTm4oCuJr24ApYC7ovINJcdnGSX6+K84gguzE5E0+fdtyh1c/BUc9TYTV9hmcHdUdO9iVHmszF3+rxHd6dozUk=";


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        // 清空token
        JwtUtil.setNewToken("");

        // 跨域处理
        if (request.getMethod().equals(RequestMethod.OPTIONS.name())) {
            cros(request, response);
        }

        // 获取地址
        String uri = request.getRequestURI();
        boolean needCheck = true;
        for (String s : new JwtFilterUrlList().getFilterList()) {
            if (uri.equals(s)
                    || uri.equals("/swagger-ui.html")
                    || uri.contains("/swagger-resources")
                    || uri.contains("/doc.html")
                    || uri.contains("/v2")
                    || uri.contains("/docs")
                    || uri.contains("/webjars")
                    || uri.contains("/favicon.ico")
                    || uri.contains("/swaggerDocument")
                    || uri.contains("/ad/getNewToken")
                    || uri.contains("/healthCheck")
                    || uri.contains("/auth/login")
                    // 超时保存
                    || uri.contains("/approvalRecord/saveApprovalRecord")
//              || uri.contains("/")
            ) {
                needCheck = false;
                break;
            }
        }

        // Token 验证
        String token = request.getHeader(jwtConfig.getHeader());
        HeaderMapRequestWrapper requestWrapper = new HeaderMapRequestWrapper(request);
        if (token == null) {
            // 这里是为了处理 B24前端无法一开始登录调用我们后端拿token,所以请求头会传入这么一个 AccessAuth 请求头，里面会存放当前登录人的corpID
            String accessAuth = request.getHeader("AccessAuth");
            // 这里是判断 如果长度 是大于 100的，那么就是一个加密的 AccessAuth，需要去解密
            if (accessAuth != null && accessAuth.length() > 100) {
                String decrypt = null;
                try {
                    decrypt = RsaUtils.decryptByPrivateKey(privateKey, accessAuth);
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new SignatureException("Can not find user");
                }
                token = JwtConfig.createToken(decrypt);
                // 添加 request 中的 Header 的 Authorization
                requestWrapper.addHeader("Authorization", token);
            }else if (accessAuth != null && accessAuth.length() < 100){ // 否则就是一个普通的 AccessAuth，直接拿来用
                token = JwtConfig.createToken(accessAuth);
                // 添加 request 中的 Header 的 Authorization
                requestWrapper.addHeader("Authorization", token);
            }
        }
//    if (StringUtils.isEmpty(token)) {
//        token = request.getParameter("token");
//    }

        if (needCheck && !request.getMethod().equals("OPTIONS")) {
            JwtUtil.checkToken(token, jwtConfig);
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(null, null, null);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        // 上面自定义 添加 Header 的 Authorization 后,把新的request 写入Filter
        chain.doFilter(requestWrapper, response);
    }

    private void cros(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Methods", request.getMethod());
        response.setHeader("Access-Control-Allow-Headers",
                request.getHeader("Access-Control-Request-Headers"));
        response.setStatus(HttpStatus.OK.value());
    }

//  private void checkToken(String token, JwtConfig jwtConfig,String uri) {
//    boolean needCheck = true;
//    for (String s : new JwtFilterUrlList().getFilterList()) {
//      if (uri.equals(s)
//              || uri.equals("/camunda-welcome")
//              || uri.contains("/camunda/")
//              || uri.contains("/engine-rest")) {
//        needCheck = false;
//        break;
//      }
//    }
//
//    // todo 暂时关闭
//    if (!StringUtils.isEmpty(token) && needCheck) {
//      SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//      String dateString = formatter.format(jwtConfig.getTokenClaim(token).get("exp").asDate());
//      String username = jwtConfig.getTokenClaim(token).get("username").asString();
//      com.apj.camunda.config.jwt.JwtUtil.setTokenUsername(username); //设置username进内存
//      com.apj.camunda.config.jwt.JwtUtil.setNewToken(jwtConfig.createToken(username));
//      log.info("time: " + dateString);
//      boolean needCheckUser = true;
//      // 排除特定url用户校验
//      for (String s : new JwtFilterUrlList().getIgnoreUserList()) {
//        if (uri.equals(s)) {
//          needCheckUser = false;
//          break;
//        }
//      }
//      // todo 暂时关闭
//      needCheckUser = false;
//      if (needCheckUser) {
//        checkUser(username);
//      }
//    }
//  }

//  private void checkUser(String username) {
//    long count = identityService.createUserQuery().userLastName(username).count();
//    log.info("username[" + username + "] count -> " + count);
//    if (count != 1L) {
//      throw new SignatureException("Can not find user");
//    }
//  }
}
