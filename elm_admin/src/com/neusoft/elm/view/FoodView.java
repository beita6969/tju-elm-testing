package com.neusoft.elm.view;

import com.neusoft.elm.po.Food;

import java.util.List;

public interface FoodView {
    public List<Food> showFoodList(Integer businessId);
    public void saveFood(Integer businessId);
    public void updateFood(Integer businessId);
    public void removeFood(Integer businessId);
}
