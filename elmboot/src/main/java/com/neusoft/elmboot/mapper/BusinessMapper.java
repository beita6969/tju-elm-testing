package com.neusoft.elmboot.mapper;

import com.neusoft.elmboot.po.Business;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;


@Mapper
public interface BusinessMapper {
	@Select("select * from business where orderTypeId=#{orderTypeId} order by businessId")
	public List<Business> listBusinessByOrderTypeId(Integer orderTypeId);

	@Select("select * from business where businessId=#{businessId}")
	public Business getBusinessById(Integer businessId);
	
	@Select("select * from business where phoneNumber=#{phoneNumber} and password=#{password}")
	public Business getBusinessByIdByPass(Business business);

	@Select("SELECT * FROM elm.business where businessId in\r\n" +
			"(SELECT business.businessId FROM elm.food right join elm.business on food.businessId=business.businessId "
			+ "where businessName like concat('%',#{businessOrFoodName},'%') or foodName like concat('%',#{businessOrFoodName},'%'))")
	public List<Business> listBusinessByBusinessName(String businessOrFoodName);
	
	@Insert("insert into business(phoneNumber,password) values(#{phoneNumber},#{password})")
	@Options(useGeneratedKeys=true,keyProperty="businessId",keyColumn="businessId")
	public int saveBusiness(Business business);
	
	@Update("UPDATE business b SET b.businessAddress =#{businessAddress},"
			+ " b.businessExplain =#{businessExplain},"
			+ " b.businessImg =#{businessImg},"
			+ " b.businessName =#{businessName},"
			+ " b.starPrice =#{starPrice},"
			+ " b.deliveryPrice =#{deliveryPrice},"
			+ " b.orderTypeId =#{orderTypeId}" 
			+ " WHERE b.businessId =#{businessId}")
	public int updateBusiness(Business business);
	
	@Select("select count(*) from business where phoneNumber=#{phoneNumber}")
	public int checkBusiness(Business business);
	
	@Select("select businessId from business where phoneNumber=#{phoneNumber}")
	public int getBusinessIdByPhoneNumber(Business business);

}