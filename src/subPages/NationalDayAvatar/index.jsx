import { View, Image, ScrollView, Canvas, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Button } from '@nutui/nutui-react-taro';
import avatarTemplate from './avatar.json';
import './index.less';
import useShare from '@/src/hooks/useShare';

export default function NationalDayAvatar() {
  useShare({
    title: '国庆头像生成器',
    path: '/subPages/NationalDayAvatar/index',
    messageUrl: 'https://qny.weizulin.cn/images/202409260118245.jpg',
    timelineUrl: 'https://qny.weizulin.cn/images/202409260118245.jpg',
  });

  const bgImg = require('./assets/bg.png');
  const bgTextImg = require('./assets/bg-text.png');
  const defaultAvatar = require('./assets/default_avatar.png');

  const [uploadAvatar, setUploadAvatar] = useState('');
  const [isDefaultAvatar, setIsDefaultAvatar] = useState(true);
  const [compositeAvatar, setCompositeAvatar] = useState('');
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(-1);
  const [canvasStyle, setCanvasStyle] = useState({
    width: '500px',
    height: '500px',
  });

  // 上传头像
  const handleAvatarUpload = (e) => {
    Taro.showLoading({
      title: '上传中',
    });

    const { avatarUrl } = e.detail;

    if (avatarUrl) {
      setIsDefaultAvatar(false);
      setUploadAvatar(avatarUrl);
      setCompositeAvatar(avatarUrl);
    }

    Taro.hideLoading();

    // Taro.chooseMedia({
    //   count: 1,
    //   mediaType: ['image'],
    //   success: (res) => {
    //     if (res.errMsg === 'chooseMedia:ok') {
    //       const file = res.tempFiles[0];
    //       setIsDefaultAvatar(false);
    //       setUploadAvatar(file.tempFilePath);
    //       setCompositeAvatar(file.tempFilePath);
    //     }
    //   },
    // });
  };

  // 选择头像模板
  const handleAvatarTemplateSelect = (index) => {
    if (index === currentSelectedIndex) return;

    Taro.showLoading({
      title: '生成中...',
      mask: true,
      duration: 1000,
    });

    if (isDefaultAvatar || !uploadAvatar) {
      Taro.showToast({
        title: '请先上传头像图片',
        icon: 'none',
      });
      return;
    }
    setCurrentSelectedIndex(index);

    // 生成一个1-1000的随机数
    const random = Math.floor(Math.random() * 1000);
    if (random % 3 === 0) {
      insertAd();
    }

    // 生成头像
    drawAvatar(avatarTemplate[index]);
  };

  // 插屏广告
  const insertAd = () => {
    let interstitialAd = null;

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-c899d27840b7fcf7',
      });
      interstitialAd.onLoad(() => {
        console.log('插屏广告加载成功');
      });
      interstitialAd.onError((err) => {
        console.error('插屏广告加载失败', err);
      });
      interstitialAd.onClose(() => {
        // 销毁插屏广告实例
        interstitialAd.destroy();
        interstitialAd = null;
      });
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error('插屏广告显示失败', err);
      });
    }
  };

  // 生成头像
  const drawAvatar = async (imgUrl) => {
    try {
      const ctx = wx.createCanvasContext('avatarCanvas');
      const { path, width, height } = await Taro.getImageInfo({ src: imgUrl });
      setCanvasStyle({
        width: `${width}px`,
        height: `${height}px`,
      });

      ctx.drawImage(uploadAvatar, 0, 0, width, height);
      ctx.drawImage(path, 0, 0, width, height);
      ctx.draw(true, async () => {
        const { tempFilePath } = await Taro.canvasToTempFilePath({
          width,
          height,
          canvasId: 'avatarCanvas',
          x: 0,
          y: 0,
        });
        setCompositeAvatar(tempFilePath);
      });
    } catch (error) {
      console.error('生成头像失败', error);
    }
  };

  // 保存头像
  const handleSaveAvatar = async () => {
    // 生成一个1-1000的随机数
    const random = Math.floor(Math.random() * 1000);
    if (random % 5 === 0) {
      insertAd();
    }

    if (!uploadAvatar || isDefaultAvatar) {
      Taro.showToast({ title: '请上传并选择需要生成的头像图片', icon: 'none' });
    } else if (!currentSelectedIndex < 0) {
      Taro.showToast({ title: '请选择一个头像模板', icon: 'none' });
    } else {
      Taro.saveImageToPhotosAlbum({
        filePath: compositeAvatar,
        success: () => {
          Taro.showToast({
            title: '保存成功',
          });
        },
      });
    }
  };

  return (
    <View class="national_day_avatar">
      <Image
        class="national_day_avatar__bg"
        src={bgImg}
      />
      <View className="national_day_avatar__container">
        <Image
          class="national_day_avatar__title"
          src={bgTextImg}
        />

        <View className="national_day_avatar__preview">
          {isDefaultAvatar ? (
            <Text className="national_day_avatar__preview-text">
              点击上传头像
            </Text>
          ) : null}

          <button
            class="national_day_avatar__preview-upload"
            open-type="chooseAvatar"
            onChooseAvatar={handleAvatarUpload}>
            <Image
              class="national_day_avatar__preview-img"
              src={isDefaultAvatar ? defaultAvatar : compositeAvatar}
              mode={'aspectFill'}
            />
          </button>
        </View>

        <ScrollView
          scrollX={true}
          className="national_day_avatar__preview-scroll">
          <View className="national_day_avatar__preview-template">
            {avatarTemplate.map((item, index) => (
              <Image
                key={item}
                className={`national_day_avatar__preview-template-item ${
                  currentSelectedIndex === index && 'is-selected'
                }`}
                src={item}
                onClick={() => handleAvatarTemplateSelect(index)}
              />
            ))}
          </View>
        </ScrollView>

        <Button
          size="xlarge"
          block
          color="#fff"
          onClick={handleSaveAvatar}>
          保存头像
        </Button>

        <Canvas
          canvasId="avatarCanvas"
          id="avatarCanvas"
          className="national_day_avatar__preview-canvas"
          style={canvasStyle}></Canvas>
      </View>
    </View>
  );
}
