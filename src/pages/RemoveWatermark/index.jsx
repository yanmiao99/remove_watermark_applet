import { useState } from 'react';
import { TextArea, Button, Form, Space, Cell } from '@nutui/nutui-react-taro';
import { View, Ad } from '@tarojs/components';
import { analysisURL } from '@/src/http/api.js';
import Taro from '@tarojs/taro';
import PlatformList from '@/src/components/PlatformList';
import './index.less';
import { ArrowRight, Copy, Star, Share } from '@nutui/icons-react-taro';
import useShare from '@/src/hooks/useShare';
import HotPosition from '@/src/components/HotPosition';
import { BASE_COLOR } from '@/src/global/global';

export default function RemoveWatermark() {
  const [loading, setLoading] = useState(false);
  const [formRef] = Form.useForm();

  useShare({
    title: '我正在使用短视频免费去水印工具，快来试试吧！',
    path: '/pages/RemoveWatermark/index',
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
              style={{ background: BASE_COLOR }}
              disabled={loading}
              icon={<Copy size="14" />}
              onClick={handlePasteLink}
              loading={loading}
              className="watermark_btn"
              type="primary">
              粘贴链接
            </Button>

            <Button
              style={{ background: BASE_COLOR }}
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

      <button
        className="share_box"
        open-type="share"
        style={{ color: BASE_COLOR }}>
        <View>点击分享给好友,共同解锁更多有趣的视频</View>
        <Share />
      </button>

      <View className="operation">
        <HotPosition />

        <Cell.Group>
          <Cell
            onClick={() => handleToSubPackage('ToolsList')}
            title="工具集"
            extra={<ArrowRight size="14" />}
          />
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
        </Cell.Group>
      </View>
    </View>
  );
}
