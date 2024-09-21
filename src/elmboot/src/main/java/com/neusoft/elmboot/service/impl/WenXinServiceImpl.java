package com.neusoft.elmboot.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.neusoft.elmboot.config.WenXinProperties;
import com.neusoft.elmboot.service.WenXinService;
import com.neusoft.elmboot.util.HttpClientUtil;

@Service
public class WenXinServiceImpl implements WenXinService {
    @Autowired
    private WenXinProperties wenXinProperties;

    /**
     * 向文心一言提问
     * @param question
     * @return
     */
    @Override
    public String wenXinTest(String question) {
        Map<String, String> paramMap = new HashMap<>();
        //拼接请求路径，要把key放在路径参数中
        String url = wenXinProperties.getTokenUrl()+"?client_id="+wenXinProperties.getApiKey()+"&client_secret="+wenXinProperties.getSecretKey()+"&grant_type=client_credentials";
        //向access_token接口发送POST请求，获取响应结果
        String response = null;
        try {
            response = HttpClientUtil.doPost(url, paramMap);
        } catch (IOException e) {
            e.printStackTrace();
        }
        //将响应结果中的access_token获取出来
        JSONObject jsonObject = JSON.parseObject(response);
        String token = jsonObject.getString("access_token");

        //下面携带access_token请求文心服务器
        //编写请求体，把前端传进来的问题拼入
        String paramJson = String.format("%s", question);
        String request = null;
        //发送POST请求，获取请求结果字符串
        try {
        	token="24.08aba675976071475000f485a9c42823.2592000.1728275676.282335-114752595";
            request = HttpClientUtil.doPostWithJson("https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-tiny-8k?access_token=" + token, paramJson);
        } catch (IOException e) {
            e.printStackTrace();
        }
        //截取请求结果中文心一言的回答部分
        JSONObject jsonResponse = JSON.parseObject(request);
        String result = jsonResponse.getString("result");
        //打印输出
        System.out.println("输出结果:" + result);
        //返回结果
        return result;
    }
}
