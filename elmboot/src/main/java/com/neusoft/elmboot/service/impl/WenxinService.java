package com.neusoft.elmboot.service.impl;


import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class WenxinService {

    @Value("${wenxin.api.key}")
    private String apiKey;

    @Value("${wenxin.api.url}")
    private String apiUrl;

    public String queryWenxin(String question) {
        // 构造请求参数和头信息
        OkHttpClient client = new OkHttpClient();
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        String json = "{\"question\":\"" + question + "\"}";
        RequestBody body = RequestBody.create(json, JSON);

        Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            String responseBody = response.body().string();
            // 解析响应结果，返回用户需要的部分
            return parseResponse(responseBody);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String parseResponse(String responseBody) {
        // 这里需要根据实际返回的JSON格式进行解析
        // ...
        return "解析后的结果";
    }
}

