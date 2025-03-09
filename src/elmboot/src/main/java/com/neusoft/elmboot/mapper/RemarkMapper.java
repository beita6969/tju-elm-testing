package com.neusoft.elmboot.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import com.neusoft.elmboot.po.Remark;

@Mapper
public interface RemarkMapper {

    @Select("select * from remarks where businessId=#{businessId}")
    public List<Remark> listRemarksByBusinessId(Integer businessId);
    
    @Insert("insert into remarks(remark,businessId,remarkDate,userId,userName) values(#{remark},#{businessId},#{remarkDate},#{userId},#{userName})")
    @Options(useGeneratedKeys = true, keyProperty = "remarkId", keyColumn = "remarkId")
    public int saveRemarks(Remark remark);
    
    //删除某用户某条评论
    @Select("delete from remarks where userId=#{userId} and businessId =#{businessId } and remark=#{remark}" )
    public int removeOneRemark(Remark remark);
    
    
    //删除某用户所有评论
    @Select("delete from remark where userId=#{userId}")
    public List<Remark> removeAllRemarksByUserId(String userId);
	
    @Select("select count(*) from remarks where businessId=#{businessId}")
    public int getRemarkCountByBusinessId(Integer businessId);
}
