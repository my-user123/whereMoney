package com.wheremoney.modules.category.service;

import com.wheremoney.common.enums.TransactionType;
import com.wheremoney.modules.category.model.CategoryTemplate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class CategoryTemplateProvider {

  private static final List<CategoryTemplate> TEMPLATES = buildTemplates();

  public List<CategoryTemplate> templates() {
    return TEMPLATES;
  }

  public Map<String, CategoryTemplate> flattenTemplates() {
    Map<String, CategoryTemplate> result = new LinkedHashMap<>();
    for (CategoryTemplate template : TEMPLATES) {
      flattenTemplate(template, result);
    }
    return result;
  }

  private void flattenTemplate(CategoryTemplate template, Map<String, CategoryTemplate> result) {
    result.put(template.key(), template);
    for (CategoryTemplate child : template.children()) {
      flattenTemplate(child, result);
    }
  }

  private static List<CategoryTemplate> buildTemplates() {
    CategoryTemplate food =
        template("expense.food", "餐饮", TransactionType.EXPENSE, "utensils", "#F97316", 1)
            .addChildren(
                template(
                        "expense.food.milk-tea",
                        "奶茶",
                        TransactionType.EXPENSE,
                        "cup-soda",
                        "#F59E0B",
                        1)
                    .addChildren(
                        template(
                            "expense.food.milk-tea.mixue",
                            "蜜雪冰城",
                            TransactionType.EXPENSE,
                            "snowflake",
                            "#EF4444",
                            1),
                        template(
                            "expense.food.milk-tea.yidiandian",
                            "一点点",
                            TransactionType.EXPENSE,
                            "cup-soda",
                            "#A16207",
                            2),
                        template(
                            "expense.food.milk-tea.heytea",
                            "喜茶",
                            TransactionType.EXPENSE,
                            "sparkles",
                            "#16A34A",
                            3)),
                template(
                        "expense.food.coffee",
                        "咖啡",
                        TransactionType.EXPENSE,
                        "coffee",
                        "#92400E",
                        2)
                    .addChildren(
                        template(
                            "expense.food.coffee.starbucks",
                            "星巴克",
                            TransactionType.EXPENSE,
                            "coffee",
                            "#166534",
                            1),
                        template(
                            "expense.food.coffee.luckin",
                            "瑞幸",
                            TransactionType.EXPENSE,
                            "cup-soda",
                            "#2563EB",
                            2),
                        template(
                            "expense.food.coffee.manner",
                            "Manner",
                            TransactionType.EXPENSE,
                            "coffee",
                            "#78350F",
                            3)),
                template(
                        "expense.food.meal",
                        "正餐",
                        TransactionType.EXPENSE,
                        "chef-hat",
                        "#EA580C",
                        3)
                    .addChildren(
                        template(
                            "expense.food.meal.breakfast",
                            "早餐",
                            TransactionType.EXPENSE,
                            "croissant",
                            "#F59E0B",
                            1),
                        template(
                            "expense.food.meal.lunch",
                            "午餐",
                            TransactionType.EXPENSE,
                            "utensils",
                            "#EA580C",
                            2),
                        template(
                            "expense.food.meal.dinner",
                            "晚餐",
                            TransactionType.EXPENSE,
                            "cooking-pot",
                            "#C2410C",
                            3)),
                template(
                    "expense.food.takeout", "外卖", TransactionType.EXPENSE, "bike", "#FB923C", 4),
                template(
                    "expense.food.snacks", "零食", TransactionType.EXPENSE, "cookie", "#D97706", 5));

    CategoryTemplate transport =
        template("expense.transport", "交通", TransactionType.EXPENSE, "bus", "#3B82F6", 2)
            .addChildren(
                template(
                    "expense.transport.metro",
                    "地铁",
                    TransactionType.EXPENSE,
                    "train",
                    "#2563EB",
                    1),
                template(
                    "expense.transport.taxi", "打车", TransactionType.EXPENSE, "car", "#0EA5E9", 2),
                template(
                    "expense.transport.bus", "公交", TransactionType.EXPENSE, "bus", "#1D4ED8", 3),
                template(
                    "expense.transport.bike", "骑行", TransactionType.EXPENSE, "bike", "#0284C7", 4),
                template(
                    "expense.transport.train",
                    "火车高铁",
                    TransactionType.EXPENSE,
                    "train",
                    "#1E40AF",
                    5),
                template(
                    "expense.transport.flight",
                    "机票",
                    TransactionType.EXPENSE,
                    "plane",
                    "#0369A1",
                    6),
                template(
                    "expense.transport.fuel",
                    "加油充电",
                    TransactionType.EXPENSE,
                    "fuel",
                    "#0891B2",
                    7),
                template(
                    "expense.transport.parking",
                    "停车",
                    TransactionType.EXPENSE,
                    "parking-circle",
                    "#0F766E",
                    8));

    CategoryTemplate shopping =
        template("expense.shopping", "购物", TransactionType.EXPENSE, "shopping-bag", "#EC4899", 3)
            .addChildren(
                template(
                    "expense.shopping.clothes",
                    "服饰",
                    TransactionType.EXPENSE,
                    "shirt",
                    "#DB2777",
                    1),
                template(
                    "expense.shopping.digital",
                    "数码",
                    TransactionType.EXPENSE,
                    "smartphone",
                    "#7C3AED",
                    2),
                template(
                    "expense.shopping.daily",
                    "日用品",
                    TransactionType.EXPENSE,
                    "package",
                    "#BE185D",
                    3),
                template(
                    "expense.shopping.beauty",
                    "美妆个护",
                    TransactionType.EXPENSE,
                    "sparkles",
                    "#C026D3",
                    4),
                template(
                    "expense.shopping.home",
                    "家居用品",
                    TransactionType.EXPENSE,
                    "sofa",
                    "#9333EA",
                    5));

    CategoryTemplate housing =
        template("expense.housing", "住房", TransactionType.EXPENSE, "home", "#A16207", 4)
            .addChildren(
                template(
                    "expense.housing.rent",
                    "房租",
                    TransactionType.EXPENSE,
                    "key-round",
                    "#92400E",
                    1),
                template(
                    "expense.housing.utility",
                    "水电燃气",
                    TransactionType.EXPENSE,
                    "plug",
                    "#B45309",
                    2),
                template(
                    "expense.housing.property",
                    "物业",
                    TransactionType.EXPENSE,
                    "building-2",
                    "#A16207",
                    3),
                template(
                    "expense.housing.internet",
                    "宽带",
                    TransactionType.EXPENSE,
                    "wifi",
                    "#854D0E",
                    4),
                template(
                    "expense.housing.repair",
                    "维修",
                    TransactionType.EXPENSE,
                    "wrench",
                    "#713F12",
                    5));

    CategoryTemplate entertainment =
        template("expense.entertainment", "娱乐", TransactionType.EXPENSE, "music", "#8B5CF6", 5)
            .addChildren(
                template(
                    "expense.entertainment.movie",
                    "电影",
                    TransactionType.EXPENSE,
                    "clapperboard",
                    "#7C3AED",
                    1),
                template(
                    "expense.entertainment.game",
                    "游戏",
                    TransactionType.EXPENSE,
                    "gamepad-2",
                    "#6D28D9",
                    2),
                template(
                    "expense.entertainment.show",
                    "演出",
                    TransactionType.EXPENSE,
                    "ticket",
                    "#9333EA",
                    3),
                template(
                    "expense.entertainment.travel",
                    "旅游",
                    TransactionType.EXPENSE,
                    "map",
                    "#4F46E5",
                    4),
                template(
                    "expense.entertainment.membership",
                    "会员订阅",
                    TransactionType.EXPENSE,
                    "badge-check",
                    "#7E22CE",
                    5));

    CategoryTemplate learning =
        template("expense.learning", "学习", TransactionType.EXPENSE, "book-open", "#0EA5E9", 6)
            .addChildren(
                template(
                    "expense.learning.books", "书籍", TransactionType.EXPENSE, "book", "#0284C7", 1),
                template(
                    "expense.learning.course",
                    "课程",
                    TransactionType.EXPENSE,
                    "graduation-cap",
                    "#0369A1",
                    2),
                template(
                    "expense.learning.exam",
                    "考试认证",
                    TransactionType.EXPENSE,
                    "clipboard-check",
                    "#075985",
                    3),
                template(
                    "expense.learning.stationery",
                    "文具",
                    TransactionType.EXPENSE,
                    "pencil",
                    "#0891B2",
                    4));

    CategoryTemplate health =
        template("expense.health", "医疗健康", TransactionType.EXPENSE, "heart-pulse", "#EF4444", 7)
            .addChildren(
                template(
                    "expense.health.hospital",
                    "医院",
                    TransactionType.EXPENSE,
                    "hospital",
                    "#DC2626",
                    1),
                template(
                    "expense.health.pharmacy", "药品", TransactionType.EXPENSE, "pill", "#B91C1C", 2),
                template(
                    "expense.health.fitness",
                    "健身",
                    TransactionType.EXPENSE,
                    "dumbbell",
                    "#F43F5E",
                    3),
                template(
                    "expense.health.checkup",
                    "体检",
                    TransactionType.EXPENSE,
                    "stethoscope",
                    "#E11D48",
                    4));

    CategoryTemplate family =
        template("expense.family", "家庭生活", TransactionType.EXPENSE, "heart-handshake", "#14B8A6", 8)
            .addChildren(
                template(
                    "expense.family.child", "孩子", TransactionType.EXPENSE, "baby", "#0D9488", 1),
                template(
                    "expense.family.elder",
                    "长辈",
                    TransactionType.EXPENSE,
                    "hand-heart",
                    "#0F766E",
                    2),
                template(
                    "expense.family.pet", "宠物", TransactionType.EXPENSE, "paw-print", "#0F766E", 3),
                template(
                    "expense.family.gift", "礼物", TransactionType.EXPENSE, "gift", "#0E7490", 4));

    CategoryTemplate communication =
        template("expense.communication", "通讯", TransactionType.EXPENSE, "smartphone", "#64748B", 9)
            .addChildren(
                template(
                    "expense.communication.phone",
                    "手机话费",
                    TransactionType.EXPENSE,
                    "phone",
                    "#475569",
                    1),
                template(
                    "expense.communication.data",
                    "流量套餐",
                    TransactionType.EXPENSE,
                    "signal",
                    "#334155",
                    2),
                template(
                    "expense.communication.device",
                    "设备服务",
                    TransactionType.EXPENSE,
                    "tablet-smartphone",
                    "#1F2937",
                    3));

    CategoryTemplate salary =
        template("income.salary", "工资", TransactionType.INCOME, "wallet", "#22C55E", 1)
            .addChildren(
                template(
                    "income.salary.base",
                    "基本工资",
                    TransactionType.INCOME,
                    "badge-dollar-sign",
                    "#16A34A",
                    1),
                template("income.salary.bonus", "奖金", TransactionType.INCOME, "gift", "#15803D", 2),
                template(
                    "income.salary.subsidy",
                    "补贴",
                    TransactionType.INCOME,
                    "badge-dollar-sign",
                    "#166534",
                    3));

    CategoryTemplate sideJob =
        template("income.side-job", "兼职", TransactionType.INCOME, "briefcase", "#16A34A", 2)
            .addChildren(
                template(
                    "income.side-job.project",
                    "项目收入",
                    TransactionType.INCOME,
                    "folder-check",
                    "#059669",
                    1),
                template(
                    "income.side-job.platform",
                    "平台结算",
                    TransactionType.INCOME,
                    "receipt",
                    "#047857",
                    2),
                template(
                    "income.side-job.consulting",
                    "咨询服务",
                    TransactionType.INCOME,
                    "messages-square",
                    "#065F46",
                    3));

    CategoryTemplate freelance =
        template("income.freelance", "自由职业", TransactionType.INCOME, "laptop", "#10B981", 3)
            .addChildren(
                template(
                    "income.freelance.design",
                    "设计稿费",
                    TransactionType.INCOME,
                    "pen-tool",
                    "#059669",
                    1),
                template(
                    "income.freelance.writing",
                    "写作稿费",
                    TransactionType.INCOME,
                    "file-text",
                    "#047857",
                    2),
                template(
                    "income.freelance.development",
                    "开发收入",
                    TransactionType.INCOME,
                    "code-2",
                    "#065F46",
                    3));

    CategoryTemplate otherIncome =
        template("income.other", "其他收入", TransactionType.INCOME, "circle-dollar-sign", "#65A30D", 4)
            .addChildren(
                template(
                    "income.other.redpacket", "红包", TransactionType.INCOME, "mail", "#84CC16", 1),
                template(
                    "income.other.interest",
                    "利息",
                    TransactionType.INCOME,
                    "landmark",
                    "#4D7C0F",
                    2),
                template(
                    "income.other.family", "家人转入", TransactionType.INCOME, "users", "#3F6212", 3),
                template(
                    "income.other.allowance",
                    "生活费",
                    TransactionType.INCOME,
                    "hand-coins",
                    "#65A30D",
                    4));

    return List.of(
        food,
        transport,
        shopping,
        housing,
        entertainment,
        learning,
        health,
        family,
        communication,
        salary,
        sideJob,
        freelance,
        otherIncome);
  }

  private static CategoryTemplate template(
      String key, String name, TransactionType type, String icon, String color, int sortOrder) {
    return new CategoryTemplate(key, name, type, icon, color, sortOrder);
  }
}
