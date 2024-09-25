import { useEffect, useState } from 'react';
import { View, Image, Ad } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { Grid } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';
import { queryExpress } from '@/src/http/toolsApi.js';

export default function Template() {
  useShare({
    title: '模板',
    path: '/subPages/Template/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409200920292.jpg',
  });

  useDidShow(() => {});

  return (
    <View className="template_wrapper">
      <Ad
        adIntervals={30}
        updatetime={30}
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ margin: '20px 0' }}
      />
    </View>
  );
}
