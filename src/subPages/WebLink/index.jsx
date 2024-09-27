import { useEffect, useState } from 'react';
import { View, WebView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';

export default function WebLink() {
  useDidShow(() => {
    // 获取传递过来的url参数
    const params = Taro.getCurrentInstance().router.params;

    const deCode = decodeURIComponent(params.data);

    const data = JSON.parse(deCode);

    const { url, title } = data;

    // 设置导航栏标题
    Taro.setNavigationBarTitle({
      title: title || '详情',
    });

    // 设置url
    setUrl(url);
  });

  const [url, setUrl] = useState([]);

  return (
    <View className="web_link_wrapper">
      <WebView src={url} />
    </View>
  );
}
