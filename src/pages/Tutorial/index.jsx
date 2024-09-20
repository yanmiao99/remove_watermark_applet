import React from 'react';
import { View, Ad } from '@tarojs/components';
import CardBox from '@/src/components/CardBox';

function Tutorial() {
  const list = [
    {
      title: '第一步',
      text: '在APP中打开想要下载的视频或图片，点击「分享按钮」',
      img: 'https://qny.weizulin.cn/images/202405301516105.png',
    },
    {
      title: '第二步',
      text: '在弹出的分享菜单中点击「复制链接」',
      img: 'https://qny.weizulin.cn/images/202405301517376.png',
    },
    {
      title: '第三步',
      text: '打开小程序，点击「粘贴链接」将复制的内容填充进去',
      img: 'https://qny.weizulin.cn/images/202405301518015.png',
    },
    {
      title: '第四步',
      text: '解析成功后会跳转到详情页中, 大功告成',
      img: 'https://qny.weizulin.cn/api/2024-05-28/grQshWtRhYsVODULfcqHuZe7QRC8o9WbELDzKpeu.png',
    },
    {
      title: '第五步',
      text: '正常情况下需要点击「下载」保存到本地,这个时候会提示申请权限,请「允许」',
      img: 'https://qny.weizulin.cn/images/202405301518331.png',
    },
    {
      title: '如果出现无法保存或者保存失败的情况有以下两种解决办法',
      text: '1. 复制在线链接去浏览器黏贴, 然后保存到本地',
      img: 'https://qny.weizulin.cn/api/2024-05-28/XRXHdbgd7jEOTQHm17m1DrhIezqJRKjRBGEAjnO6.png',
    },
    {
      title: '',
      text: '2. 点击视频或者图片进入预览区,然后「长按出现保存」即可',
      img: 'https://qny.weizulin.cn/images/202405291357552.jpeg',
    },
  ];

  return (
    <View>
      <Ad
        unit-id="adunit-fc0b31a19db60c2b"
        style={{ margin: '20px 0' }}
      />
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

export default Tutorial;
