package com.crm.crmservice.config;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 读取项目相关配置.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@Component
@ConfigurationProperties(prefix = "magpie")
public class MagpieConfig {

  /**
   * 上传路径.
   */
  private static String profile;
  /**
   * 获取地址开关.
   */
  private static boolean addressEnabled;
  /**
   * 项目名称.
   */
  private String name;
  /**
   * 版本.
   */
  private String version;
  /**
   * 版权年份.
   */
  private String copyrightYear;
  /**
   * 实例演示开关.
   */
  private boolean demoEnabled;

  public static String getProfile() {
    return profile;
  }

  public void setProfile(String profile) {
    MagpieConfig.profile = profile;
  }

  public static boolean isAddressEnabled() {
    return addressEnabled;
  }

  public void setAddressEnabled(boolean addressEnabled) {
    MagpieConfig.addressEnabled = addressEnabled;
  }

  /**
   * 获取头像上传路径.
   */
  public static String getAvatarPath() {
    return getProfile() + "/avatar";
  }

  /**
   * 获取下载路径.
   */
  public static String getDownloadPath() {
    return getProfile() + "/download/";
  }

  /**
   * 获取上传路径.
   */
  public static String getUploadPath() {
    return getProfile() + "/upload";
  }
}
