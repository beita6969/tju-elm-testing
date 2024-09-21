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
}

