package com.crm.crmservice.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataVo<T> {
  public List<T> rows;
  public long count;
  private Boolean success;
  public List<T> data;

  public DataVo(List<T> rows, long count) {
    this.count = count;
    this.rows = rows;
  }

  public DataVo(boolean status,List<T> data){
    this.success = status;
    this.data = data;
  }
}
