package com.crm.crmservice.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class EncryptUtils {
    private static final Logger logger = LoggerFactory.getLogger(EncryptUtils.class);

    public static final String SECRET_KEY = "aaaabbbbccccdddd";

    public static final String RSA_PUBLIC_KEY = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK2yXh8kKtpQeJM0EmBrxHTB4oPF58rTqw9zx71IL84KKfIGDdfJAw2p/Ay4BujRoAkzn7PivT41OOeNlWYO610CAwEAAQ==";
    public static final String RSA_PRIVATE_KEY = "MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEArbJeHyQq2lB4kzQSYGvEdMHig8XnytOrD3PHvUgvzgop8gYN18kDDan8DLgG6NGgCTOfs+K9PjU4542VZg7rXQIDAQABAkEAhgHw/9Glhh1DiT5JVz6NqQ7UtZmARUmc1iUbWvtQdoK1jLl9SfHLYKk9mpHy9tPOhfrK7uGOh9FyEgJ41j2MeQIhAOuVBKbdXrAKEu4vvSD0P4ln0TGLu2uSewqXQnVrs97DAiEAvMBEZaJfcSrgYvmHLbnN9SoZ/jvbTgS3XcxOWdNBq18CIGS0M+Pct3BLLiJxd8iRgGONZIhocfqfCEfTtw4YtzAfAiEAtdAeEihN9xxt9+iUJZ+MnFNpplLR9FzmpBtgfXXZE9ECIDEeahlOF0gb9IyMNno4KLDkeRgR8HCq88rkEThVzcOH";

    /**
     * AES解密
     * @param encryptStr 密文
     * @param decryptKey 秘钥，必须为16个字符组成
     * @return 明文
     */
    public static String aesDecrypt(String encryptStr, String decryptKey) {
        if (StringUtils.isEmpty(encryptStr) || StringUtils.isEmpty(decryptKey)) {
            return null;
        }
        String result = null;
        try {
            byte[] encryptByte = Base64.getDecoder().decode(encryptStr);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(decryptKey.getBytes(), "AES"));
            byte[] decryptBytes = cipher.doFinal(encryptByte);
            result = new String(decryptBytes);
        } catch (Exception e) {
            logger.error(e.getMessage());
            e.printStackTrace();
        }
        return result;

    }

    /**
     * AES加密
     * @param content 明文
     * @param encryptKey 秘钥，必须为16个字符组成
     * @return 密文
     */
    public static String aesEncrypt(String content, String encryptKey) {
        if (StringUtils.isEmpty(content) || StringUtils.isEmpty(encryptKey)) {
            return null;
        }
        String result = null;
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(encryptKey.getBytes(), "AES"));

            byte[] encryptStr = cipher.doFinal(content.getBytes(StandardCharsets.UTF_8));
            result = Base64.getEncoder().encodeToString(encryptStr);
        } catch (Exception e) {
            logger.error(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 随机生成密钥对
     */
    public static Map<Integer, String> genKeyPair() {
        Map<Integer, String> keyMap = new HashMap<>();
        try {
            // KeyPairGenerator类用于生成公钥和私钥对，基于RSA算法生成对象
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
            // 初始化密钥对生成器，密钥大小为96-1024位
            keyPairGen.initialize(512, new SecureRandom());
            // 生成一个密钥对，保存在keyPair中
            KeyPair keyPair = keyPairGen.generateKeyPair();
            RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();   // 得到私钥
            RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();  // 得到公钥
            String publicKeyString = new String(org.apache.commons.codec.binary.Base64.encodeBase64(publicKey.getEncoded()));
            // 得到私钥字符串
            String privateKeyString = new String(org.apache.commons.codec.binary.Base64.encodeBase64((privateKey.getEncoded())));
            // 将公钥和私钥保存到Map
            keyMap.put(0, publicKeyString);  //0表示公钥
            keyMap.put(1, privateKeyString);  //1表示私钥
        } catch (NoSuchAlgorithmException e) {
            logger.error(e.getMessage(), e);
        }
        return keyMap;
    }

    /**
     * RSA公钥加密
     *
     * @param str       加密字符串
     * @param publicKey 公钥
     * @return 密文
     * @throws Exception 加密过程中的异常信息
     */
    public static String rsaEncrypt(String str, String publicKey) {
        String outStr = null;
        try {
            //base64编码的公钥
            byte[] decoded = org.apache.commons.codec.binary.Base64.decodeBase64(publicKey);
            RSAPublicKey pubKey = (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
            //RSA加密
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, pubKey);
            outStr = org.apache.commons.codec.binary.Base64.encodeBase64String(cipher.doFinal(str.getBytes("UTF-8")));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return outStr;
    }

    /**
     * RSA私钥解密
     *
     * @param str        加密字符串
     * @param privateKey 私钥
     * @return 铭文
     */
    public static String rsaDecrypt(String str, String privateKey) {
        String outStr = null;
        try {
            //64位解码加密后的字符串
            byte[] inputByte = org.apache.commons.codec.binary.Base64.decodeBase64(str.getBytes("UTF-8"));
            //base64编码的私钥
            byte[] decoded = org.apache.commons.codec.binary.Base64.decodeBase64(privateKey);
            RSAPrivateKey priKey = (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
            //RSA解密
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, priKey);
            outStr = new String(cipher.doFinal(inputByte));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return outStr;
    }
}
