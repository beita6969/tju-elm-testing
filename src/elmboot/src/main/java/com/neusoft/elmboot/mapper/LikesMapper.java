package com.neusoft.elmboot.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.neusoft.elmboot.po.Likes;
import com.neusoft.elmboot.po.User;

@Mapper
public interface LikesMapper {
	 @Select("select count(*) from likes where businessId=#{businessId}")
	 public int getLikesBybusinessId(Likes likes);
	 
	 @Insert("insert into likes values(#{userId},#{businessId})")
	 public int saveLikes(Likes likes);
	 
	 @Delete("delete from likes where userId=#{userId} and businessId=#{businessId}")
	 public int removeLikes(Likes likes);
	 
	 @Select("select count(*) from likes where userId=#{userId} and businessId=#{businessId}")
	 public int getLikesByUserIdByBusinessId(Likes likes);
	 
	 @Select("SELECT l.*, b.businessName as name, b.businessImg as img, 'business' as type, NOW() as likeTime FROM likes l JOIN business b ON l.businessId = b.businessId WHERE l.userId = #{userId}")
	 public List<Map<String, Object>> getLikesByUserId(String userId);
}
