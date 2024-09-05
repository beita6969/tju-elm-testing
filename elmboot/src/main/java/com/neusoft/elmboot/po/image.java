package com.neusoft.elmboot.po;

public class image
{

        private int id;
        private String name;
        private String data; // 这里用字符串来表示Base64编码的图片数据
        private String type;

        // 省略构造函数和其他方法

            // 省略其他字段

            public int getId() {
                return id;
            }

            public void setId(int id) {
                this.id = id;
            }

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }

            public String getData() {
                return data;
            }

            public void setData(String data) {
                this.data = data;
            }

            public String getType() {
                return type;
            }

            public void setType(String type) {
                this.type = type;
            }


}



