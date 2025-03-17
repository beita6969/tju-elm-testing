package com.neusoft.elmboot.service.impl;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neusoft.elmboot.mapper.BusinessMapper;
import com.neusoft.elmboot.mapper.FoodMapper;
import com.neusoft.elmboot.po.Business;
import com.neusoft.elmboot.po.Food;
import com.neusoft.elmboot.po.SearchResult;
import com.neusoft.elmboot.service.SmartSearchService;

@Service
public class SmartSearchServiceImpl implements SmartSearchService {
    
    @Autowired
    private BusinessMapper businessMapper;
    
    @Autowired
    private FoodMapper foodMapper;
    
    private static final int PAGE_SIZE = 10;
    
    @Override
    public List<SearchResult> search(String query, String category) {
        List<SearchResult> results = new ArrayList<>();
        
        if (query == null || query.isEmpty()) {
            return results;
        }
        
        // 使用和首页相同的搜索方法，根据输入内容模糊搜索商家和食品
        List<Business> businesses = businessMapper.listBusinessByBusinessName(query);
        
        // 转换为SearchResult对象
        for (Business business : businesses) {
            SearchResult result = new SearchResult();
            result.setType("business");
            result.setBusinessId(business.getBusinessId());
            result.setName(business.getBusinessName());
            result.setImg(business.getBusinessImg());
            result.setStarPrice(business.getStarPrice().doubleValue());
            result.setDeliveryPrice(business.getDeliveryPrice().doubleValue());
            results.add(result);
        }
        
        return results;
    }
    
    // 检查商家是否有匹配查询条件的食品
    private boolean hasMatchingFood(Integer businessId, String query) {
        if (query == null || query.isEmpty()) {
            return false;
        }
        List<Food> foods = foodMapper.listFoodByBusinessId(businessId);
        return foods.stream().anyMatch(food -> food.getFoodName().contains(query));
    }
    
    @Override
    public Map<String, Object> search(String query, String type, String category, int page) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> searchResults = new ArrayList<>();
        int total = 0;
        
        try {
            if ("business".equals(type) || "all".equals(type)) {
                // 搜索商家
                List<Business> businesses = businessMapper.listBusinessBySearchName(query);
                if (category != null && !category.isEmpty()) {
                    businesses = businesses.stream()
                            .filter(b -> b.getBusinessExplain().contains(category))
                            .collect(Collectors.toList());
                }
                
                total += businesses.size();
                
                // 分页处理
                int start = (page - 1) * PAGE_SIZE;
                int end = Math.min(start + PAGE_SIZE, businesses.size());
                
                if (start < businesses.size()) {
                    for (int i = start; i < end; i++) {
                        Business business = businesses.get(i);
                        Map<String, Object> businessMap = new HashMap<>();
                        businessMap.put("type", "business");
                        businessMap.put("name", business.getBusinessName());
                        businessMap.put("img", business.getBusinessImg());
                        businessMap.put("starPrice", business.getStarPrice());
                        businessMap.put("deliveryPrice", business.getDeliveryPrice());
                        businessMap.put("businessId", business.getBusinessId());
                        searchResults.add(businessMap);
                    }
                }
            }
            
            if ("food".equals(type) || "all".equals(type)) {
                // 搜索食品
                List<Food> foods = foodMapper.listFoodBySearchName(query);
                if (category != null && !category.isEmpty()) {
                    foods = foods.stream()
                            .filter(f -> f.getFoodName().contains(category))
                            .collect(Collectors.toList());
                }
                
                total += foods.size();
                
                // 分页处理
                int start = (page - 1) * PAGE_SIZE;
                int end = Math.min(start + PAGE_SIZE, foods.size());
                
                if (start < foods.size()) {
                    for (int i = start; i < end; i++) {
                        Food food = foods.get(i);
                        Map<String, Object> foodMap = new HashMap<>();
                        foodMap.put("type", "food");
                        foodMap.put("name", food.getFoodName());
                        foodMap.put("img", food.getFoodImg());
                        foodMap.put("price", food.getFoodPrice());
                        foodMap.put("businessId", food.getBusinessId());
                        searchResults.add(foodMap);
                    }
                }
            }
            
            result.put("results", searchResults);
            result.put("total", total);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "搜索失败：" + e.getMessage());
        }
        
        return result;
    }
} 