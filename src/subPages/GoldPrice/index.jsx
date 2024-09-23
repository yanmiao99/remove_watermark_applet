import { useEffect, useState, useRef } from 'react';
import { View, Image, Ad } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { Tabs, Button, Table } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';
import { queryGoldPrice } from '@/src/http/goldApi.js';
import { Refresh } from '@nutui/icons-react-taro';

export default function GoldPrice() {
  useShare({
    title: '黄金价格',
    path: '/subPages/GoldPrice/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409231232375.png',
  });

  useDidShow(() => {
    getGoldPrice();
  });

  // 国内十大金店
  const [tenColumnsData, setTenColumnsData] = useState([]);
  const tenColumns = [
    {
      title: '品牌',
      key: '品牌',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: '黄金价格',
      key: '黄金价格',
      align: 'center',
    },
    {
      title: '铂金价格',
      key: '铂金价格',
      align: 'center',
    },
    {
      title: '金条价格',
      key: '金条价格',
      align: 'center',
    },
    {
      title: '单位',
      key: '单位',
      align: 'center',
    },
    {
      title: '报价时间',
      key: '报价时间',
      align: 'center',
    },
  ];

  // 国际黄金
  const [interColumnsData, setInterColumnsData] = useState([]);
  const interColumns = [
    {
      title: '品种',
      key: '品种',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: '最新价',
      key: '最新价',
      align: 'center',
    },
    {
      title: '涨跌',
      key: '涨跌',
      align: 'center',
    },
    {
      title: '幅度',
      key: '幅度',
      align: 'center',
    },
    {
      title: '最高价',
      key: '最高价',
      align: 'center',
    },
    {
      title: '最低价',
      key: '最低价',
      align: 'center',
    },
    {
      title: '报价时间',
      key: '报价时间',
      align: 'center',
    },
  ];

  // 国内黄金
  const [goldColumnsData, setGoldColumnsData] = useState([]);

  // tabs
  const [tabValue, setTabValue] = useState(0);

  const getGoldPrice = async () => {
    setTenColumnsData([]);
    setInterColumnsData([]);
    setGoldColumnsData([]);
    Taro.showLoading({
      title: '加载中...',
    });

    const res = await queryGoldPrice();
    console.log(res);
    setTenColumnsData(res['国内十大金店']);
    setInterColumnsData(res['国际黄金']);
    setGoldColumnsData(res['国内黄金']);
  };

  return (
    <View className="gold_price_wrapper">
      <Button
        type="primary"
        className="gold_refresh"
        onClick={getGoldPrice}>
        <View className="gold_refresh_btn">
          <Refresh />
          <View style={{ fontSize: '12px' }}>刷新</View>
        </View>
      </Button>
      <Tabs
        style={{ background: 'transparent' }}
        value={tabValue}
        autoHeight
        activeType="smile"
        onChange={(value) => {
          setTabValue(value);
        }}>
        <Tabs.TabPane
          title={'国内黄金'}
          value={0}>
          <View className="gold_title">国内黄金</View>
          <Table
            striped
            style={{ maxHeight: 400 }}
            columns={interColumns}
            data={goldColumnsData}
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          title={'国际黄金'}
          value={1}>
          <View className="gold_title">国际黄金</View>
          <Table
            striped
            style={{ maxHeight: 400 }}
            columns={interColumns}
            data={interColumnsData}
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          title={'国内十大金店'}
          value={2}>
          <View className="gold_title">国内十大金店</View>
          <Table
            striped
            style={{ maxHeight: 400 }}
            columns={tenColumns}
            data={tenColumnsData}
          />
        </Tabs.TabPane>
      </Tabs>

      <View className="gold_ad">
        <Ad
          adIntervals={30}
          updatetime={30}
          unit-id="adunit-fc0b31a19db60c2b"
        />
      </View>
    </View>
  );
}
