package com.neusoft.elmboot.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.neusoft.elmboot.po.Food;
import com.neusoft.elmboot.service.FoodService;
@RestController
@RequestMapping("/FoodController")
public class FoodController {
 
 @Autowired
 private FoodService foodService;
 @RequestMapping("/listFoodByBusinessId")
 public List<Food> listFoodByBusinessId(Food food) throws Exception{
 return foodService.listFoodByBusinessId(food.getBusinessId());
 }
}