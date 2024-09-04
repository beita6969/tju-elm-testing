package com.neusoft.elmboot.mapper;

import com.neusoft.elmboot.po.Business;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;


@Mapper
public interface BusinessMapper {
	@Select("select * from business where orderTypeId=#{orderTypeId} order by businessId")
	public List<Business> listBusinessByOrderTypeId(Integer orderTypeId);

	@Select("select * from business where businessId=#{businessId}")
	public Business getBusinessById(Integer businessId);

	@Select("SELECT * FROM elm.business where businessId in\r\n" +
			"(SELECT business.businessId FROM elm.food right join elm.business on food.businessId=business.businessId "
			+ "where businessName like concat('%',#{businessOrFoodName},'%') or foodName like concat('%',#{businessOrFoodName},'%'))")
	public List<Business> listBusinessByBusinessName(String businessOrFoodName);

}