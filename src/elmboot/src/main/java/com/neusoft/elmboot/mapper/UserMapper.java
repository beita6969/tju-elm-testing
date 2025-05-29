package com.neusoft.elmboot.mapper;

import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserAvatar;
import com.neusoft.elmboot.po.UserPsd;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE userId = #{userId} AND password=#{password} AND delTag = 1")
    public User getUserByIdByPass(User user);

    @Insert("insert into user values(#{userId},#{password},#{userName},#{userSex},#{userImg},1)")
    public int saveUser(User user);

    @Update("UPDATE user u SET u.userImg =#{userImg} WHERE u.userId =#{userId}")
    public int changeUserAvatar(UserAvatar userAvatar);

    @Update("update user set password=#{newPassword} where userId=#{userId} and password=#{oldPassword}")
    public int changeUserPassword(UserPsd userPsd);

    @Update("UPDATE user SET userName=#{userName} WHERE userId=#{userId}")
    public int changeUserName(User user);

    @Select("select count(*) from user where userId=#{userId}")
    public int userIdExists(User user);

    @Select("SELECT * FROM user WHERE userId = #{userId} AND password = #{password} AND delTag = 1")
    public User getUserByIdAndPassword(@Param("userId") String userId, @Param("password") String password);
    
    @Select("SELECT * FROM user WHERE userId = #{userId} AND delTag = 1")
    public User getUserById(@Param("userId") String userId);

}