//package com.neusoft.elmboot.interceptor;
//
//import com.neusoft.elmboot.util.JwtUtil;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.springframework.web.servlet.HandlerInterceptor;
//
//@Component
//public class JwtAuthInterceptor implements HandlerInterceptor {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        // 从请求头中获取token
//        String token = request.getHeader("Authorization");
//
//        // 如果是登录或注册接口，直接放行
//        if (request.getRequestURI().contains("/user/login") ||
//            request.getRequestURI().contains("/user/register")) {
//            return true;
//        }
//
//        // 验证token
//        if (token == null || !token.startsWith("Bearer ")) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            return false;
//        }
//
//        token = token.substring(7);
//
//        if (!jwtUtil.validateToken(token)) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            return false;
//        }
//
//        // 将用户ID添加到请求属性中
//        request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
//        return true;
//    }
//}