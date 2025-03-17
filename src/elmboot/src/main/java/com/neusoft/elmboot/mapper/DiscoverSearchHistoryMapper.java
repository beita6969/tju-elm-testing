package com.neusoft.elmboot.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.neusoft.elmboot.po.DiscoverSearchHistory;

@Mapper
public interface DiscoverSearchHistoryMapper {
    
    @Insert("INSERT INTO discover_search_history (user_id, query, results, current_page) VALUES (#{userId}, #{query}, #{results}, #{currentPage})")
    @Options(useGeneratedKeys=true, keyProperty="id", keyColumn="id")
    public int saveSearchHistory(DiscoverSearchHistory history);
    
    @Select("SELECT * FROM discover_search_history WHERE user_id = #{userId} ORDER BY id ASC")
    public List<DiscoverSearchHistory> getSearchHistoryByUserId(String userId);
    
    @Update("UPDATE discover_search_history SET current_page = #{currentPage} WHERE id = #{id}")
    public int updateCurrentPage(DiscoverSearchHistory history);
    
    @Delete("DELETE FROM discover_search_history WHERE user_id = #{userId}")
    public int deleteSearchHistoryByUserId(String userId);
} 