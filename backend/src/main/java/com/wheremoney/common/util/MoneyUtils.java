package com.wheremoney.common.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class MoneyUtils {

  private MoneyUtils() {}

  public static String format(BigDecimal value) {
    if (value == null) {
      return "0.00";
    }
    return value.setScale(2, RoundingMode.HALF_UP).toPlainString();
  }
}
