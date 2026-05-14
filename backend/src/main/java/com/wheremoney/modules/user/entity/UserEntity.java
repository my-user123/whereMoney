package com.wheremoney.modules.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@TableName("users")
public class UserEntity {

  @TableId(type = IdType.ASSIGN_ID)
  private Long id;

  private String email;
  private String username;
  private String password;
  private String status;
  private Boolean isNewUserFirstLogin;
  private LocalDateTime lastLoginAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private LocalDateTime deletedAt;
}
