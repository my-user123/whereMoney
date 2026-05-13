package com.wheremoney.modules.transaction.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wheremoney.modules.transaction.entity.TransactionEntity;
import com.wheremoney.modules.transaction.vo.TransactionView;
import java.time.LocalDateTime;
import org.apache.ibatis.annotations.Param;

public interface TransactionMapper extends BaseMapper<TransactionEntity> {

  TransactionView selectTransactionViewById(@Param("userId") Long userId, @Param("id") Long id);

  IPage<TransactionView> selectTransactionViews(
      Page<TransactionView> page,
      @Param("userId") Long userId,
      @Param("type") String type,
      @Param("currency") String currency,
      @Param("accountId") Long accountId,
      @Param("categoryId") Long categoryId,
      @Param("startAt") LocalDateTime startAt,
      @Param("endAt") LocalDateTime endAt);
}
