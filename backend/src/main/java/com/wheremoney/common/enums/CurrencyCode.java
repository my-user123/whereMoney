package com.wheremoney.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;

public enum CurrencyCode {
  CNY("CNY"),
  USD("USD"),
  EUR("EUR"),
  GBP("GBP"),
  JPY("JPY"),
  HKD("HKD"),
  AUD("AUD"),
  CAD("CAD"),
  SGD("SGD");

  @EnumValue private final String code;

  CurrencyCode(String code) {
    this.code = code;
  }

  public String code() {
    return code;
  }
}
