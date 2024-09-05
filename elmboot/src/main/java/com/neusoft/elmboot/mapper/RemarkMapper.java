package com.neusoft.elmboot.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import com.neusoft.elmboot.po.Remark;

@Mapper
public interface RemarkMapper {

    @Select("select * from remark where businessId=#{businessId}")
    public List<Remark> listRemarksByBusinessId(Integer businessId);
    
    @Insert("insert into remark(remark,userId,userName,businessId,remarkDate) values(#{remark},#{userId},#{userName},#{businessId},#{remarkDate})")
    @Options(useGeneratedKeys = true, keyProperty = "remarkId", keyColumn = "remarkId")
    public int saveRemarks(Remark remark);
    
    //删除某用户某条评论
    @Select("delete from remark where userId=#{userId} and businessId =#{businessId } and userName=#{userName} and remark=#{remark}" )
    public int removeOneRemark(Remark remark);
    
    
    
    
    
    
    //删除某用户所有评论
    @Select("delete from remark where userId=#{userId}")
    public List<Remark> removeAllRemarksByUserId(String userId);
	
}
