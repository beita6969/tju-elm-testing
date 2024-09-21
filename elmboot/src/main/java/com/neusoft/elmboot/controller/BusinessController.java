package com.neusoft.elmboot.controller;

import com.neusoft.elmboot.po.Business;
import com.neusoft.elmboot.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/BusinessController")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

    @RequestMapping("/saveBusiness")
    public int saveBusiness(@RequestBody Business business) throws Exception{
    	return businessService.saveBusiness(business);
    }
    
    @RequestMapping("/getBusinessIdByPhoneNumber")
    public int getBusinessIdByPhoneNumber(@RequestBody Business business) throws Exception{
    	return businessService.getBusinessIdByPhoneNumber(business);
    }
    
    @RequestMapping("/checkBusiness")
    public int checkBusiness (@RequestBody Business business) throws Exception{
    	return businessService.checkBusiness(business);
    }

    @RequestMapping("/listBusinessByOrderTypeId")
    public List<Business> listBusinessByOrderTypeId(@RequestBody Business business) throws Exception {
        return businessService.listBusinessByOrderTypeId(business.getOrderTypeId());
    }

    @RequestMapping("/getBusinessById")
    public Business getBusinessById(@RequestBody Business business) throws Exception {
        return businessService.getBusinessById(business.getBusinessId());
    }
    
    @RequestMapping("/getBusinessByIdByPass")
    public Business getBusinessByIdByPass(@RequestBody Business business) {
    	return businessService.getBusinessByIdByPass(business);
    }

    @RequestMapping("/listBusinessByBusinessName")
    public List<Business> listBusinessByBusinessName(@RequestBody Business business) throws Exception {
        return businessService.listBusinessByBusinessName(business.getBusinessName());
    }
    
    @RequestMapping("/updateBusiness")
    public int updateBusiness(@RequestBody Business business) throws Exception {
     return businessService.updateBusiness(business);
    }
    
    @RequestMapping("/test")
    public String test() {
        return "test";
    }
}