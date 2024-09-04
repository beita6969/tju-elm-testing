package com.neusoft.elmboot.controller;

import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserImg;
import com.neusoft.elmboot.po.UserName;
import com.neusoft.elmboot.po.UserPsd;
import com.neusoft.elmboot.po.image;
import com.neusoft.elmboot.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/UserController")
public class  UserController {

 @Autowired
 private UserService userService;

 @RequestMapping("/getUserByIdByPass")
 public User getUserByIdByPass(User user) throws Exception {
  return userService.getUserByIdByPass(user);
 }

 @RequestMapping("/getUserById")
 public User getUserById(User user) throws Exception {
  return userService.getUserById(user.getUserId());
 }

 @RequestMapping("/saveUser")
 public int saveUser(@Valid User user) throws Exception {
  return userService.saveUser(user);
 }

 @RequestMapping("/changeUserAvatar")//base64
 public int changeUserAvatar( UserImg userImg) throws Exception {
  return userService.changeUserAvatar(userImg);
 }
 
 @RequestMapping("/changeUserName")
 public int changeUserName(UserName userName) throws Exception {
  return userService.changeUserName(userName);
 }

 @RequestMapping("/changeUserPassword")
 public int changeUserPassword(UserPsd userPsd) throws Exception {
  return userService.changeUserPassword(userPsd);
 }

}