import { useEffect, useState } from 'react';
import { View, Image, Ad } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { Grid } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';

const toolsList = [
  {
    title: '全国快递查询',
    icon: 'https://qny.weizulin.cn/images/202409191818811.png',
    url: 'ExpressQuery',
  },
  {
    title: '热搜榜',
    icon: 'https://qny.weizulin.cn/images/202409191819606.png',
    url: 'HotSearchList',
  },
  {
    title: '国庆头像',
    icon: 'https://qny.weizulin.cn/images/202409191819606.png',
    url: 'NationalDayAvatar',
  },
];

export default function CreateActivationCode() {
  useShare({
    title: '工具集',
    path: '/subPages/ToolsList/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409200920292.jpg',
  });

  useDidShow(() => {});

  const handleClickGridItem = (url) => {
    Taro.navigateTo({
      url: `/subPages/${url}/index`,
    });
  };

  return (
    <View className="tools_wrapper">
      <Ad
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ margin: '20px 0' }}
      />
      <Grid
        gap={3}
        columns={3}>
        {toolsList.map((item, index) => {
          return (
            <Grid.Item
              style={{
                borderRadius: '10px',
              }}
              onClick={() => handleClickGridItem(item.url)}
              key={item.title}
              text={item.title}>
              <Image
                src={item.icon}
                mode="widthFix"
                style={{ width: '30px', height: '30px' }}
              />
            </Grid.Item>
          );
        })}
      </Grid>
    </View>
  );
}
