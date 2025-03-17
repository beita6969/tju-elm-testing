package com.neusoft.elmboot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.po.DiscoverSearchHistory;
import com.neusoft.elmboot.service.DiscoverSearchHistoryService;

@RestController
@RequestMapping("/DiscoverSearchController")
public class DiscoverSearchHistoryController {

    @Autowired
    private DiscoverSearchHistoryService discoverSearchHistoryService;
    
    @RequestMapping("/saveSearchHistory")
    public Map<String, Object> saveSearchHistory(@RequestBody DiscoverSearchHistory history) {
        Map<String, Object> result = new HashMap<>();
        int success = discoverSearchHistoryService.saveSearchHistory(history);
        result.put("success", success > 0);
        result.put("id", history.getId());
        return result;
    }
    
    @RequestMapping("/getSearchHistoryByUserId")
    public List<DiscoverSearchHistory> getSearchHistoryByUserId(@RequestBody Map<String, String> params) {
        String userId = params.get("userId");
        return discoverSearchHistoryService.getSearchHistoryByUserId(userId);
    }
    
    @RequestMapping("/updateCurrentPage")
    public Map<String, Object> updateCurrentPage(@RequestBody DiscoverSearchHistory history) {
        Map<String, Object> result = new HashMap<>();
        int success = discoverSearchHistoryService.updateCurrentPage(history);
        result.put("success", success > 0);
        return result;
    }
    
    @RequestMapping("/deleteSearchHistoryByUserId")
    public Map<String, Object> deleteSearchHistoryByUserId(@RequestBody Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        String userId = params.get("userId");
        int success = discoverSearchHistoryService.deleteSearchHistoryByUserId(userId);
        result.put("success", success > 0);
        return result;
    }
} 