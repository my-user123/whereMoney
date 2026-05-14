package com.wheremoney;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class Phase1FlowTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @Test
  void phase1BookkeepingFlowWorks() throws Exception {
    String token = register("alice");
    String otherToken = register("bob");

    mockMvc
        .perform(get("/api/v1/users/me").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200))
        .andExpect(jsonPath("$.data.isNewUserFirstLogin").value(true));

    mockMvc
        .perform(get("/api/v1/categories").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200))
        .andExpect(jsonPath("$.data.length()").value(0));

    String accountId =
        data(mockMvc
                .perform(
                    post("/api/v1/accounts")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                            json(
                                Map.of(
                                    "name", "微信钱包",
                                    "type", "WECHAT",
                                    "currency", "CNY",
                                    "initialBalance", "100.00",
                                    "color", "#22C55E",
                                    "icon", "wallet"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.currentBalance").value("100.00"))
                .andReturn())
            .get("id")
            .asText();

    String categoryId =
        data(mockMvc
                .perform(
                    post("/api/v1/categories")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                            json(
                                Map.of(
                                    "name", "餐饮",
                                    "type", "EXPENSE",
                                    "icon", "utensils",
                                    "color", "#F97316"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("餐饮"))
                .andReturn())
            .get("id")
            .asText();

    String transactionId =
        data(mockMvc
                .perform(
                    post("/api/v1/transactions")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                            json(
                                Map.of(
                                    "type", "EXPENSE",
                                    "amount", "28.00",
                                    "currency", "CNY",
                                    "accountId", accountId,
                                    "categoryId", categoryId,
                                    "occurredAt", LocalDateTime.now().toString(),
                                    "note", "午餐"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.amount").value("28.00"))
                .andReturn())
            .get("id")
            .asText();

    mockMvc
        .perform(get("/api/v1/accounts").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].currentBalance").value("72.00"));

    mockMvc
        .perform(get("/api/v1/analytics/dashboard").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.summaryByCurrency[0].expenseAmount").value("28.00"));

    mockMvc
        .perform(
            get("/api/v1/transactions/" + transactionId)
                .header("Authorization", bearer(otherToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(30001));

    mockMvc
        .perform(
            delete("/api/v1/transactions/" + transactionId).header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200));

    mockMvc
        .perform(get("/api/v1/accounts").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].currentBalance").value("100.00"));
  }

  @Test
  void categoryOnboardingCompleteCreatesSelectedTreeAndMarksUserReady() throws Exception {
    String token = register("carol");

    mockMvc
        .perform(
            get("/api/v1/categories/onboarding/templates").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200))
        .andExpect(jsonPath("$.data.length()").isNotEmpty());

    mockMvc
        .perform(
            post("/api/v1/categories/onboarding/complete")
                .header("Authorization", bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json(
                        Map.of(
                            "selectedKeys",
                            java.util.List.of("expense.food.milk-tea.mixue", "income.salary"),
                            "customCategories",
                            java.util.List.of(
                                Map.of(
                                    "parentKey",
                                    "expense.food.milk-tea",
                                    "name",
                                    "霸王茶姬",
                                    "type",
                                    "EXPENSE",
                                    "icon",
                                    "cup-soda",
                                    "color",
                                    "#F59E0B"))))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200))
        .andExpect(jsonPath("$.data.user.isNewUserFirstLogin").value(false))
        .andExpect(jsonPath("$.data.categories.length()").value(5));

    mockMvc
        .perform(get("/api/v1/categories").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(5));
  }

  @Test
  void categoryOnboardingSkipMarksUserReadyWithoutCreatingCategories() throws Exception {
    String token = register("dora");

    mockMvc
        .perform(post("/api/v1/categories/onboarding/skip").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200))
        .andExpect(jsonPath("$.data.user.isNewUserFirstLogin").value(false))
        .andExpect(jsonPath("$.data.categories.length()").value(0));
  }

  @Test
  void categoryHierarchyCreateUpdateAndDisableTreeWorks() throws Exception {
    String token = register("erin");

    String foodId = createCategory(token, null, "餐饮", "EXPENSE");
    String milkTeaId = createCategory(token, foodId, "奶茶", "EXPENSE");
    String brandId = createCategory(token, milkTeaId, "霸王茶姬", "EXPENSE");

    mockMvc
        .perform(
            post("/api/v1/categories")
                .header("Authorization", bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json(
                        Map.of(
                            "parentId",
                            brandId,
                            "name",
                            "新品",
                            "type",
                            "EXPENSE",
                            "icon",
                            "tag",
                            "color",
                            "#1c1c1c"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(20004));

    mockMvc
        .perform(
            post("/api/v1/categories")
                .header("Authorization", bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json(
                        Map.of(
                            "parentId",
                            foodId,
                            "name",
                            "奖金",
                            "type",
                            "INCOME",
                            "icon",
                            "gift",
                            "color",
                            "#22C55E"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(20004));

    mockMvc
        .perform(
            put("/api/v1/categories/" + milkTeaId)
                .header("Authorization", bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json(Map.of("name", "奶茶饮品", "icon", "cup-soda", "color", "#F59E0B"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.name").value("奶茶饮品"))
        .andExpect(jsonPath("$.data.type").value("EXPENSE"))
        .andExpect(jsonPath("$.data.parentId").value(foodId));

    mockMvc
        .perform(
            get("/api/v1/categories")
                .header("Authorization", bearer(token))
                .param("type", "EXPENSE"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(3));

    mockMvc
        .perform(
            org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch(
                    "/api/v1/categories/" + foodId + "/disable")
                .header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200));

    mockMvc
        .perform(
            get("/api/v1/categories")
                .header("Authorization", bearer(token))
                .param("type", "EXPENSE")
                .param("status", "DISABLED"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(3));
  }

  private String register(String username) throws Exception {
    String email = username + "@example.com";
    MvcResult result =
        mockMvc
            .perform(
                post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(Map.of("email", email, "password", "secret123"))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200))
            .andExpect(jsonPath("$.data.user.isNewUserFirstLogin").value(true))
            .andReturn();
    return data(result).get("token").asText();
  }

  private String createCategory(String token, String parentId, String name, String type)
      throws Exception {
    java.util.Map<String, Object> body = new java.util.LinkedHashMap<>();
    if (parentId != null) {
      body.put("parentId", parentId);
    }
    body.put("name", name);
    body.put("type", type);
    body.put("icon", "tag");
    body.put("color", "#1c1c1c");
    return data(mockMvc
            .perform(
                post("/api/v1/categories")
                    .header("Authorization", bearer(token))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.name").value(name))
            .andReturn())
        .get("id")
        .asText();
  }

  private String bearer(String token) {
    return "Bearer " + token;
  }

  private String json(Object value) throws Exception {
    return objectMapper.writeValueAsString(value);
  }

  private JsonNode data(MvcResult result) throws Exception {
    JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
    assertThat(root.get("code").asInt()).isEqualTo(200);
    return root.get("data");
  }
}
