package com.neusoft.elmboot.service.impl;
import com.neusoft.elmboot.po.UserPsd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.util.DigestUtils;

import com.neusoft.elmboot.mapper.UserMapper;
import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserAvatar;
import com.neusoft.elmboot.service.UserService;
@Service
public class UserServiceImpl implements UserService {

 @Autowired
 private UserMapper userMapper;

 @Override
 public User getUserByIdByPass(User user) {
  return userMapper.getUserByIdByPass(user);
 }

 @Override
 public User getUserById(String userId) {
  return userMapper.getUserById(userId);
 }

 @Override
 public int saveUser(User user) {
  if(user.getUserImg()==null||user.getUserImg().equals(""))
  return userMapper.saveUser(user);
  
  else return userMapper.saveUser2(user);
 }

 @Override
 public int changeUserPassword(UserPsd userPsd) {

  return userMapper.changeUserPassword(userPsd);
 }
 
// public class UrlToBase64 {  
//	        // 假设这是你的URL  
//	        String url = "http://www.example.com";  
//	  
//	        // 将URL字符串转换为字节数组  
//	        byte[] urlBytes = url.getBytes(java.nio.charset.StandardCharsets.UTF_8);  
//	  
//	        // 使用Base64编码字节数组  
//	        String encodedString = Base64.getEncoder().encodeToString(urlBytes);  
// }
	  

 @Override
 @Transactional
 public int changeUserAvatar(UserAvatar userAvatar) {
  try {
    // 基本参数验证
    if (userAvatar == null || userAvatar.getUserId() == null || userAvatar.getUserImg() == null) {
      return 0;
    }

    // 验证base64格式
    String base64Image = userAvatar.getUserImg();
    if (!base64Image.contains("base64,")) {
      return 0;
    }

    // 验证图片大小（解码后不超过10MB）
    String base64Data = base64Image.substring(base64Image.indexOf(",") + 1);
    byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Data);
    if (imageBytes.length > 10 * 1024 * 1024) { // 增加到10MB
      return 0;
    }

    return userMapper.changeUserAvatar(userAvatar);
  } catch (Exception e) {
    e.printStackTrace();
    return 0;
  }
 }
 
 @Override
 public int changeUserName(User user) {
	 return userMapper.changeUserName(user);
 }
 
 @Override
 public int userIdExists(User user){
	  return userMapper.userIdExists(user);
	 }
 
 @Override
 public User createUser(String username, String password, String phone) {
     User user = new User();
     user.setUserName(username);
     user.setPassword(password);
     user.setDelTag(1);
     
     userMapper.saveUser(user);
     return user;
 }


 @Override
 public boolean register(User user) {
     // 检查用户是否已存在
     if (checkUserIdExists(user.getUserId())) {
         return false;
     }
     
     // 密码加密（使用MD5）
     user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
     // 设置默认值
     user.setDelTag(1);  // 1表示有效用户
     
     return userMapper.saveUser(user) > 0;
 }

 @Override
 public User login(String userId, String password) {
     // 将密码进行MD5加密后比对
     String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());
     return userMapper.getUserByIdAndPassword(userId, encryptedPassword);
 }

 @Override
 public boolean checkUserIdExists(String userId) {
     return userMapper.getUserById(userId) != null;
 }
}