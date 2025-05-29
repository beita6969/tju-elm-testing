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
  if(user.getUserImg()==null||user.getUserImg().equals("")){
      user.setUserImg("data:image/png;base64,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");
  }
  return userMapper.saveUser(user);
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