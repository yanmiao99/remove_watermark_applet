import { useState, useRef } from 'react';
import { TextArea, Button, Form, Space, Cell } from '@nutui/nutui-react-taro';
import { View, Ad } from '@tarojs/components';
import { analysisURL } from '@/src/http/api.js';
import PlatformList from '@/src/components/PlatformList';
import './index.less';
import { ArrowRight, Copy, Star, Share } from '@nutui/icons-react-taro';
import useShare from '@/src/hooks/useShare';
import HotPosition from '@/src/components/HotPosition';
import { BASE_COLOR } from '@/src/global/global';
import Taro, { useDidShow } from '@tarojs/taro';

export default function RemoveWatermark() {
  const [loading, setLoading] = useState(false);
  const [formRef] = Form.useForm();

  useShare({
    title: '我正在使用短视频免费去水印工具，快来试试吧！',
    path: '/pages/RemoveWatermark/index',
  });

  useDidShow(() => {
    const today = new Date().toLocaleDateString();
    const lastDate = Taro.getStorageSync('lastDate') || today;

    // 如果不是今天的日期，重置解析次数
    if (today !== lastDate) {
      Taro.setStorageSync('analysisCount', 0);
      Taro.setStorageSync('lastDate', today);
    }
  });

  const handleOpenAd = () => {
    Taro.hideLoading();
    Taro.showLoading({
      title: '广告加载中',
    });

    // 在页面中定义激励视频广告
    let videoAd = null;

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-b2b28b1dbc2db36a',
      });
      videoAd.onLoad(() => {
        console.log('激励视频 广告加载成功');
        Taro.hideLoading();
      });
      videoAd.onError((err) => {
        console.error('激励视频光告加载失败', err);
        Taro.hideLoading();
        Taro.showToast({
          title: '加载错误,请重新进入小程序',
          icon: 'none',
          duration: 2000,
        });
      });
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          Taro.hideLoading();
          // 重置解析次数
          Taro.setStorageSync('analysisCount', 0);

          // 提示
          Taro.showToast({
            title: '您已获得解析次数',
            icon: 'success',
            duration: 2000,
          });
        } else {
          // 播放中途退出，不下发游戏奖励
          Taro.showToast({
            title: '观看完整广告才能获得奖励',
            icon: 'none',
            duration: 2000,
          });
        }
      });
    } else {
      Taro.showToast({
        title: '加载错误,请重新进入小程序',
        icon: 'none',
        duration: 2000,
      });
    }

    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd
          .load()
          .then(() => {
            Taro.hideLoading();
            videoAd.show();
          })
          .catch((err) => {
            console.error('激励视频 广告显示失败', err);
            Taro.showToast({
              title: '加载错误,请重新进入小程序',
              icon: 'none',
              duration: 2000,
            });
          });
      });
    } else {
      Taro.showToast({
        title: '加载错误,请重新进入小程序',
        icon: 'none',
        duration: 2000,
      });
    }
  };

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

    // 存储当前解析次数 , 和今天的日期
    const analysisCount = Taro.getStorageSync('analysisCount') || 0;
    const today = new Date().toLocaleDateString();
    // const lastDate = Taro.getStorageSync('lastDate') || today;

    // // 如果不是今天的日期，重置解析次数
    // if (today !== lastDate) {
    //   Taro.setStorageSync('analysisCount', 0);
    //   Taro.setStorageSync('lastDate', today);
    // }

    if (analysisCount >= 5) {
      Taro.showModal({
        title: '提示',
        content: '今日解析次数已用完，观看广告获取更多解析次数',
        confirmText: '观看广告',
        success: function (res) {
          if (res.confirm) {
            handleOpenAd(url);
          }
        },
      });
      return;
    }

    Taro.setStorageSync('analysisCount', analysisCount + 1);
    Taro.setStorageSync('lastDate', today);

    // 解析链接
    handleAnalysisFn(url);
  };

  // 解析链接
  const handleAnalysisFn = async (url) => {
    const res = await analysisURL({
      url,
      platform: 'WeChatApplet',
    });

    const resData = res.data;
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
        <View className="share_text">
          <View>分享给好友,获取更多乐趣~ </View>
        </View>
        <Share className="share_btn" />
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
