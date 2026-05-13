# API 设计文档

## 1. 设计范围

本文档基于《项目需求分析文档.md》《docs/数据库设计.md》《docs/系统架构/08-API设计原则.md》《docs/系统架构/11-实时通信设计.md》设计第一阶段 REST API 草案。

第一阶段 API 覆盖单人个人记账、账户、分类、预算、储蓄目标、周期账单提醒、统计可视化、AI 自然语言记账、AI 分析、AI 问答、站内通知和月报导出。

第一阶段不设计信用卡、账户间转账、退款、报销、借入借出、家庭共享账本、账单导入、OCR、资产负债管理和后台管理员 API。

## 2. API 基础规范

### 2.1 基础路径

```text
/api/v1
```

### 2.2 认证方式

需要登录的接口使用 JWT：

```text
Authorization: Bearer <token>
```

### 2.3 统一响应

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 2.4 分页响应

```json
{
  "total": 100,
  "page": 1,
  "size": 20,
  "list": []
}
```

### 2.5 通用错误方向

| code | 含义 |
| --- | --- |
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或登录过期 |
| 403 | 无权访问资源 |
| 404 | 资源不存在 |
| 409 | 状态冲突或重复操作 |
| 422 | 业务校验失败 |
| 500 | 系统异常 |

业务实现时可在此基础上扩展更细的数字业务码。

### 2.6 Phase 0 已锁定业务错误码

| code | 含义 |
| --- | --- |
| 10001 | 用户名已存在 |
| 10002 | 用户名或密码错误 |
| 20001 | 账户不存在、不可用或不属于当前用户 |
| 20002 | 分类不存在、不可用或不属于当前用户 |
| 30001 | 账单不存在或不属于当前用户 |
| 30002 | 账单币种与账户币种不一致 |
| 40001 | 预算不存在或不属于当前用户 |
| 50001 | 周期提醒实例状态不可确认 |
| 60001 | AI 解析失败 |
| 60002 | AI 报告生成失败 |
| 70001 | 导出任务不存在或不属于当前用户 |
| 70002 | 导出文件尚未生成或已过期 |
| 90001 | 无权访问资源 |

说明：Phase 0 锁定业务码方向；实现时按当前阶段已落地资源逐步补齐，不要求未进入实现阶段的模块提前写业务代码。

## 3. 通用数据类型

### 3.1 枚举

```text
AccountType: CASH | BANK_CARD | WECHAT | ALIPAY | OTHER
TransactionType: INCOME | EXPENSE
TransactionSource: MANUAL | AI_CONFIRMED | RECURRING_CONFIRMED
CategoryType: INCOME | EXPENSE
BudgetPeriodType: WEEKLY | MONTHLY | YEARLY | CUSTOM
RecurringFrequency: DAILY | WEEKLY | MONTHLY | YEARLY | CUSTOM
TaskStatus: PENDING | PROCESSING | SUCCESS | FAILED | CANCELED
ReportValidityStatus: VALID | STALE | DELETED
ExportType: EXCEL | PDF
```

### 3.2 金额

金额字段使用字符串承载十进制数，避免前端浮点精度问题。

```json
{
  "amount": "128.50",
  "currency": "CNY"
}
```

### 3.3 时间

日期使用 `YYYY-MM-DD`，时间使用 ISO 8601 字符串。

## 4. 认证与用户 API

### 4.1 注册

```text
POST /api/v1/auth/register
```

请求：

```json
{
  "username": "user001",
  "password": "password",
  "nickname": "小明",
  "defaultCurrency": "CNY"
}
```

响应：

```json
{
  "token": "jwt-token",
  "user": {
    "id": "1",
    "username": "user001",
    "nickname": "小明",
    "defaultCurrency": "CNY"
  }
}
```

### 4.2 登录

```text
POST /api/v1/auth/login
```

请求：

```json
{
  "username": "user001",
  "password": "password"
}
```

响应同注册。

### 4.3 获取当前用户

```text
GET /api/v1/users/me
```

响应：

```json
{
  "id": "1",
  "username": "user001",
  "nickname": "小明",
  "avatarUrl": "",
  "defaultCurrency": "CNY",
  "userType": "OFFICE_WORKER",
  "timezone": "Asia/Shanghai"
}
```

### 4.4 更新当前用户资料

```text
PUT /api/v1/users/me/profile
```

请求：

```json
{
  "nickname": "小明",
  "avatarUrl": "",
  "defaultCurrency": "CNY",
  "userType": "OFFICE_WORKER",
  "timezone": "Asia/Shanghai"
}
```

## 5. 账户 API

### 5.1 账户列表

```text
GET /api/v1/accounts?status=ACTIVE
```

响应项：

```json
{
  "id": "1001",
  "name": "招商银行卡",
  "type": "BANK_CARD",
  "currency": "CNY",
  "initialBalance": "1000.00",
  "currentBalance": "2580.30",
  "color": "#2F80ED",
  "icon": "bank-card",
  "status": "ACTIVE"
}
```

### 5.2 创建账户

```text
POST /api/v1/accounts
```

请求：

```json
{
  "name": "微信钱包",
  "type": "WECHAT",
  "currency": "CNY",
  "initialBalance": "500.00",
  "color": "#22C55E",
  "icon": "wallet"
}
```

### 5.3 更新账户

```text
PUT /api/v1/accounts/{accountId}
```

请求同创建账户。响应同账户列表项。

### 5.4 账户详情

```text
GET /api/v1/accounts/{accountId}
```

响应同账户列表项。

### 5.5 归档账户

```text
PATCH /api/v1/accounts/{accountId}/archive
```

说明：归档账户不删除历史账单，但默认不作为新建账单可选项。

## 6. 分类 API

### 6.1 分类列表

```text
GET /api/v1/categories?type=EXPENSE&status=ACTIVE
```

响应项：

```json
{
  "id": "2001",
  "name": "餐饮",
  "type": "EXPENSE",
  "icon": "utensils",
  "color": "#F97316",
  "isSystem": true,
  "status": "ACTIVE"
}
```

### 6.2 创建分类

```text
POST /api/v1/categories
```

请求：

```json
{
  "name": "咖啡",
  "type": "EXPENSE",
  "icon": "coffee",
  "color": "#A16207"
}
```

### 6.3 更新分类

```text
PUT /api/v1/categories/{categoryId}
```

请求同创建分类。响应同分类列表项。

### 6.4 分类详情

```text
GET /api/v1/categories/{categoryId}
```

响应同分类列表项。

### 6.5 停用分类

```text
PATCH /api/v1/categories/{categoryId}/disable
```

## 7. 账单 API

### 7.1 账单分页列表

```text
GET /api/v1/transactions?page=1&size=20&type=EXPENSE&currency=CNY&accountId=1001&categoryId=2001&startDate=2026-05-01&endDate=2026-05-31
```

响应项：

```json
{
  "id": "3001",
  "type": "EXPENSE",
  "amount": "28.00",
  "currency": "CNY",
  "occurredAt": "2026-05-13T12:20:00+08:00",
  "account": {
    "id": "1001",
    "name": "微信钱包"
  },
  "category": {
    "id": "2001",
    "name": "餐饮",
    "icon": "utensils",
    "color": "#F97316"
  },
  "note": "午餐",
  "source": "MANUAL"
}
```

### 7.2 账单详情

```text
GET /api/v1/transactions/{transactionId}
```

### 7.3 创建账单

```text
POST /api/v1/transactions
```

请求：

```json
{
  "type": "EXPENSE",
  "amount": "28.00",
  "currency": "CNY",
  "accountId": "1001",
  "categoryId": "2001",
  "occurredAt": "2026-05-13T12:20:00+08:00",
  "note": "午餐"
}
```

说明：该接口用于手动记账。AI 解析或周期提醒确认入账有独立确认接口。

### 7.4 更新账单

```text
PUT /api/v1/transactions/{transactionId}
```

### 7.5 删除账单

```text
DELETE /api/v1/transactions/{transactionId}
```

说明：删除后需要回滚账户余额，相关统计缓存失效，受影响 AI 报告删除或标记失效。

## 8. 预算 API

### 8.1 预算列表

```text
GET /api/v1/budgets?status=ACTIVE&periodType=MONTHLY
```

响应项：

```json
{
  "id": "4001",
  "name": "本月餐饮预算",
  "periodType": "MONTHLY",
  "startDate": "2026-05-01",
  "endDate": "2026-05-31",
  "amount": "1500.00",
  "currency": "CNY",
  "categoryId": "2001",
  "categoryName": "餐饮",
  "warningThreshold": 0.8,
  "usedAmount": "860.00",
  "usageRate": 0.5733,
  "status": "ACTIVE"
}
```

### 8.2 创建预算

```text
POST /api/v1/budgets
```

请求：

```json
{
  "name": "本月总预算",
  "periodType": "MONTHLY",
  "startDate": "2026-05-01",
  "endDate": "2026-05-31",
  "amount": "5000.00",
  "currency": "CNY",
  "categoryId": null,
  "warningThreshold": 0.8
}
```

### 8.3 更新预算

```text
PUT /api/v1/budgets/{budgetId}
```

请求同创建预算。响应同预算列表项。

### 8.4 预算详情

```text
GET /api/v1/budgets/{budgetId}
```

响应同预算列表项。

### 8.5 删除预算

```text
DELETE /api/v1/budgets/{budgetId}
```

### 8.6 预算执行详情

```text
GET /api/v1/budgets/{budgetId}/usage
```

响应：

```json
{
  "budgetId": "4001",
  "amount": "1500.00",
  "usedAmount": "860.00",
  "remainingAmount": "640.00",
  "usageRate": 0.5733,
  "currency": "CNY",
  "status": "ACTIVE",
  "categoryBreakdown": []
}
```

## 9. 储蓄目标 API

### 9.1 储蓄目标列表

```text
GET /api/v1/saving-goals?status=ACTIVE
```

响应项：

```json
{
  "id": "5001",
  "name": "半年存 2 万",
  "targetAmount": "20000.00",
  "currency": "CNY",
  "startDate": "2026-05-01",
  "targetDate": "2026-10-31",
  "currentAmount": "3200.00",
  "progressRate": 0.16,
  "status": "ACTIVE"
}
```

### 9.2 创建储蓄目标

```text
POST /api/v1/saving-goals
```

### 9.3 更新储蓄目标

```text
PUT /api/v1/saving-goals/{goalId}
```

请求同创建储蓄目标。响应同储蓄目标列表项。

### 9.4 储蓄目标详情

```text
GET /api/v1/saving-goals/{goalId}
```

响应同储蓄目标列表项。

### 9.5 删除储蓄目标

```text
DELETE /api/v1/saving-goals/{goalId}
```

## 10. 周期账单提醒 API

### 10.1 提醒规则列表

```text
GET /api/v1/recurring-bill-reminders?status=ACTIVE
```

响应项：

```json
{
  "id": "6001",
  "name": "房租",
  "transactionType": "EXPENSE",
  "amount": "2500.00",
  "currency": "CNY",
  "accountId": "1001",
  "accountName": "招商银行卡",
  "categoryId": "2002",
  "categoryName": "住房",
  "frequency": "MONTHLY",
  "ruleConfig": {
    "dayOfMonth": 5
  },
  "nextOccurrenceDate": "2026-06-05",
  "remindBeforeDays": 1,
  "nextRemindAt": "2026-06-04T09:00:00+08:00",
  "status": "ACTIVE"
}
```

### 10.2 创建提醒规则

```text
POST /api/v1/recurring-bill-reminders
```

请求：

```json
{
  "name": "房租",
  "transactionType": "EXPENSE",
  "amount": "2500.00",
  "currency": "CNY",
  "accountId": "1001",
  "categoryId": "2002",
  "frequency": "MONTHLY",
  "ruleConfig": {
    "dayOfMonth": 5
  },
  "nextOccurrenceDate": "2026-06-05",
  "remindBeforeDays": 1
}
```

### 10.3 更新提醒规则

```text
PUT /api/v1/recurring-bill-reminders/{reminderId}
```

请求同创建提醒规则。响应同提醒规则列表项。

### 10.4 提醒规则详情

```text
GET /api/v1/recurring-bill-reminders/{reminderId}
```

响应同提醒规则列表项。

### 10.5 关闭提醒规则

```text
PATCH /api/v1/recurring-bill-reminders/{reminderId}/disable
```

### 10.6 到期提醒实例列表

```text
GET /api/v1/recurring-bill-instances?status=NOTIFIED&page=1&size=20
```

响应项：

```json
{
  "id": "6101",
  "reminderId": "6001",
  "name": "房租",
  "transactionType": "EXPENSE",
  "amount": "2500.00",
  "currency": "CNY",
  "accountId": "1001",
  "accountName": "招商银行卡",
  "categoryId": "2002",
  "categoryName": "住房",
  "scheduledDate": "2026-06-05",
  "status": "NOTIFIED",
  "transactionId": null
}
```

### 10.7 确认周期账单入账

```text
POST /api/v1/recurring-bill-instances/{instanceId}/confirm
```

请求：

```json
{
  "amount": "2500.00",
  "currency": "CNY",
  "accountId": "1001",
  "categoryId": "2002",
  "occurredAt": "2026-06-05T09:00:00+08:00",
  "note": "6 月房租"
}
```

响应：

```json
{
  "transactionId": "3009"
}
```

### 10.8 跳过本次提醒

```text
POST /api/v1/recurring-bill-instances/{instanceId}/skip
```

## 11. 统计与仪表盘 API

### 11.1 首页仪表盘

```text
GET /api/v1/analytics/dashboard?periodStart=2026-05-01&periodEnd=2026-05-31
```

响应方向：

```json
{
  "currencies": ["CNY", "USD"],
  "summaryByCurrency": [
    {
      "currency": "CNY",
      "incomeAmount": "12000.00",
      "expenseAmount": "6500.00",
      "balanceAmount": "5500.00",
      "savingRate": 0.4583
    }
  ],
  "budgetHighlights": [
    {
      "id": "4001",
      "name": "本月餐饮预算",
      "periodType": "MONTHLY",
      "amount": "1500.00",
      "usedAmount": "860.00",
      "usageRate": 0.5733,
      "currency": "CNY",
      "status": "ACTIVE"
    }
  ],
  "savingGoalHighlights": [
    {
      "id": "5001",
      "name": "半年存 2 万",
      "targetAmount": "20000.00",
      "currentAmount": "3200.00",
      "progressRate": 0.16,
      "currency": "CNY",
      "status": "ACTIVE"
    }
  ],
  "recentTransactions": [
    {
      "id": "3001",
      "type": "EXPENSE",
      "amount": "28.00",
      "currency": "CNY",
      "occurredAt": "2026-05-13T12:20:00+08:00",
      "account": {
        "id": "1001",
        "name": "微信钱包"
      },
      "category": {
        "id": "2001",
        "name": "餐饮",
        "icon": "utensils",
        "color": "#F97316"
      },
      "note": "午餐",
      "source": "MANUAL"
    }
  ],
  "aiInsightSummary": "本月餐饮支出占比较高。"
}
```

### 11.2 收支趋势

```text
GET /api/v1/analytics/trends?periodStart=2026-05-01&periodEnd=2026-05-31&groupBy=DAY&currency=CNY
```

响应项：

```json
{
  "groupKey": "2026-05-13",
  "currency": "CNY",
  "incomeAmount": "500.00",
  "expenseAmount": "128.50",
  "balanceAmount": "371.50"
}
```

### 11.3 分类占比

```text
GET /api/v1/analytics/category-shares?type=EXPENSE&periodStart=2026-05-01&periodEnd=2026-05-31&currency=CNY
```

响应项：

```json
{
  "categoryId": "2001",
  "categoryName": "餐饮",
  "icon": "utensils",
  "color": "#F97316",
  "amount": "860.00",
  "percent": 0.32,
  "currency": "CNY"
}
```

### 11.4 消费热力图

```text
GET /api/v1/analytics/heatmap?periodStart=2026-05-01&periodEnd=2026-05-31&currency=CNY
```

响应项：

```json
{
  "date": "2026-05-13",
  "amount": "128.50",
  "count": 3,
  "level": 2,
  "currency": "CNY"
}
```

### 11.5 分类排行

```text
GET /api/v1/analytics/category-rankings?type=EXPENSE&periodStart=2026-05-01&periodEnd=2026-05-31&currency=CNY
```

响应项：

```json
{
  "rank": 1,
  "categoryId": "2001",
  "categoryName": "餐饮",
  "amount": "860.00",
  "percent": 0.32,
  "transactionCount": 18,
  "currency": "CNY"
}
```

说明：多币种统计默认按指定币种展示；不传币种时可按币种分组返回。

## 12. AI API

### 12.1 自然语言记账解析

```text
POST /api/v1/ai/transaction-parses
```

请求：

```json
{
  "text": "今天中午用微信花了 28 元吃饭"
}
```

响应：

```json
{
  "parseRecordId": "7001",
  "candidate": {
    "type": "EXPENSE",
    "amount": "28.00",
    "currency": "CNY",
    "accountId": "1002",
    "categoryId": "2001",
    "occurredAt": "2026-05-13T12:00:00+08:00",
    "note": "午餐",
    "confidence": 0.91
  },
  "riskNotice": "AI 解析结果仅供辅助，请确认金额、账户、分类和时间后再入账。"
}
```

### 12.2 确认 AI 解析入账

```text
POST /api/v1/ai/transaction-parses/{parseRecordId}/confirm
```

请求：

```json
{
  "type": "EXPENSE",
  "amount": "28.00",
  "currency": "CNY",
  "accountId": "1002",
  "categoryId": "2001",
  "occurredAt": "2026-05-13T12:00:00+08:00",
  "note": "午餐"
}
```

响应：

```json
{
  "transactionId": "3001"
}
```

### 12.3 创建 AI 分析报告任务

```text
POST /api/v1/ai/reports
```

请求：

```json
{
  "reportType": "MONTHLY_SUMMARY",
  "periodStart": "2026-05-01",
  "periodEnd": "2026-05-31",
  "currency": "CNY"
}
```

响应：

```json
{
  "reportId": "7101",
  "status": "PENDING"
}
```

说明：Phase 0 锁定 v1 不返回百分比进度；前端仅根据 `status` 展示任务状态。

### 12.4 AI 报告详情

```text
GET /api/v1/ai/reports/{reportId}
```

响应方向：

```json
{
  "id": "7101",
  "reportType": "MONTHLY_SUMMARY",
  "periodStart": "2026-05-01",
  "periodEnd": "2026-05-31",
  "status": "SUCCESS",
  "validityStatus": "VALID",
  "content": "## 本月总结\n\n本月支出主要集中在餐饮和交通。",
  "riskNotice": "本报告仅供个人财务管理参考，不构成投资、贷款、保险或其他专业金融建议。",
  "generatedAt": "2026-05-13T14:30:00+08:00"
}
```

### 12.5 AI 报告列表

```text
GET /api/v1/ai/reports?reportType=MONTHLY_SUMMARY&page=1&size=20
```

### 12.6 删除 AI 报告

```text
DELETE /api/v1/ai/reports/{reportId}
```

### 12.7 AI 财务问答

```text
POST /api/v1/ai/chat-records
```

请求：

```json
{
  "question": "我这个月哪里花多了？",
  "periodStart": "2026-05-01",
  "periodEnd": "2026-05-31",
  "currency": "CNY"
}
```

响应：

```json
{
  "chatRecordId": "7201",
  "answer": "",
  "contextScope": {
    "periodStart": "2026-05-01",
    "periodEnd": "2026-05-31",
    "currency": "CNY"
  },
  "riskNotice": "AI 回答仅供个人财务管理参考。"
}
```

### 12.8 AI 问答历史

```text
GET /api/v1/ai/chat-records?page=1&size=20
```

### 12.9 删除 AI 问答记录

```text
DELETE /api/v1/ai/chat-records/{chatRecordId}
```

## 13. 通知 API

### 13.1 通知分页列表

```text
GET /api/v1/notifications?page=1&size=20&read=false&type=RECURRING_BILL
```

响应项：

```json
{
  "id": "9001",
  "type": "RECURRING_BILL",
  "title": "房租即将到期",
  "content": "房租提醒将在 2026-06-05 到期，请确认是否入账。",
  "relatedType": "RECURRING_BILL_INSTANCE",
  "relatedId": "6101",
  "read": false,
  "readAt": null,
  "createdAt": "2026-06-04T09:00:00+08:00"
}
```

### 13.2 未读通知数量

```text
GET /api/v1/notifications/unread-count
```

响应：

```json
{
  "count": 5
}
```

### 13.3 标记单条已读

```text
PATCH /api/v1/notifications/{notificationId}/read
```

### 13.4 全部标记已读

```text
PATCH /api/v1/notifications/read-all
```

### 13.5 删除通知

```text
DELETE /api/v1/notifications/{notificationId}
```

## 14. 月报导出 API

### 14.1 创建导出任务

```text
POST /api/v1/export-records
```

请求：

```json
{
  "exportType": "PDF",
  "periodStart": "2026-05-01",
  "periodEnd": "2026-05-31",
  "currency": "CNY",
  "includeAiSummary": true
}
```

响应：

```json
{
  "exportRecordId": "8001",
  "status": "PENDING"
}
```

说明：Phase 0 锁定 v1 不返回百分比进度；导出任务列表和详情仅展示 `PENDING`、`PROCESSING`、`SUCCESS`、`FAILED` 等状态。

### 14.2 导出记录列表

```text
GET /api/v1/export-records?page=1&size=20&status=SUCCESS
```

响应项：

```json
{
  "id": "8001",
  "exportType": "PDF",
  "periodStart": "2026-05-01",
  "periodEnd": "2026-05-31",
  "status": "SUCCESS",
  "fileName": "2026-05月报.pdf",
  "errorMessage": null,
  "generatedAt": "2026-05-31T23:10:00+08:00",
  "expiresAt": "2026-06-30T23:59:59+08:00",
  "createdAt": "2026-05-31T23:00:00+08:00"
}
```

### 14.3 导出记录详情

```text
GET /api/v1/export-records/{exportRecordId}
```

### 14.4 下载导出文件

```text
GET /api/v1/export-records/{exportRecordId}/download
```

说明：后端必须校验文件归属和导出状态。只有 `SUCCESS` 状态允许下载。

### 14.5 删除导出记录

```text
DELETE /api/v1/export-records/{exportRecordId}
```

## 15. WebSocket 与 REST 边界

### 15.1 v1 结论

v1 暂不强制实现 WebSocket。AI 报告、导出任务和通知状态通过 REST 查询或短轮询实现。

### 15.2 REST 负责的内容

1. 登录、用户资料、账户、分类、账单、预算、储蓄目标、周期提醒等核心业务写入。
2. AI 解析确认入账。
3. AI 报告任务创建和报告查询。
4. 导出任务创建、状态查询和文件下载。
5. 通知列表、已读和删除。
6. 仪表盘与统计图表数据查询。

### 15.3 后续 WebSocket 事件边界

后续如果启用 WebSocket，事件只用于推送状态变化，不替代 REST API。

预留事件方向：

| 事件 | 触发场景 | 前端处理 |
| --- | --- | --- |
| notification.created | 生成站内通知 | 刷新未读数量或通知列表 |
| ai_report.updated | AI 报告状态变化 | 查询报告详情 |
| export_record.updated | 导出任务状态变化 | 查询导出详情 |
| dashboard.refresh_required | 账单变化影响仪表盘 | 重新拉取 dashboard API |
| recurring_bill.notified | 周期账单到期 | 查询提醒实例列表 |

### 15.4 断线降级

如果后续启用 WebSocket，断线后前端应回退为 REST 查询或短轮询。站内通知是所有实时消息的离线兜底。

## 16. 权限与安全要求

1. 所有登录后接口必须从 JWT 中获取当前用户 ID。
2. 所有资源详情、修改、删除必须校验资源归属。
3. 任何接口都不允许通过传入 `userId` 访问其他用户数据。
4. AI 问答和分析只能读取当前用户授权范围内的数据。
5. 导出文件下载必须校验导出记录归属。
6. 日志不应输出 token、密码、完整账单备注和 AI 敏感上下文。

## 17. Phase 0 契约锁定结论

1. 账户币种与账单币种：v1 强制一致。前端选择账户后带出币种；后端最终校验，不接收跨币种入账。
2. AI 报告内容格式：v1 使用 Markdown 字符串，`riskNotice` 单独字段。
3. Dashboard、图表、周期提醒实例、通知、导出记录响应结构：已在本文补齐草案。
4. 详情 API：补齐账户、分类、预算、储蓄目标、周期提醒详情 GET 路径。
5. `ResponseCode`：已锁定业务细分码方向，后续实现按资源逐步补齐。
6. 账单按币种筛选索引：数据库迁移和设计文档均需要包含 `transactions(user_id, currency, occurred_at)`。
7. 导出任务进度：v1 不显示百分比，仅展示任务状态。
8. 默认初始化策略：注册后自动初始化默认分类；不自动创建默认账户，用户需手动创建账户后才能记账。

仍需后续阶段继续细化：

1. PDF 月报是否包含图表图片，以及图表由前端截图还是后端生成。
2. AI provider、调用超时、限流和密钥配置策略。
