import React from 'react';
import { Cell } from '@nutui/nutui-react-taro';
import { View, Ad } from '@tarojs/components';
import './index.less';
import CardBox from '@/src/components/CardBox';
import { BASE_COLOR } from '@/src/global/global';

function FAQ() {
  const list = [
    {
      title: '小程序收费吗?',
      text: '本小程序完全免费，且不作为任何商业用途，仅用于学习交流，不收取任何费用。',
    },
    {
      title: '为什么解析成功后还是有水印？',
      text: '原视频或者原图自带的水印，本小程序将无法去除。',
    },
    {
      title: '为什么下载失败',
      text: '视频可能超过了50MB，目前微信只支持文件大小为50MB以内的视频下载。\n 这种情况可点击【复制无水印链接】按钮，然后到浏览器中下载。\n 安卓手机建议使用QQ浏览器，苹果手机需要下载软件 documents 才能在浏览器中进行下载视频。',
      img: 'https://qny.weizulin.cn/images/202405301512562.png',
    },
    {
      title: '为什么会解析失败？',
      text: '视频已经被删除、私密视频、在审核的视频都会解析失败。',
    },
    {
      title: '安卓手机提示下载成功找不到视频?',
      text: '个别手机保存后相册无法找到视频是因为手机厂商的系统逻辑问题，请到【文件管理】中查找对应文件，具体文件存储路劲请对照保存成功时微信弹出来的提示，如下图',
      img: 'https://qny.weizulin.cn/images/202405301509600.png',
    },
  ];

  return (
    <View className="faq">
      <Ad
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ margin: '20px 0' }}
      />
      <Cell>
        <View
          style={{
            color: BASE_COLOR,
          }}>
          图片或视频版权归平台及作者所有，本小程序仅作为学习，不存储任何图片或视频。
        </View>
      </Cell>
      {list.map((item, index) => (
        <CardBox
          key={index}
          title={item.title}
          text={item.text}
          img={item.img}
        />
      ))}
    </View>
  );
}

export default FAQ;
