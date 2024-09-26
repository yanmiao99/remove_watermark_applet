import { useEffect, useState } from 'react';
import { View, Image, Ad, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { Button } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';
import { queryCrazyThursday } from '@/src/http/toolsApi.js';
import { Reload, Copy } from '@nutui/icons-react-taro';

export default function CrazyThursday() {
  useShare({
    // title: '疯狂星期四文案大全',
    title: 'KTC VME50 !!!',
    path: '/subPages/CrazyThursday/index',
    messageUrl: 'https://qny.weizulin.cn/images/202409251300066.png',
    timelineUrl: 'https://qny.weizulin.cn/images/202409202142563.jpg',
  });

  useDidShow(() => {
    getCopywriting();
  });

  const [copywriting, setCopywriting] = useState('');

  // 随机返回一张图片
  const randomImg = () => {
    // 随机获取 1-16 中的一个数字
    const random = Math.floor(Math.random() * 16) + 1;
    return require(`./assets/${random}.jpg`);
  };

  // 获取疯狂星期四文案
  const getCopywriting = async () => {
    Taro.showLoading({ title: '加载中...' });
    const res = await queryCrazyThursday();
    setCopywriting(res);
  };

  // 复制文本
  const handleCopyText = () => {
    Taro.setClipboardData({
      data: copywriting,
      success: () => {
        Taro.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000,
        });
      },
    });
  };

  return (
    <View className="crazy_thursday_wrapper">
      <View className="crazy_thursday_content">
        <View className="crazy_thursday_img">
          <Image
            src={randomImg()}
            mode={'aspectFit'}
          />
        </View>

        <View className="crazy_thursday_desc">{copywriting}</View>

        <View className="crazy_thursday_btn_group">
          <Button
            onClick={handleCopyText}
            className="crazy_thursday_btn"
            type="primary">
            <Copy />
            <Text>复制</Text>
          </Button>

          <Button
            onClick={getCopywriting}
            className="crazy_thursday_btn"
            type="primary">
            <Reload />
            <Text>换一换</Text>
          </Button>
        </View>
      </View>
      <Ad
        adIntervals={30}
        updatetime={30}
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ marginTop: '20px' }}
      />
    </View>
  );
}
