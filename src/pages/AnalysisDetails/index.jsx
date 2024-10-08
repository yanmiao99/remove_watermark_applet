import { useState, useRef } from 'react';
import { View, Text, Ad, Video } from '@tarojs/components';
import {
  Image,
  Button,
  Space,
  Tabs,
  Cell,
  ConfigProvider,
  NoticeBar,
} from '@nutui/nutui-react-taro';
import {
  Copy,
  Download,
  ImageError,
  ArrowRight,
} from '@nutui/icons-react-taro';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { BASE_COLOR, SUB_COLOR } from '@/src/global/global';
import HotPosition from '@/src/components/HotPosition';
const BASE_URL = process.env.TARO_APP_BASE_URL;

export default function AnalysisDetails() {
  const [dataDetails, setDataDetails] = useState({}); // 数据详情

  const [tabValue, setTabValue] = useState('0'); // tab切换

  const videoRef = useRef(null);

  useDidShow(() => {
    const params = Taro.getCurrentInstance().router.params;
    const data = decodeURIComponent(params.data);
    const dataParse = JSON.parse(data);
    setDataDetails(dataParse);
  });

  // 预览图片
  const handlePreview = (item, type = 'image', poster) => {
    if (type === 'image') {
      Taro.previewImage({
        urls: [item],
        current: item,
      });
    } else {
      Taro.previewMedia({
        sources: [
          {
            type: 'video',
            url: item,
            poster,
          },
        ],
      });
    }
  };

  // 复制文本
  const handleCopyText = (text) => {
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000,
        });
      },
    });
  };

  // 下载
  const handleDownload = (content, type) => {
    if (!content || content === '' || content.length === 0) {
      Taro.showToast({
        title: '暂无下载内容',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    if (type === 'video') {
      // 弹窗提示视频有点大,请耐心等待
      wx.showModal({
        title: '提示',
        content: '视频有点大,请耐心等待',
        success: function (res) {
          if (res.confirm) {
            Taro.showLoading({
              title: '下载中...',
              mask: true,
            });

            let fileName = 'video_123';
            let filePath = BASE_URL + '/' + fileName + '.mp4';

            wx.downloadFile({
              url: `${BASE_URL}/parseUrl/downLoadVideo?url=${encodeURIComponent(
                content
              )}`,
              success(res) {
                Taro.hideLoading();
                wx.hideLoading();
                //保存到本地
                const savedFilePath = res.tempFilePath;
                //保存文件
                wx.saveVideoToPhotosAlbum({
                  filePath: savedFilePath,
                  success: function (data) {
                    wx.showModal({
                      title: '提示',
                      content: '下载成功，视频已保存至您的相册',
                    });
                  },
                  fail: function (err) {
                    Taro.hideLoading();
                    console.log(err);
                    wx.showModal({
                      title: '提示',
                      content:
                        '保存失败,需要您授权保存相册,请手动通过小程序的设置功能授权使用相册,再进行下载',
                    });
                  },
                  complete: function () {
                    Taro.hideLoading();
                    /* 删除文件缓存，否则类积超过10M保存失败 */
                    let fileMgr = wx.getFileSystemManager();
                    fileMgr.unlink({
                      filePath: filePath,
                      success: function (r) {
                        console.log('删除成功');
                      },
                    });
                  },
                });
              },
              fail: function (err) {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '下载失败,可能文件太大，请复制链接到浏览器中下载',
                });
              },
            }).onProgressUpdate((res) => {
              // 字节转mb
              const totalBytesWritten = res.totalBytesWritten / 1024 / 1024;
              Taro.showLoading({
                title: `${totalBytesWritten.toFixed(2)}MB`,
                mask: true,
              });
            });
          }
        },
      });
    }

    if (type === 'img') {
      Taro.showLoading({
        title: '下载中...',
        mask: true,
      });

      // 图片转换为数组
      let images = [];
      if (Array.isArray(content)) {
        images = content;
      } else {
        images = [content];
      }

      let fileName = 'image_123';
      let filePath = BASE_URL + '/' + fileName + '.jpeg';

      // 需要是用 forEach 循环请求 downLoadPics 接口, 并且传入 url  参数, 最后用 Promise.all() 来处理所有的请求 , 然后保存到本地
      let promiseArr = [];
      images.forEach((item) => {
        promiseArr.push(
          new Promise((resolve, reject) => {
            wx.downloadFile({
              url: `${BASE_URL}/parseUrl/downLoadPics?url=${encodeURIComponent(
                item
              )}`,
              success(res) {
                //保存到本地
                let savedFilePath = res.tempFilePath;
                //保存文件
                wx.saveImageToPhotosAlbum({
                  filePath: savedFilePath,
                  success: function (data) {
                    resolve('success');
                  },
                  fail: function (err) {
                    reject('fail');
                  },
                  complete: function () {
                    /* 删除文件缓存，否则类积超过10M保存失败 */
                    let fileMgr = wx.getFileSystemManager();
                    fileMgr.unlink({
                      filePath: filePath,
                      success: function (r) {
                        console.log('删除成功');
                      },
                    });
                  },
                });
              },
              fail: function (err) {
                reject('fail');
              },
            });
          })
        );
      });

      Promise.all(promiseArr)
        .then((res) => {
          wx.showModal({
            title: '提示',
            content: '下载成功，文件已保存至您的相册',
          });
          Taro.hideLoading();
        })
        .catch((err) => {
          wx.showModal({
            title: '提示',
            content: '下载失败,可能文件太大，请复制链接到浏览器中下载',
          });
          Taro.hideLoading();
        });
    }
  };

  // 跳转页面
  const handleOperation = (type) => {
    Taro.navigateTo({
      url: `/pages/${type}/index`,
    });
  };

  return (
    <View className="analysis_details_wrapper">
      {dataDetails && JSON.stringify(dataDetails) !== '{}' && (
        <ConfigProvider
          theme={{
            nutuiSpaceGap: '20px',
            nutuiNoticebarBackground: SUB_COLOR,
            nutuiNoticebarColor: BASE_COLOR,
          }}>
          <Tabs
            autoHeight
            value={tabValue}
            onChange={(value) => {
              setTabValue(value);
            }}
            activeType="card">
            <Tabs.TabPane title="封面">
              <Ad
                adIntervals={30}
                updatetime={30}
                unit-id="adunit-fc0b31a19db60c2b"
                style={{ marginBottom: '20px' }}
              />
              <Space
                wrap
                justify="between"
                direction="vertical">
                <Image
                  onClick={() => handlePreview(dataDetails.photo)}
                  mode={'aspectFit'}
                  height={200}
                  src={dataDetails.photo}
                  error={
                    <Space wrap>
                      <ImageError />
                      <Text>图片加载失败</Text>
                    </Space>
                  }
                />
                <Space
                  wrap
                  direction="vertical">
                  <NoticeBar
                    scrollable={false}
                    wrap
                    leftIcon={false}
                    content={
                      '点击[保存封面]或者[预览图片]后长按保存到本地,或者复制无水印链接到浏览器中下载'
                    }
                  />
                  <Space justify="center">
                    <Button
                      type="primary"
                      fill="outline"
                      className="card_btn"
                      icon={<Copy size="14" />}
                      onClick={() => handleCopyText(dataDetails.photo)}>
                      复制无水印链接
                    </Button>
                    <Button
                      type="primary"
                      className="card_btn"
                      style={{ background: BASE_COLOR }}
                      icon={<Download size="14" />}
                      onClick={() => handleDownload(dataDetails.photo, 'img')}>
                      保存封面
                    </Button>
                  </Space>
                </Space>
              </Space>
            </Tabs.TabPane>

            {dataDetails.type === 1 && (
              <Tabs.TabPane title="视频">
                <Ad
                  adIntervals={30}
                  updatetime={30}
                  unit-id="adunit-fc0b31a19db60c2b"
                  style={{ marginBottom: '20px' }}
                />
                <Space
                  wrap
                  justify="between"
                  direction="vertical">
                  <Video
                    ref={videoRef}
                    autoPlay={true}
                    muted={true}
                    onClick={() =>
                      handlePreview(
                        dataDetails.downurl,
                        'video',
                        dataDetails.photo
                      )
                    }
                    src={dataDetails.downurl}
                    controls
                    className="card_video"
                  />

                  <Space
                    wrap
                    direction="vertical">
                    <NoticeBar
                      scrollable={false}
                      wrap
                      leftIcon={false}
                      content={
                        <Space
                          wrap
                          direction="vertical">
                          <View>
                            当视频无法保存时可以复制无水印链接到浏览器中下载,苹果手机需要下载
                            documents 才能在浏览器中下载视频
                          </View>
                          <View>
                            或者点击视频播放,然后打开视频窗口[预览视频]后长按保存到本地
                          </View>
                        </Space>
                      }
                    />
                    <Space justify="center">
                      <Button
                        type="primary"
                        fill="outline"
                        className="card_btn"
                        icon={<Copy size="14" />}
                        onClick={() => handleCopyText(dataDetails.downurl)}>
                        复制无水印链接
                      </Button>
                      <Button
                        type="primary"
                        style={{ background: BASE_COLOR }}
                        className="card_btn"
                        icon={<Download size="14" />}
                        onClick={() =>
                          handleDownload(dataDetails.downurl, 'video')
                        }>
                        保存视频
                      </Button>
                    </Space>
                  </Space>
                </Space>
              </Tabs.TabPane>
            )}
            {dataDetails.type === 2 && (
              <Tabs.TabPane title="图片">
                <Ad
                  adIntervals={30}
                  updatetime={30}
                  unit-id="adunit-fc0b31a19db60c2b"
                  style={{ marginBottom: '20px' }}
                />
                <Space
                  wrap
                  justify="between"
                  direction="vertical">
                  <Space
                    wrap
                    align="start">
                    {dataDetails.pics.map((item, index) => {
                      return (
                        <Image
                          onClick={() => handlePreview(item)}
                          mode={'aspectFit'}
                          width={90}
                          height={90}
                          style={{
                            borderRadius: '4px',
                            border: '1px solid #f0f0f0',
                          }}
                          src={item}
                        />
                      );
                    })}
                  </Space>

                  <Space
                    wrap
                    direction="vertical">
                    <NoticeBar
                      scrollable={false}
                      wrap
                      leftIcon={false}
                      content={'点击[下载全部]或者[预览图片]后长按保存到本地'}
                    />

                    <Button
                      type="primary"
                      icon={<Download size="14" />}
                      block
                      style={{ background: BASE_COLOR }}
                      className="card_btn"
                      onClick={() => handleDownload(dataDetails.pics, 'img')}>
                      下载全部
                    </Button>
                  </Space>
                </Space>
              </Tabs.TabPane>
            )}

            <Tabs.TabPane title="文案">
              <Ad
                adIntervals={30}
                updatetime={30}
                unit-id="adunit-fc0b31a19db60c2b"
                style={{ marginBottom: '20px' }}
              />
              <Space
                wrap
                justify="between"
                direction="vertical">
                <Text>
                  {dataDetails.title ? dataDetails.title : '暂无文案'}
                </Text>

                <Button
                  type="primary"
                  block
                  style={{ background: BASE_COLOR }}
                  className="card_btn"
                  icon={<Copy size="14" />}
                  onClick={() => handleCopyText(dataDetails.title)}>
                  复制文案
                </Button>
              </Space>
            </Tabs.TabPane>
          </Tabs>
        </ConfigProvider>
      )}

      <HotPosition />

      <Cell
        onClick={() => handleOperation('FAQ')}
        title="常见问题"
        extra={<ArrowRight size="14" />}
      />
    </View>
  );
}
