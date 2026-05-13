package com.wheremoney.modules.account.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@TableName("accounts")
public class AccountEntity {

  @TableId(type = IdType.ASSIGN_ID)
  private Long id;

  private Long userId;
  private String name;
  private String type;
  private String currency;
  private BigDecimal initialBalance;
  private BigDecimal currentBalance;
  private String color;
  private String icon;
  private Integer sortOrder;
  private String status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private LocalDateTime deletedAt;
}
