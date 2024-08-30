package com.neusoft.elmboot.service;

import com.neusoft.elmboot.po.User;

public interface UserService {

	public User getUserByIdByPass(User user);
	public int getUserById(String userId);
	public int saveUser(User user);
}
