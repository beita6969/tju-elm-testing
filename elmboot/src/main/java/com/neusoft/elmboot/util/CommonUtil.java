package com.neusoft.elmboot.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class CommonUtil {
	public static String getCurrentDate1() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar calendar = Calendar.getInstance();
		return sdf.format(calendar.getTime());
	}

	public static String getCurrentDate() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
		Calendar calendar = Calendar.getInstance();
		return sdf.format(calendar.getTime());
	}

	public static String getCurrentDate2() {
		//获取下一周周末的时间
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, 7);
		//将时间近似到下一天0点
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		return sdf.format(calendar.getTime());
	}

	public static int compareDate(String expiredTime, String currentDate) {//比较时间
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			if (sdf.parse(expiredTime).getTime() > sdf.parse(currentDate).getTime()) {
				return 1;
			} else if (sdf.parse(expiredTime).getTime() < sdf.parse(currentDate).getTime()) {
				return -1;
			} else {
				return 0;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}
}
