package com.neusoft.elmboot.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.DiscoverSearchHistoryMapper;
import com.neusoft.elmboot.po.DiscoverSearchHistory;
import com.neusoft.elmboot.service.DiscoverSearchHistoryService;

@Service
public class DiscoverSearchHistoryServiceImpl implements DiscoverSearchHistoryService {

    @Autowired
    private DiscoverSearchHistoryMapper discoverSearchHistoryMapper;
    
    @Override
    public int saveSearchHistory(DiscoverSearchHistory history) {
        return discoverSearchHistoryMapper.saveSearchHistory(history);
    }

    @Override
    public List<DiscoverSearchHistory> getSearchHistoryByUserId(String userId) {
        return discoverSearchHistoryMapper.getSearchHistoryByUserId(userId);
    }

    @Override
    public int updateCurrentPage(DiscoverSearchHistory history) {
        return discoverSearchHistoryMapper.updateCurrentPage(history);
    }

    @Override
    public int deleteSearchHistoryByUserId(String userId) {
        return discoverSearchHistoryMapper.deleteSearchHistoryByUserId(userId);
    }
} 