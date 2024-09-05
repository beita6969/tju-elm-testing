package com.neusoft.elmboot.service;
import java.util.List;
import com.neusoft.elmboot.po.Food;
public interface FoodService {
 public List<Food> listFoodByBusinessId(Integer businessId);
}