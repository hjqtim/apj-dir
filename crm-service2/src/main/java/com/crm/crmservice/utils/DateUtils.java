package com.crm.crmservice.utils;

import cn.hutool.core.util.StrUtil;
import com.crm.crmservice.common.constant.CommonField;
import org.apache.commons.lang3.time.DateFormatUtils;

import java.lang.management.ManagementFactory;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 时间工具类.
 *
 * @author AngusYang
 * @date 2021-07-14
 */
public class DateUtils extends org.apache.commons.lang3.time.DateUtils {

  private static final String[] parsePatterns = {
      "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm",
      "yyyy-MM", "yyyy/MM/dd", "yyyy/MM/dd HH:mm:ss", "yyyy/MM/dd HH:mm", "yyyy/MM", "yyyy.MM.dd",
      "yyyy.MM.dd HH:mm:ss", "yyyy.MM.dd HH:mm", "yyyy.MM"};
  private static final DateTimeFormatter dateTimeFormatter = new DateTimeFormatterBuilder()
      .appendPattern("yyy-MM-dd[['T'hh][:mm][:ss]]").parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
      .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
      .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
      .parseDefaulting(ChronoField.MILLI_OF_SECOND, 0).toFormatter();
  public static String YYYY = "yyyy";
  public static String YYYY_MM = "yyyy-MM";
  public static String YYYY_MM_DD = "yyyy-MM-dd";
  public static String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";
  public static String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
  private static final String NOW_DATE= "nowDate";
  private static final String BEFORE_DATE= "beforeDate";

  /**
   *
   */
  public static String localDateTimeConverDateStr(LocalDateTime localDateTime, String formateStr){
      DateTimeFormatter dtf = DateTimeFormatter.ofPattern(formateStr);
      return localDateTime.format(dtf);
  }

  /**
   * 获取当前Date型日期.
   *
   * @return Date() 当前日期
   */
  public static Date getNowDate() {
    return new Date();
  }

  /**
   * 获取当前日期, 默认格式为yyyy-MM-dd.
   *
   * @return String
   */
  public static String getDate() {
    return dateTimeNow(YYYY_MM_DD);
  }

  public static final String getTime() {
    return dateTimeNow(YYYY_MM_DD_HH_MM_SS);
  }

  public static final String dateTimeNow() {
    return dateTimeNow(YYYYMMDDHHMMSS);
  }

  public static final String dateTimeNow(final String format) {
    return parseDateToStr(format, new Date());
  }

  public static final String dateTime(final Date date) {
    return parseDateToStr(YYYY_MM_DD, date);
  }

  /**
   * 日期型字符串转化为日期 格式.
   *
   * @param format 格式
   * @param ts     日期型字符串
   * @return 日期
   */
  public static final Date dateTime(final String format, final String ts) {
    try {
      return new SimpleDateFormat(format).parse(ts);
    } catch (ParseException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 日期路径 即年/月/日 如20180808.
   */
  public static final String dateTime() {
    Date now = new Date();
    return DateFormatUtils.format(now, "yyyyMMdd");
  }

  public static final String parseDateToStr(final String format, final Date date) {
    return new SimpleDateFormat(format).format(date);
  }

  /**
   * 日期路径 即年/月/日 如2018/08/08.
   */
  public static final String datePath() {
    Date now = new Date();
    return DateFormatUtils.format(now, "yyyy/MM/dd");
  }

  /**
   * 日期型字符串转化为日期 格式.
   */
  public static Date parseDate(Object str) {
    if (str == null) {
      return null;
    }
    try {
      return parseDate(str.toString(), parsePatterns);
    } catch (ParseException e) {
      return null;
    }
  }

  /**
   * 获取服务器启动时间.
   */
  public static Date getServerStartDate() {
    long time = ManagementFactory.getRuntimeMXBean().getStartTime();
    return new Date(time);
  }

  /**
   * 计算两个时间差.
   */
  public static String getDatePoor(Date endDate, Date nowDate) {
    long nd = 1000 * 24 * 60 * 60L;
    long nh = 1000 * 60 * 60L;
    long nm = 1000 * 60L;
    // 获得两个时间的毫秒时间差异
    long diff = endDate.getTime() - nowDate.getTime();
    // 计算差多少天
    long day = diff / nd;
    // 计算差多少小时
    long hour = diff % nd / nh;
    // 计算差多少分钟
    long min = diff % nd % nh / nm;
    // 计算差多少秒//输出结果
    return day + "天" + hour + "小时" + min + "分钟";
  }

  /**
   * 日期型字符串转化为日期 格式.
   */
  public static LocalDateTime parseLocalDateTime(Object str) {
    if (StrUtil.isBlankOrUndefined((String) str)) {
      return null;
    }
    return LocalDateTime.parse(str.toString(), dateTimeFormatter);
  }

  /**
   * 日期型字符串转化为日期 格式.
   */
  public static LocalDate parseLocalDate(Object str) {
    if (StrUtil.isBlankOrUndefined((String) str)) {
      return null;
    }
    return LocalDate.parse(str.toString(), dateTimeFormatter);
  }

  /**
   * 获取某个月第一天的开始时刻
   * @param month
   * @return
   */
  public static String getFirstDayTimeOfMonth(int month) {
    Calendar cal = Calendar.getInstance();
    // 设置月份
    cal.set(Calendar.MONTH, month - 1);
    // 获取某月最小天数
    int firstDay = cal.getActualMinimum(Calendar.DAY_OF_MONTH);
    // 设置日历中月份的最小天数
    cal.set(Calendar.DAY_OF_MONTH, firstDay);
    // 格式化日期，获取开始时刻
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    return sdf.format(cal.getTime());
  }

  /**
   * 获得某月的最后一天的最后时刻
   * @param month  要获取的月份
   * @return
   */
  public static String getLastDayTimeOfMonth(int month) {
    Calendar cal = Calendar.getInstance();
    // 设置月份
    cal.set(Calendar.MONTH, month - 1);
    // 获取月份的最大天数
    int lastDay = 0;
    //2月份每年的天数不固定
    if (month == 2) {
      lastDay = cal.getLeastMaximum(Calendar.DAY_OF_MONTH);
    } else {
      lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
    }
    // 设置日历中月份的最大天数
    cal.set(Calendar.DAY_OF_MONTH, lastDay);
    // 格式化日期，获取最后时刻
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    return sdf.format(cal.getTime());
  }


  /**
   * 公共方法，获取当前年份和当前季度
   * @return
   */
  public static Map<String,String> getNewData(){
    LocalDateTime data = LocalDateTime.now();
    String year = String.valueOf(data.getYear());
    int monthValue = data.getMonthValue();
    String start_time = "";
    String end_time = "";
    if (monthValue >= 1 && monthValue <= 3) {
      start_time = getFirstDayTimeOfMonth(1);
      end_time = getLastDayTimeOfMonth(3);
    } else if (monthValue > 3 && monthValue <= 6) {
      start_time = getFirstDayTimeOfMonth(4);
      end_time = getLastDayTimeOfMonth(6);
    } else if (monthValue > 6 && monthValue <= 9) {
      start_time = getFirstDayTimeOfMonth(7);
      end_time = getLastDayTimeOfMonth(9);
    } else {
      start_time = getFirstDayTimeOfMonth(10);
      end_time = getLastDayTimeOfMonth(12);
    }
    Map<String,String> map = new HashMap<>();
    map.put(CommonField.YEAR,year);
    map.put(CommonField.START_TIME,start_time);
    map.put(CommonField.END_TIME,end_time);
    return map;
  }

  /**
   * 获取本周星期一 到 星期日 的具体日期
   * @return
   */
  public static Map<String,String> getWeekDate(){
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    Calendar cal = Calendar.getInstance();
    //设置一个星期的第一天，按中国的习惯一个星期的第一天是星期一
    cal.setFirstDayOfWeek(Calendar.MONDAY);
    //获得当前日期是一个星期的第几天
    int dayWeek = cal.get(Calendar.DAY_OF_WEEK);
    if(dayWeek==1){
      dayWeek = 8;
    }

    // 根据日历的规则，给当前日期减去星期几与一个星期第一天的差值
    cal.add(Calendar.DATE, cal.getFirstDayOfWeek() - dayWeek);
    Date mondayDate = cal.getTime();
    String weekBegin = sdf.format(mondayDate);


    cal.add(Calendar.DATE, 4 +cal.getFirstDayOfWeek());
    Date sundayDate = cal.getTime();
    String weekEnd = sdf.format(sundayDate);

    Map<String,String> map = new HashMap<>();
    map.put("weekBegin",weekBegin);
    map.put("weekEnd",weekEnd);
    return map;
  }

  /**
   * Comparison of two times
   * @param compareTime date 1
   * @param nowTime date 2
   * @return true=date 2 bigger,false=date 1 bigger
   */
  public static boolean checkNowTimeCompareTradeTime(LocalDateTime compareTime, LocalDateTime nowTime) {
    return nowTime.compareTo(compareTime) > 0;
  }

  public static Map<String,String> getDateTime(long interval){
    Map<String,String> timeMap = new HashMap<>();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date now = new Date();
    long time = interval * 60 * 1000;
    Date beforeDate = new Date(now.getTime() - time);
    timeMap.put(NOW_DATE,sdf.format(now.getTime()+60000));
    timeMap.put(BEFORE_DATE,sdf.format(beforeDate));
    return timeMap;
  }

  public static Map<String,String> getRollTime(){
    Map<String,String> map = new HashMap<>();

    Calendar now=Calendar.getInstance();
    now.roll(Calendar.MINUTE,30);
    SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    long time = System.currentTimeMillis();
    //当前时间
    String nowTime = sdf.format(time);
    //前半小时时间
    String rollTime=sdf.format(now.getTimeInMillis());
    map.put("nowTime",nowTime);
    map.put("rollTime",rollTime);
    return map;
  }

}
