package com.neusoft.elmboot.controller;

import com.neusoft.elmboot.po.User;
import com.neusoft.elmboot.po.UserAvatar;
import com.neusoft.elmboot.po.UserPsd;
import com.neusoft.elmboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/UserController")
public class UserController {

    @Autowired
    private UserService userService;

//    @Autowired
//    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        
        if (userService.register(user)) {
            result.put("code", 1);
            result.put("msg", "注册成功");
        } else {
            result.put("code", 0);
            result.put("msg", "注册失败，用户ID已存在");
        }
        return result;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam("userId") String userId, 
                                   @RequestParam("password") String password) {
        Map<String, Object> result = new HashMap<>();
        
        User user = userService.login(userId, password);
        if (user != null) {
//            String token = jwtUtil.generateToken(userId);
            result.put("code", 1);
            result.put("msg", "登录成功");
            result.put("user", user);
//            result.put("token", token);
        } else {
            result.put("code", 0);
            result.put("msg", "登录失败，用户名或密码错误");
        }
        return result;
    }

    @PostMapping(value = "/getUserByIdByPass", consumes = "application/json")
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
    public Map<String, Object> changeUserAvatar(@RequestBody UserAvatar userAvatar) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            int updateResult = userService.changeUserAvatar(userAvatar);
            if (updateResult > 0) {
                result.put("code", 1);
                result.put("msg", "头像更新成功");
            } else {
                result.put("code", 0);
                result.put("msg", "头像更新失败");
            }
        } catch (Exception e) {
            result.put("code", 0);
            result.put("msg", "头像更新失败：" + e.getMessage());
            e.printStackTrace();
        }
        
        return result;
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