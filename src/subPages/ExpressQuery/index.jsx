import { useEffect, useState } from 'react';
import { View, Text, NoticeBar } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { BASE_COLOR } from '@/src/global/global';
import { queryExpress } from '@/src/http/toolsApi.js';
import {
  Steps,
  Step,
  Input,
  Form,
  Button,
  Skeleton,
  Space,
} from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';

export default function ExpressQuery() {
  useDidShow(() => {});

  useShare({
    title: '全国快递查询',
    path: '/subPages/ExpressQuery/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409191818811.png',
  });

  const [expressData, setExpressData] = useState([]);

  // 获取快递数据
  const getExpressData = async (values) => {
    setExpressData([]);
    Taro.showLoading({
      title: '查询中...',
    });

    const res = await queryExpress({ id: values.id });
    setExpressData(res);
  };

  return (
    <View className="express_query_wrapper">
      <View className="query_operation">
        <Form
          onFinish={(values) => getExpressData(values)}
          footer={
            <Button
              nativeType="submit"
              block
              className="query_btn"
              type="primary">
              查询快递信息
            </Button>
          }>
          <Form.Item
            label=""
            name="id"
            rules={[{ required: true, message: '请输入快递编号' }]}>
            <Input
              clearable
              placeholder="点击输入快递编号"
              type="text"
            />
          </Form.Item>
        </Form>
      </View>

      <View className="query_content">
        {expressData && expressData.length ? (
          <Space direction="vertical">
            <View className="query_title">快递查询结果</View>
            <Steps
              direction="vertical"
              value={expressData.length}>
              {expressData.map((item, index) => {
                return (
                  <Step
                    key={index}
                    value={expressData.length - index}
                    title={item.location || item.time}
                    description={
                      <View
                        style={{
                          marginBlock: '20px',
                        }}>
                        <View>{item.time}</View>
                        <View>{item.context}</View>
                      </View>
                    }
                  />
                );
              })}
            </Steps>
          </Space>
        ) : (
          <Skeleton
            rows={3}
            title
            animated
          />
        )}
      </View>
    </View>
  );
}
