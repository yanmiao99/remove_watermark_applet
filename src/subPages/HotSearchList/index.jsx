import { useEffect, useState } from 'react';
import { View, Text, Image, Ad } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { BASE_COLOR } from '@/src/global/global';
import { queryHotSearch } from '@/src/http/toolsApi.js';
import { Tabs, BackTop, Skeleton } from '@nutui/nutui-react-taro';
import { Top, Refresh } from '@nutui/icons-react-taro';
import useShare from '@/src/hooks/useShare';

const tabsMap = [
  { title: '百度', value: 'baidu' },
  { title: '微博', value: 'weibo' },
  { title: '知乎', value: 'zhihu' },
];

export default function HotSearchList() {
  useDidShow(() => {
    getHotSearch(tabsMap[tabValue].value);
  });

  useShare({
    title: '热搜榜单',
    path: '/subPages/HotSearchList/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409191819606.png',
  });

  const [tabValue, setTabValue] = useState(0);
  const [hotSearchList, setHotSearchList] = useState([]);

  // 获取热搜数据
  const getHotSearch = async (type) => {
    setHotSearchList([]);
    Taro.showLoading({
      title: '加载中...',
      mask: true,
    });
    const res = await queryHotSearch({ type });
    console.log(res);
    setHotSearchList(res);
  };

  // 跳转到详情页
  const handleGotoDetail = (item) => {
    Taro.showModal({
      title: '提示',
      content: '网页链接已经复制到剪贴板，请复制到浏览器中打开链接',
      showCancel: false,
      confirmColor: BASE_COLOR,
      success: (res) => {
        if (res.confirm) {
          // 将链接拷贝到剪贴板
          Taro.setClipboardData({
            data: item.url,
            success: () => {
              console.log('复制成功');
            },
          });
        }
      },
    });
  };

  return (
    <View className="hot_search_list">
      <View className="list_tab">
        <Tabs
          value={tabValue}
          activeType="smile"
          onChange={(value) => {
            setTabValue(value);
            getHotSearch(tabsMap[value].value);
          }}>
          {tabsMap.map((item, index) => {
            return (
              <Tabs.TabPane
                title={item.title}
                value={index}
                key={index}
              />
            );
          })}
        </Tabs>
      </View>

      <View className="list_wrapper">
        {hotSearchList.length ? (
          <>
            <Ad
              unit-id="adunit-fc0b31a19db60c2b"
              style={{ marginBottom: '20px' }}
            />
            {hotSearchList.map((item) => {
              return (
                <View
                  onClick={() => handleGotoDetail(item)}
                  className="list_item"
                  key={item.index}>
                  <View className="list_item_index">{item.index}</View>

                  <View className="list_item_content">
                    <View className="list_item_title">{item.title}</View>

                    {item.desc ? (
                      <View className="list_item_desc">{item.desc}</View>
                    ) : null}

                    <View className="list_item_hot">{item.hot}</View>
                  </View>

                  <View className="list_item_img">
                    <Image src={item.pic} />
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <View className="list_no_data">
            <Refresh className="nut-icon-am-rotate nut-icon-am-infinite" />
            <Text>数据加载中...</Text>
          </View>
        )}
      </View>

      <BackTop
        threshold={200}
        style={{
          bottom: '50px',
          insetInlineEnd: '20px',
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Top size={12} />
          <div style={{ fontSize: '12px' }}>顶部</div>
        </div>
      </BackTop>
    </View>
  );
}
