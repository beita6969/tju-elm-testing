package com.neusoft.elmboot.mapper;

import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserPsd;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
 @Select("select * from user where userId=#{userId} and password=#{password}")
 public User getUserByIdByPass(User user);
 
 @Select("select * from user where userId=#{userId}")
 public User getUserById(String userId);
 
 @Insert("insert into user values(#{userId},#{password},#{userName},#{userSex},null,1)")
 public int saveUser(User user);

 @Update("UPDATE user u SET u.userImg =null WHERE u.userId =#{userId}")
 public int prechangeUserAvatar(@Param("userId") String userId);

 @Update("UPDATE user u SET u.userImg =#{base64} WHERE u.userId =#{userId}")
 public int changeUserAvatar(@Param("userId") String userId, @Param("base64") String base64);

 @Update("update user set password=#{newPassword} where userId=#{userId} and password=#{oldPassword}")
 public int changeUserPassword(UserPsd userPsd);
 
 @Update("UPDATE user u SET u.userName =#{name} WHERE u.userId =#{userId}")
 public int changeUserName(String userId, String name);
}