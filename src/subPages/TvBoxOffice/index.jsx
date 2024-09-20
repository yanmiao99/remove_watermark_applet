import { useEffect, useState, useRef } from 'react';
import { View, Image, Ad, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import useShare from '@/src/hooks/useShare';
import { queryTvBoxOffice } from '@/src/http/toolsApi.js';
import { Table } from '@nutui/nutui-react-taro';

export default function TvBoxOffice() {
  useShare({
    title: '电视剧榜单',
    path: '/subPages/TvBoxOffice/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409201907749.png',
  });

  useDidShow(() => {
    getTvBoxOffice();
  });

  const columns = [
    {
      title: '排名',
      key: 'rank',
      align: 'center',
      fixed: 'left',
      width: 50,
    },
    {
      title: '名称',
      key: 'name',
    },
    {
      title: '当前热度',
      key: 'currHeat',
      render: (row) => {
        return <Text>{row.currHeat}万</Text>;
      },
    },
    {
      title: '上线时间',
      key: 'releaseInfo',
    },
    {
      title: '平台',
      key: 'platformDesc',
    },
  ];

  const [columnsData, setColumnsData] = useState([]);

  const getTvBoxOffice = async () => {
    Taro.showLoading({
      title: '加载中...',
    });
    const res = await queryTvBoxOffice();

    let tempColumns = res.sort((a, b) => {
      return a.currHeat - b.currHeat;
    });

    let resTemp = tempColumns.map((item, index) => {
      return {
        rank: index + 1,
        currHeat: item.currHeat,
        ...item.seriesInfo,
      };
    });

    setColumnsData(resTemp);
  };

  return (
    <View className="tv_wrapper">
      <Table
        striped
        style={{ height: 500 }}
        columns={columns}
        data={columnsData}
      />
      <Ad
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ marginTop: '20px' }}
      />
    </View>
  );
}
