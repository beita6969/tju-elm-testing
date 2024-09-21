package com.neusoft.elmboot.controller;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import java.io.IOException;
 
//没有实现的功能：集成高德地图（作废）

@RestController
@RequestMapping("/GeoCodingService")
public class GeoCodingService {
 
    private static final String GEOCODING_API_URL = "http://restapi.amap.com/v3/geocode/geo";
 
    @RequestMapping("/DingWei")
    public void DingWei() throws Exception{
        String apiKey = "59ac3144b19447cb8622ff62ab6c8a66";
        String address = "北京市天安门";
        try {
            double[] coordinates = getCoordinatesByAddress(address, apiKey);
            if (coordinates != null) {
                System.out.println("经度: " + coordinates[0] + ", 纬度: " + coordinates[1]);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
 
    public static double[] getCoordinatesByAddress(String address, String apiKey) throws IOException {
        String requestUrl = GEOCODING_API_URL + "?address=" + address + "&key=" + apiKey;
 
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(requestUrl);
        CloseableHttpResponse response = httpClient.execute(httpGet);
 
        try {
            if (response.getStatusLine().getStatusCode() == 200) {
                String result = EntityUtils.toString(response.getEntity(), "UTF-8");
                Gson gson = new Gson();
                GeoCodingResponse geoCodingResponse = gson.fromJson(result, GeoCodingResponse.class);
                if ("1".equals(geoCodingResponse.getStatus()) && Integer.parseInt(geoCodingResponse.getCount()) > 0) {
                    Geocode location = geoCodingResponse.getGeocodes();
                    String[] parts = location.split(",");
                    return new double[]{Double.parseDouble(parts[0]), Double.parseDouble(parts[1])};
                }
            }
        } finally {
            response.close();
        }
        return null;
    }
 
    // 假设的GeoCodingResponse类，用于解析JSON响应
    static class GeoCodingResponse {
        private String status;
        private String count;
        private Geocode geocodes;
 
        public String getStatus() {
            return status;
        }
 
        public void setStatus(String status) {
            this.status = status;
        }
 
        public String getCount() {
            return count;
        }
 
        public void setCount(String count) {
            this.count = count;
        }
 
        public Geocode getGeocodes() {
            return geocodes;
        }
 
        public void setGeocodes(Geocode geocodes) {
            this.geocodes = geocodes;
        }
    }
 
    static class Geocode {
        private GeoCodeItem[] geocodes;
 
        public GeoCodeItem[] getGeocodes() {
            return geocodes;
        }
 
        public String[] split(String string) {
			// TODO Auto-generated method stub
			return null;
		}

		public void setGeocodes(GeoCodeItem[] geocodes) {
            this.geocodes = geocodes;
        }
    }
 
    static class GeoCodeItem {
        private String location;
 
        public String getLocation() {
            return location;
        }
 
        public void setLocation(String location) {
            this.location = location;
        }
    }
}
