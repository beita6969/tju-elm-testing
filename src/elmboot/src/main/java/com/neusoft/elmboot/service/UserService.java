package com.neusoft.elmboot.service;

import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserAvatar;
import com.neusoft.elmboot.po.UserPsd;

public interface UserService {

    public User getUserByIdByPass(User user);

    public User getUserById(String userId);

    public int saveUser(User user);

    public int changeUserPassword(UserPsd userPsd);

    public int changeUserAvatar(UserAvatar userAvatar);

    public int changeUserName(User user);

    public int userIdExists(User user);

    // 用户注册
    boolean register(User user);

    // 用户登录
    User login(String userId, String password);

    // 检查用户ID是否已存在
    boolean checkUserIdExists(String userId);

    public User createUser(String username, String password, String phone);

}
