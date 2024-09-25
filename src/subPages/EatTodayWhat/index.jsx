import { useEffect, useState, useRef } from 'react';
import { View, Image, Ad, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import { Button } from '@nutui/nutui-react-taro';
import useShare from '@/src/hooks/useShare';

export default function EatTodayWhat() {
  useShare({
    title: '今天吃什么',
    path: '/subPages/EatTodayWhat/index',
    timelineUrl: 'https://qny.weizulin.cn/images/202409201355349.png',
    messageUrl: 'https://qny.weizulin.cn/images/202409251307577.png',
  });

  const mealOptions = [
    '宫保鸡丁',
    '鱼香肉丝',
    '红烧肉',
    '清蒸鱼',
    '番茄炒蛋',
    '扬州炒饭',
    '牛肉面',
    '素炒面',
    '鸡肉沙拉',
    '三明治',
    '麻婆豆腐',
    '土豆烧牛肉',
    '青椒肉丝',
    '炒年糕',
    '炒河粉',
    '凉拌黄瓜',
    '凉拌木耳',
    '凉拌海带丝',
    '凉拌豆腐皮',
    '凉拌西红柿',
    '烤鸡翅',
    '烤鱼',
    '炒蟹',
    '炒虾',
    '炒鱿鱼',
    '寿司卷',
    '意大利面',
    '披萨',
    '汉堡',
    '炒青菜',
    '牛肉火锅',
    '羊肉串',
    '烤羊排',
    '红烧肉',
    '糖醋排骨',
    '蒸蛋',
    '蛋花汤',
    '番茄蛋汤',
    '紫菜蛋花汤',
    '鸡蛋羹',
    '炒土豆丝',
    '炒茄子',
    '炒豆角',
    '炒豆芽',
    '炒蘑菇',
    '凉拌苦瓜',
    '凉拌莴苣',
    '凉拌菠菜',
    '凉拌粉丝',
    '凉拌藕片',
    '炒豆腐',
    '炒鸡蛋',
    '炒肉片',
    '炒鸡丁',
    '炒牛肉',
  ];

  useDidShow(() => {});

  const [textContent, setTextContent] = useState('');

  const [btnText, setBtnText] = useState('开始');

  const timerRef = useRef(null);

  const count = useRef(0);

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
        handleBtnClick();
      });
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error('插屏广告显示失败', err);
      });
    }
  };

  // 开始 / 结束
  const handleBtnClick = () => {
    console.log('count=======>', count);
    if (count.current > 5) {
      count.current = 0;
      insertAd();
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setBtnText('再来一次');
      count.current += 1;
    } else {
      timerRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * mealOptions.length);
        setTextContent(mealOptions[randomIndex]);
      }, 100);
      setBtnText('停止');
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <View className="eat_bg">
        <View className="eat_bg_text">
          {mealOptions.map((item, index) => (
            <Text
              key={index}
              className="eat_bg_text_item"
              style={{
                top: `${Math.floor(Math.random() * 100)}vh`,
                left: `${Math.floor(Math.random() * 100)}vw`,
                transform: `scale(${Math.random() * 0.5 + 1})`,
                opacity: Math.random(),
                animationDelay: `${Math.random() * index * 20}s`,
                animation: `zoom ${Math.random() * 4 + 1}s linear infinite`,
              }}>
              {item}
            </Text>
          ))}
        </View>

        <View className="eat_wrapper">
          <View className="eat_title">今天吃什么</View>

          <View
            className="eat_content"
            style={{
              height: textContent ? '50px' : '1px',
            }}>
            {textContent}
          </View>

          <Button
            className="eat_btn"
            onClick={() => handleBtnClick()}
            type="primary">
            {btnText}
          </Button>
        </View>
      </View>
    </>
  );
}
