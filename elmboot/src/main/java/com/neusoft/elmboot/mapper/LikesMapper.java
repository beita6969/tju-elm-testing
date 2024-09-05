package com.neusoft.elmboot.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.neusoft.elmboot.po.User;

@Mapper
public interface LikesMapper {
	 @Select("select count(*) from likes where businessId=#{businessId}")
	 public int getLikesBybusinessId(Integer businessId);
	 
	 @Insert("insert into likes values(#{userId},#{businessId}")
	 public int saveLikes(String userId,Integer businessId);
	 
	 @Delete("delete from likes where userId=#{userId} and businessId=#{businessId}")
	 public int removeLikes(String userId,Integer businessId);
	 
	 @Select("select count(*) from likes where userId=#{userId} and businessId=#{businessId}")
	 public int getLikesByUserIdByBusinessId(String userId,Integer businessId);
}
