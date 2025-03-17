package com.neusoft.elmboot.po;

public class SearchResult {
    private String type; // "business" 或 "food"
    private Integer businessId;
    private Integer foodId;
    private String name;
    private String img;
    private Double starPrice; // 起送价
    private Double deliveryPrice; // 配送费
    private Double price; // 食品价格
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Integer getBusinessId() {
        return businessId;
    }
    
    public void setBusinessId(Integer businessId) {
        this.businessId = businessId;
    }
    
    public Integer getFoodId() {
        return foodId;
    }
    
    public void setFoodId(Integer foodId) {
        this.foodId = foodId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getImg() {
        return img;
    }
    
    public void setImg(String img) {
        this.img = img;
    }
    
    public Double getStarPrice() {
        return starPrice;
    }
    
    public void setStarPrice(Double starPrice) {
        this.starPrice = starPrice;
    }
    
    public Double getDeliveryPrice() {
        return deliveryPrice;
    }
    
    public void setDeliveryPrice(Double deliveryPrice) {
        this.deliveryPrice = deliveryPrice;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
} 