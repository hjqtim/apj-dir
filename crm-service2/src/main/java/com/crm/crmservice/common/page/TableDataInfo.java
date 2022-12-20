package com.crm.crmservice.common.page;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * 表格分页数据对象.
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class TableDataInfo implements Serializable {

  private static final long serialVersionUID = -1602821438443426829L;

  /**
   * 总记录数.
   */
  private long total;

  /**
   * 列表数据.
   */
  private List<?> rows;

  /**
   * 消息状态码.
   */
  private int code;

  /**
   * 消息内容.
   */
  private String msg;

  /**
   * 分页.
   *
   * @param list  列表数据
   * @param total 总记录数
   */
  public TableDataInfo(List<?> list, int total) {
    this.rows = list;
    this.total = total;
  }

  public TableDataInfo(){}
}
