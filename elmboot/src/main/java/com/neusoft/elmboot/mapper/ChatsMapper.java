package com.neusoft.elmboot.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.neusoft.elmboot.po.Chats;
import com.neusoft.elmboot.po.User;



@Mapper
public interface ChatsMapper {
	 @Select("select * from chats where userId=#{userId}")
	 public List<Chats> getChatsByUserId(String userId);

	 @Insert("insert into chats values(#{senderUserId},#{receiverUserId},#{message})")
	 public int saveChats(Chats chats);
	 
}
