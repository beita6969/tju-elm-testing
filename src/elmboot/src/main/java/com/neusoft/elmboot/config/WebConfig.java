//package com.neusoft.elmboot.config;
//
//import com.neusoft.elmboot.interceptor.JwtAuthInterceptor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Autowired
//    private JwtAuthInterceptor jwtAuthInterceptor;
//
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(jwtAuthInterceptor)
//                .addPathPatterns("/**")
//                .excludePathPatterns("/user/login", "/user/register");
//    }
//}