package com.wheremoney.modules.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.wheremoney.common.enums.CurrencyCode;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@TableName("user_profiles")
public class UserProfileEntity {

  @TableId(type = IdType.ASSIGN_ID)
  private Long id;

  private Long userId;
  private String nickname;
  private String avatarUrl;
  private CurrencyCode defaultCurrency;
  private String userType;
  private String timezone;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
