import { useState } from 'react';
import { TextArea, Button, Form, Space, Cell } from '@nutui/nutui-react-taro';
import { View, Ad } from '@tarojs/components';
import { analysisURL } from '@/src/http/api.js';
import Taro from '@tarojs/taro';
import PlatformList from '@/src/components/PlatformList';
import './index.less';
import { ArrowRight, Copy, Star } from '@nutui/icons-react-taro';
import { SHARE_APP_MESSAGE_URL } from '@/src/global/global';
import useShare from '@/src/hooks/useShare';

export default function RemoveWatermark() {
  const [loading, setLoading] = useState(false);
  const [formRef] = Form.useForm();

  useShare({
    title: '免费去水印',
    path: '/pages/RemoveWatermark/index',
    imageUrl: SHARE_APP_MESSAGE_URL,
  });

  // 提交表单
  const onFinish = async (values) => {
    const reg = /https?:\/\/[^\s]+/g;
    const textRes = values.url.match(reg);

    if (!textRes) {
      Taro.showToast({
        title: '请输入正确的 URL 地址 ~',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    const url = textRes[0];

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const res = await analysisURL({
      url,
      platform: 'WeChatApplet',
    });

    const resData = res.data;
    console.log('resData========', resData);
    setLoading(false);

    // 跳转到详情页
    Taro.navigateTo({
      url: `/pages/AnalysisDetails/index?data=${encodeURIComponent(
        JSON.stringify(resData)
      )}`,
    });
  };

  // 粘贴链接
  const handlePasteLink = () => {
    Taro.getClipboardData({
      success: (res) => {
        const url = res.data;
        if (url) {
          onFinish({ url });
        }
      },
    });
  };

  // 跳转页面
  const handleOperation = (type) => {
    Taro.navigateTo({
      url: `/pages/${type}/index`,
    });
  };

  // 跳转到子包
  const handleToSubPackage = (type) => {
    Taro.navigateTo({
      url: `/subPages/${type}/index`,
    });
  };

  return (
    <View className="remove_watermark_wrapper">
      <PlatformList formRef={formRef} />

      <Form
        form={formRef}
        onFinish={onFinish}
        footer={
          <Space
            style={{ width: '100%' }}
            justify="end">
            <Button
              disabled={loading}
              icon={<Copy size="14" />}
              onClick={handlePasteLink}
              loading={loading}
              className="watermark_btn"
              type="primary">
              粘贴链接
            </Button>

            <Button
              disabled={loading}
              icon={<Star size="14" />}
              loading={loading}
              formType="submit"
              className="watermark_btn"
              type="primary">
              开始解析
            </Button>
          </Space>
        }>
        <Form.Item
          required
          label=""
          name="url"
          rules={[
            {
              required: true,
              message: '请输入平台对应的 URL 地址 ~',
            },
            {
              pattern: /http/,
              message: '请输入正确的 URL 地址 ~',
            },
          ]}>
          <TextArea placeholder="请粘贴视频链接或者图集链接" />
        </Form.Item>
      </Form>

      <View className="operation">
        <Cell.Group>
          <Cell
            onClick={() => handleOperation('FAQ')}
            title="常见问题"
            extra={<ArrowRight size="14" />}
          />
          <Cell
            onClick={() => handleOperation('Tutorial')}
            title="操作教程"
            extra={<ArrowRight size="14" />}
          />
          <Cell
            onClick={() => handleOperation('CreateActivationCode')}
            title="激活码生成"
            extra={<ArrowRight size="14" />}
          />
          <Cell
            onClick={() => handleToSubPackage('ToolsList')}
            title="工具集"
            extra={<ArrowRight size="14" />}
          />
        </Cell.Group>
      </View>

      <Ad
        adIntervals={30}
        updatetime={30}
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ margin: '20px 0' }}
      />
    </View>
  );
}
