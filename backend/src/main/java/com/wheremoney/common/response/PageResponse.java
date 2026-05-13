package com.wheremoney.common.response;

import java.util.List;

public record PageResponse<T>(long total, long page, long size, List<T> list) {}
