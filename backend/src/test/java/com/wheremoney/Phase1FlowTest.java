package com.wheremoney;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
        .perform(get("/api/v1/categories").header("Authorization", bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(200))
        .andExpect(jsonPath("$.data.length()").value(9));

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

    JsonNode categories =
        data(
            mockMvc
                .perform(
                    get("/api/v1/categories")
                        .param("type", "EXPENSE")
                        .header("Authorization", bearer(token)))
                .andReturn());
    String categoryId = categories.get(0).get("id").asText();

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

  private String register(String username) throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        json(
                            Map.of(
                                "username",
                                username,
                                "password",
                                "secret123",
                                "nickname",
                                username,
                                "defaultCurrency",
                                "CNY"))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200))
            .andReturn();
    return data(result).get("token").asText();
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
