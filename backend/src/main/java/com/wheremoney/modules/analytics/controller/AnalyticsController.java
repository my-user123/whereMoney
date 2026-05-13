package com.wheremoney.modules.analytics.controller;

import com.wheremoney.common.response.ApiResponse;
import com.wheremoney.common.security.SecurityUtils;
import com.wheremoney.modules.analytics.service.AnalyticsService;
import com.wheremoney.modules.analytics.vo.DashboardResponse;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

  private final AnalyticsService analyticsService;

  public AnalyticsController(AnalyticsService analyticsService) {
    this.analyticsService = analyticsService;
  }

  @GetMapping("/dashboard")
  public ApiResponse<DashboardResponse> dashboard(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate periodStart,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate periodEnd) {
    return ApiResponse.success(
        analyticsService.dashboard(SecurityUtils.currentUserId(), periodStart, periodEnd));
  }
}
