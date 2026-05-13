package com.wheremoney;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.wheremoney.modules.*.mapper")
public class WhereMoneyApplication {

  public static void main(String[] args) {
    SpringApplication.run(WhereMoneyApplication.class, args);
  }
}
