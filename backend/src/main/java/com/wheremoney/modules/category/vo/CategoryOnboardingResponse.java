package com.wheremoney.modules.category.vo;

import com.wheremoney.modules.user.vo.UserMeResponse;
import java.util.List;

public record CategoryOnboardingResponse(UserMeResponse user, List<CategoryResponse> categories) {}
