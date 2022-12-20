package com.crm.crmservice.controller.email;

import cn.hutool.core.date.DateUtil;
import com.crm.crmservice.utils.ResponseBuilder;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author Ethan Li
 * @since 2022-12-12
 */
@RestController
@RequestMapping("/emailLog")
public class EmailLogController {


    private static final String TCB = "barryli@apjcorp.com";
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String defaultFrom;


    @ApiOperation("Test 11")
    @GetMapping("/test11")
    public Map<String, Object> test11() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(defaultFrom);
        message.setTo(TCB);
        message.setCc(TCB);
        message.setBcc(TCB);
        message.setSubject("test11");
        message.setText("我的测试" + DateUtil.now());
        javaMailSender.send(message);
        return ResponseBuilder.ok();
    }

}

