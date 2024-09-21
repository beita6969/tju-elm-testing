package com.neusoft.elmboot.service;

import com.neusoft.elmboot.po.Business;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;

public interface BusinessService {
	public List<Business> listBusinessByOrderTypeId(Integer orderTypeId);
	public Business getBusinessById(Integer businessId);
	public List<Business> listBusinessByBusinessName(String businessName);
	public int saveBusiness(Business business);
	public int updateBusiness(Business business);
	public Business getBusinessByIdByPass(Business business);
	public int checkBusiness (Business business);
	public int getBusinessIdByPhoneNumber(Business business);
}
