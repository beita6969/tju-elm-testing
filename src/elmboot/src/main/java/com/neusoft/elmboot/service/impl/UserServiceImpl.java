package com.neusoft.elmboot.service.impl;
import com.neusoft.elmboot.po.UserPsd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

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
//     System.out.println(base64);
//     System.out.println(userId);
//     String base64Encoder = java.util.Base64.UrlToBase64.imageChangeBase64(base64);
//     System.out.println(base64Encoder);
//        byte[] buffer = null;
//        try {
//            buffer = file.getBytes();
//            base64Encoder = Base64.encodeBase64String(buffer);
//            // 防止Base64编码中含有换行符，统一全部替换掉
//            base64Encoder = base64Encoder.replaceAll("[\\s*\t\n\r]", "");
//            // 添加前端读取需要的前缀
//            base64Encoder = "data:image/png;base64," + base64Encoder;
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//  
  return userMapper.changeUserAvatar(userAvatar);

 }
 
 @Override
 public int changeUserName(User user) {
	 return userMapper.changeUserName(user);
 }
 
 @Override
 public int userIdExists(User user){
	  return userMapper.userIdExists(user);
	 }
 
 
}