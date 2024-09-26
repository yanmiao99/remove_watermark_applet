import { useEffect, useState } from 'react';
import { View, Image, Ad } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import useShare from '@/src/hooks/useShare';
import HotPosition from '@/src/components/HotPosition';

export default function ToolsList() {
  useShare({
    title: '一个超级实用的工具箱，快来看看吧！',
    path: '/subPages/ToolsList/index',
    messageUrl: 'https://qny.weizulin.cn/images/202409260920724.jpg',
  });

  useDidShow(() => {});

  return (
    <View className="tools_wrapper">
      <HotPosition isShowAll={true} />
    </View>
  );
}
