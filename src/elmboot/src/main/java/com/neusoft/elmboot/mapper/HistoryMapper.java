package com.neusoft.elmboot.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.neusoft.elmboot.po.History;

@Mapper
public interface HistoryMapper {

	@Select("select s.searchContent from searchhistory s where s.userId=#{userId}")
	public String getHistoryByUserId(History history);
	
	@Select("select count(*) from searchhistory where userId=#{userId}")
	public int findHistoryByUserId(History history);

	@Select("select count(*) from searchhistory where userId=#{userId}")
	public int judgeExist(History history);

	@Insert("insert into searchhistory values(#{userId},#{searchContent})")
	public int saveHistory(History history);

	@Update("UPDATE searchhistory SET searchContent =#{searchContent} WHERE userId =#{userId}")
	public int updateHistory(History history);
	
	
	
}
