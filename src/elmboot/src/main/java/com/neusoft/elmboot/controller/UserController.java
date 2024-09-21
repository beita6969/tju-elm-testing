package com.neusoft.elmboot.controller;

import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserAvatar;
import com.neusoft.elmboot.po.UserPsd;
import com.neusoft.elmboot.service.UserService;
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
 public User getUserByIdByPass(@RequestBody User user) throws Exception {
  return userService.getUserByIdByPass(user);
 }

 @RequestMapping("/getUserById")
 public User getUserById(@RequestBody User user) throws Exception {
  return userService.getUserById(user.getUserId());
 }

 @RequestMapping("/saveUser")
 public int saveUser(@RequestBody User user) throws Exception {
  return userService.saveUser(user);
 }

 @RequestMapping("/changeUserAvatar")
 public int changeUserAvatar(@RequestBody UserAvatar userAvatar) throws Exception {
  return userService.changeUserAvatar(userAvatar);
 }
 
 @RequestMapping("/changeUserName")
 public int changeUserName(@RequestBody User user) throws Exception {
  return userService.changeUserName(user);
 }

 @RequestMapping("/changeUserPassword")
 public int changeUserPassword(@RequestBody UserPsd userPsd) throws Exception {
  return userService.changeUserPassword(userPsd);
 }
 
 @RequestMapping("/userIdExists")
 public int userIdExists(@RequestBody User user) throws Exception {
  return userService.userIdExists(user);
 }

}