import { useState } from 'react';
import { View, Ad, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { BASE_COLOR } from '@/src/global/global';
import { createActivationCode } from '@/src/http/api.js';
import { AnimatingNumbers } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';
import likeGif from './assets/like.gif';
import HotPosition from '@/src/components/HotPosition';

export default function CreateActivationCode() {
  useShare({
    title: '短视频去水印',
    path: '/pages/RemoveWatermark/index',
  });

  // 当前激活码
  const [activationCode, setActivationCode] = useState([]);

  useDidShow(() => {
    // 初始化激活码6个空字符
    const codeArr = new Array(6).fill('');
    setActivationCode(codeArr);
  });

  // 打开广告
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
        adUnitId: 'adunit-9912fcd3b678e404',
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
          // 正常播放结束，可以下发游戏奖励
          handleCreateActivationCode();
        } else {
          // 播放中途退出，不下发游戏奖励
          Taro.showToast({
            title: '观看完整广告才能生成激活码',
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

  const handleCreateActivationCode = async () => {
    const res = await createActivationCode({
      platform: 'WeChatApplet',
    });

    setActivationCode(res.data.codeArr);

    Taro.showToast({
      title: '激活码生成成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 复制到剪切板
        Taro.setClipboardData({
          data: res.data.codeArr.join(''),
          success: () => {
            Taro.showToast({
              title: '激活码已复制',
              icon: 'success',
              duration: 2000,
            });
          },
        });
      },
    });
  };

  return (
    <View className="create_activation_code">
      <View className="guideAttention">
        <Image
          mode="widthFix"
          src={likeGif}
        />
      </View>

      <View className="code_title">激活码</View>

      <View className="code_content">
        {activationCode.map((item) => {
          return (
            <View className="code_item">
              <AnimatingNumbers.CountUp value={item} />
            </View>
          );
        })}
      </View>

      <View className="code_desc">
        <View>一次激活码的有效期是当天内无限次使用</View>
        <View>点击下方按钮观看广告生成激活码</View>
      </View>

      <View
        style={{
          background: BASE_COLOR,
        }}
        className="code_btn"
        onClick={() => handleOpenAd()}>
        生成激活码
      </View>

      <HotPosition />

      <Ad
        adIntervals={30}
        updatetime={30}
        ad-type="video"
        unit-id="adunit-ce4acb7887d2e668"
      />
    </View>
  );
}
