package com.wheremoney.modules.transaction.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@TableName("transactions")
public class TransactionEntity {

  @TableId(type = IdType.ASSIGN_ID)
  private Long id;

  private Long userId;
  private Long accountId;
  private Long categoryId;
  private String type;
  private BigDecimal amount;
  private String currency;
  private LocalDateTime occurredAt;
  private String note;
  private String source;
  private Long sourceRefId;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private LocalDateTime deletedAt;
}
