package com.neusoft.elmboot.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.neusoft.elmboot.po.Favorite;

@Mapper
public interface FavoriteMapper {
	
	 @Insert("insert into favorite values(#{userId},#{businessId})")
	 public int saveFavoriteBusinessId(Favorite favorite);
	
	 @Select("select f.businessId from favorite f where f.userId=#{userId}")
	 public List<Integer> listFavoriteByUserId(String userId);

}
