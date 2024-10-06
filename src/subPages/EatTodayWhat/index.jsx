import { useEffect, useState, useRef, useMemo } from 'react';
import { View, Image, Ad, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import useShare from '@/src/hooks/useShare';
import { Dialog, TextArea, Button } from '@nutui/nutui-react-taro';
import HotPosition from '@/src/components/HotPosition';
import TextAnimation from './TextAnimation';
import { BASE_COLOR } from '@/src/global/global';

const BaseMealOptions = [
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

export default function EatTodayWhat() {
  useShare({
    title: '来看看今天吃什么 ~',
    path: '/subPages/EatTodayWhat/index',
    timelineUrl: 'https://qny.weizulin.cn/images/202409201355349.png',
    messageUrl: 'https://qny.weizulin.cn/images/202409251307577.png',
  });

  useDidShow(() => {
    // 判断是否有自定义菜单
    Taro.getStorage({
      key: 'mealOptions',
      success: (res) => {
        setMealOptions(res.data);
      },
      fail: () => {
        setMealOptions(BaseMealOptions);
      },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        setMealOptions(BaseMealOptions);
      });
  });

  // 文字内容
  const [textContent, setTextContent] = useState('');

  // 按钮文字
  const [btnText, setBtnText] = useState('开始');

  // 文字切换定时器
  const timerRef = useRef(null);

  // 广告计数
  const count = useRef(0);

  // 菜单
  const [mealOptions, setMealOptions] = useState([]);

  // 菜单是否显示
  const [menuVisible, setMenuVisible] = useState(false);

  // 临时菜单
  const [tempMenu, setTempMenu] = useState([]);

  // 优化
  const mealOptionsMemo = useMemo(() => {
    return mealOptions;
  }, [mealOptions]);

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

  // 开始 / 结束
  const handleBtnClick = () => {
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
        // 删除空字符串
        let templateList = mealOptions.filter((item) => item !== '');
        const randomIndex = Math.floor(Math.random() * templateList.length);
        setTextContent(templateList[randomIndex]);
      }, 100);
      setBtnText('停止');
    }
  };

  // 保存自定义菜单
  const handleMenuSave = () => {
    if (tempMenu.length === 0 || tempMenu[0] === '') {
      // 询问是否使用默认菜单
      Taro.showModal({
        title: '提示',
        content: '自定义菜单为空, 是否使用默认菜单?',
        success: (res) => {
          if (res.confirm) {
            setMealOptions(BaseMealOptions);
            setMenuVisible(false);
            Taro.setStorage({
              key: 'mealOptions',
              data: [],
            });
            Taro.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000,
            });
          }
        },
      });
      return;
    }

    // 最少5个
    if (tempMenu.length < 5) {
      Taro.showToast({
        title: '最少5个菜单',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    setMealOptions(tempMenu);
    setMenuVisible(false);
    Taro.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 保存到本地
        Taro.setStorage({
          key: 'mealOptions',
          data: tempMenu,
        });
        setTempMenu([]);
      },
    });
  };

  // 打开自定义菜单
  const handleOpenMenu = () => {
    // 读取本地存储
    Taro.getStorage({
      key: 'mealOptions',
      success: (res) => {
        setTempMenu(res.data);
        setMealOptions(res.data);
      },
      fail: () => {
        setMealOptions([]);
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setMenuVisible(true);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <View className="eat_bg">
      <TextAnimation mealOptions={mealOptionsMemo} />

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
          style={{ background: BASE_COLOR }}
          className="eat_btn"
          onClick={() => handleBtnClick()}
          type="primary">
          {btnText}
        </Button>

        <Text
          className="eat_custom_menu"
          onClick={handleOpenMenu}>
          自定义菜单
        </Text>
      </View>

      <Dialog
        title="自定义菜单"
        visible={menuVisible}
        hideCancelButton
        onConfirm={handleMenuSave}>
        <>
          <View className="menu_dialog_tips">自定义菜单列表, 请用逗号分隔</View>
          <TextArea
            defaultValue={tempMenu.join(',')}
            className="menu_dialog_textarea"
            placeholder="例如 : 梅菜扣肉饭,口水鸡,麻辣烫"
            onChange={(value) => {
              setTempMenu(
                Array.from(new Set(value.split(/,|，/).filter((item) => item)))
              );
            }}
          />
        </>
      </Dialog>

      <View className="eat_recommend_bit">
        <HotPosition exclude={'EatTodayWhat'} />
      </View>
    </View>
  );
}
