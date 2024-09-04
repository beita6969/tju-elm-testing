package com.neusoft.elmboot.service;
import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserImg;
import com.neusoft.elmboot.po.UserName;
import com.neusoft.elmboot.po.UserPsd;
import org.apache.ibatis.annotations.Param;

public interface UserService {
 public User getUserByIdByPass(User user);
 public User getUserById(String userId);
 public int saveUser(User user);


    public int changeUserPassword(UserPsd userPsd);

    public int changeUserAvatar(UserImg userImg);
    
    public int changeUserName(UserName userName);
}

