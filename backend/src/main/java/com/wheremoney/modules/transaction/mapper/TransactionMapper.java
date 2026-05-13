package com.wheremoney.modules.transaction.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wheremoney.modules.transaction.entity.TransactionEntity;
import com.wheremoney.modules.transaction.vo.TransactionView;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface TransactionMapper extends BaseMapper<TransactionEntity> {

  TransactionView selectTransactionViewById(@Param("userId") Long userId, @Param("id") Long id);

  List<TransactionView> selectTransactionViews(
      @Param("userId") Long userId,
      @Param("type") String type,
      @Param("currency") String currency,
      @Param("accountId") Long accountId,
      @Param("categoryId") Long categoryId,
      @Param("startAt") LocalDateTime startAt,
      @Param("endAt") LocalDateTime endAt,
      @Param("limit") long limit,
      @Param("offset") long offset);

  long countTransactionViews(
      @Param("userId") Long userId,
      @Param("type") String type,
      @Param("currency") String currency,
      @Param("accountId") Long accountId,
      @Param("categoryId") Long categoryId,
      @Param("startAt") LocalDateTime startAt,
      @Param("endAt") LocalDateTime endAt);
}
