import { useEffect, useState } from 'react';
import { View, Image, Ad } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { Grid } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';
import toolsList from '@/src/global/toolsList';

export default function ToolsList() {
  useShare({
    title: '工具集',
    path: '/subPages/ToolsList/index',
    messageUrl: 'https://qny.weizulin.cn/images/202409251340562.png',
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
        adIntervals={30}
        updatetime={30}
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
