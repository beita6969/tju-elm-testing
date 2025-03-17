package com.neusoft.elmboot.service;

import java.util.List;

import com.neusoft.elmboot.po.DiscoverSearchHistory;

public interface DiscoverSearchHistoryService {
    
    public int saveSearchHistory(DiscoverSearchHistory history);
    
    public List<DiscoverSearchHistory> getSearchHistoryByUserId(String userId);
    
    public int updateCurrentPage(DiscoverSearchHistory history);
    
    public int deleteSearchHistoryByUserId(String userId);
} 