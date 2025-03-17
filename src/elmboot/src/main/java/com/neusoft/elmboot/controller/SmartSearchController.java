package com.neusoft.elmboot.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.elmboot.service.SmartSearchService;
import com.neusoft.elmboot.po.SearchResult;

@RestController
@RequestMapping("/smartSearch")
public class SmartSearchController {
    
    @Autowired
    private SmartSearchService smartSearchService;
    
    @RequestMapping("/smartSearch")
    public Map<String, Object> smartSearch(@RequestBody Map<String, Object> params) {
        String query = (String) params.get("query");
        String category = (String) params.get("category");
        
        Map<String, Object> result = new HashMap<>();
        List<SearchResult> searchResults = smartSearchService.search(query, category);
        result.put("results", searchResults);
        
        return result;
    }
} 