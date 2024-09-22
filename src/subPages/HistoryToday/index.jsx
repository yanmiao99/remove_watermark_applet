import { useEffect, useState } from 'react';
import { View, Image, Ad } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { Steps, Step } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';
import { queryHistoryToday } from '@/src/http/toolsApi.js';
import { BASE_COLOR } from '@/src/global/global';
import dayjs from 'dayjs';

export default function HistoryToday() {
  useShare({
    title: 'HistoryToday',
    path: '/subPages/HistoryToday/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409222019161.png',
  });

  useDidShow(() => {
    getHistoryToday();
  });

  const [historyToday, setHistoryToday] = useState([]);

  const getHistoryToday = async () => {
    Taro.showLoading({
      title: '加载中',
    });

    // 获取今天
    const day = dayjs().format('MMDD');

    const res = await queryHistoryToday({
      day,
    });
    setHistoryToday(res.reverse());
  };

  const handleCopy = (item) => {
    Taro.setClipboardData({
      data: item.title,
    });
  };

  return (
    <View className="history_today_wrapper">
      <Ad
        adIntervals={30}
        updatetime={30}
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ margin: '20px 0' }}
      />
      <View className="today_content">
        <View className="today_date">{dayjs().format('MM月DD日')}</View>

        {historyToday.map((item, index) => {
          return (
            <View
              className="today_item"
              key={index}
              onClick={() => handleCopy(item)}>
              <View
                className="today_item_title"
                style={{ color: BASE_COLOR }}>
                {item.year}
              </View>
              <View className="today_item_content">{item.title}</View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
