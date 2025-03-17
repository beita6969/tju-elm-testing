package com.neusoft.elmboot.service;

import com.neusoft.elmboot.po.SearchResult;

import java.util.List;
import java.util.Map;

public interface SmartSearchService {
    List<SearchResult> search(String query, String category);
    public Map<String, Object> search(String query, String type, String category, int page);
}

