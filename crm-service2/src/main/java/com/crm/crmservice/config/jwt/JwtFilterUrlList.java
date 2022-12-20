package com.crm.crmservice.config.jwt;

import java.util.ArrayList;
import java.util.List;

/**
 * 不需要token校验的url list.
 */
public class JwtFilterUrlList {

  private List<String> filterList;
  private List<String> ignoreUserList;

  private void setFilterList() {
    this.filterList = new ArrayList<>();
    this.filterList.add("/");
  }

  public List<String> getFilterList() {
    setFilterList();
    return filterList;
  }

  private void setIgnoreUserList() {
    this.ignoreUserList = new ArrayList<>();
    this.ignoreUserList.add("/");
  }

  public List<String> getIgnoreUserList() {
    setIgnoreUserList();
    return ignoreUserList;
  }
}
