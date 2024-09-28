import { useEffect, useState, useRef } from 'react';
import { View, Image, Ad, Canvas } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { TextArea, Button, Space, Empty } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';
import { BASE_COLOR } from '@/src/global/global';
import CodeCreator from 'taro-code-creator';
import { Copy, Star, Close } from '@nutui/icons-react-taro';

export default function Template() {
  useShare({
    title: '你的专属二维码生成工具',
    path: '/subPages/QRCodeGenerate/index',
    imageUrl: 'https://qny.weizulin.cn/images/202409281724163.jpg',
  });

  // 二维码内容
  const [qrCodeContent, setQrCodeContent] = useState('');

  // 二维码logo
  const [qrCodeLogo, setQrCodeLogo] = useState('');

  // 生成二维码的key
  const [qrCodeKey, setQrCodeKey] = useState(0);

  // 生成二维码的图片
  const [qrCodeImg, setQrCodeImg] = useState('');

  const [canvasStyle, setCanvasStyle] = useState({
    width: '500px',
    height: '500px',
  });

  useDidShow(() => {});

  // 生成二维码
  const handleGenerateQRCode = () => {
    if (!qrCodeContent) {
      Taro.showToast({
        title: '请输入二维码内容',
        icon: 'none',
      });
      return;
    }

    setQrCodeKey(qrCodeKey + 1);
    Taro.showToast({
      title: '生成成功',
      icon: 'success',
    });
  };

  // 上传logo
  const handleLogoUpload = async (e) => {
    if (!qrCodeContent) {
      Taro.showToast({
        title: '请输入二维码内容',
        icon: 'none',
      });
      return;
    }

    Taro.showLoading({
      title: '上传中',
    });

    const { avatarUrl } = e.detail;

    await setQrCodeLogo(avatarUrl);

    await handleGenerateQRCode();

    Taro.hideLoading();
  };

  // 保存图片
  const handleSava = async () => {
    if (!qrCodeContent || !qrCodeImg) {
      Taro.showToast({
        title: '请先生成二维码',
        icon: 'none',
      });
      return;
    }

    Taro.showLoading({
      title: '保存中',
    });

    const ctx = wx.createCanvasContext('qrCodeCanvas');
    const { path } = await Taro.getImageInfo({
      src: qrCodeImg,
    });

    // setCanvasStyle({
    //   width: `${width}px`,
    //   height: `${height}px`,
    // });

    const width = 500;
    const height = 500;

    const padding = 20;
    const newWidth = width - 2 * padding;
    const newHeight = height - 2 * padding;

    ctx.drawImage(path, padding, padding, newWidth, newHeight);

    if (qrCodeLogo) {
      // 绘制 logo 在二维码中间 , logo 的大小为二维码的 1/5
      const logoSize = width / 5;
      ctx.drawImage(
        qrCodeLogo,
        width / 2 - logoSize / 2,
        height / 2 - logoSize / 2,
        logoSize,
        logoSize
      );
    }

    ctx.draw(true, async () => {
      const { tempFilePath } = await Taro.canvasToTempFilePath({
        width,
        height,
        canvasId: 'qrCodeCanvas',
        x: 0,
        y: 0,
      });

      saveImageToPhotosAlbum(tempFilePath);
    });
  };

  // 保存到相册
  const saveImageToPhotosAlbum = async (tempFilePath) => {
    Taro.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        Taro.showToast({
          title: '保存成功',
          success: () => {
            Taro.hideLoading();
          },
        });
      },
      fail: (error) => {
        Taro.showToast({
          title: '保存失败',
          icon: 'none',
        });
      },
      complete: () => {
        Taro.hideLoading();
      },
    });
  };

  return (
    <View className="qrCode_wrapper">
      <View className="qrCode_input">
        <TextArea
          showCount
          placeholder="请输入需要生成的二维码内容"
          value={qrCodeContent}
          onChange={(e) => {
            setQrCodeContent(e);
          }}
        />

        <Space
          style={{ width: '100%' }}
          justify="end">
          <Button
            icon={<Copy size="14" />}
            onClick={() => {
              Taro.getClipboardData({
                success: function (res) {
                  setQrCodeContent(res.data);
                },
              });
            }}
            type="primary">
            粘贴文本
          </Button>

          <Button
            icon={<Star size="14" />}
            open-type="chooseAvatar"
            onChooseAvatar={handleLogoUpload}
            type="primary">
            上传logo
          </Button>

          {qrCodeLogo && (
            <Button
              icon={<Close size="14" />}
              onClick={() => {
                setQrCodeLogo('');
                handleGenerateQRCode();
              }}
              type="primary">
              清除logo
            </Button>
          )}
        </Space>
      </View>

      <View className="qrCode_box">
        {qrCodeKey !== 0 ? (
          <CodeCreator
            key={qrCodeKey} // 强制重新渲染
            backgroundColor="#fff"
            codeText={qrCodeContent}
            size={200}
            logo={qrCodeLogo}
            logoSize={40}
            callback={(res) => {
              setQrCodeImg(res);
            }}
          />
        ) : (
          <Empty
            title="请先生成二维码"
            description="无数据"
          />
        )}
      </View>

      <View className="qrCode_btn_group">
        <View
          style={{
            background: BASE_COLOR,
          }}
          className="qrCode_btn"
          onClick={() => handleSava()}>
          保存图片
        </View>

        <View
          style={{
            background: BASE_COLOR,
          }}
          className="qrCode_btn"
          onClick={() => handleGenerateQRCode()}>
          生成二维码
        </View>
      </View>

      <Canvas
        canvasId="qrCodeCanvas"
        id="qrCodeCanvas"
        className="qrCode_canvas"
        style={canvasStyle}
      />
    </View>
  );
}
