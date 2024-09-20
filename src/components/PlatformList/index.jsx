import { useEffect, useState } from 'react';
import { getGlobalConfig } from '@/src/http/api.js';
import { View, Image, Text } from '@tarojs/components';
import {
  Cell,
  Space,
  NoticeBar,
  ConfigProvider,
} from '@nutui/nutui-react-taro';
import './index.less';
import { BASE_COLOR, SUB_COLOR } from '@/src/global/global';

const PlatformList = ({ formRef }) => {
  const [settingData, setSettingData] = useState({});

  useEffect(() => {
    getSetting();
  }, []);

  const getSetting = async () => {
    const res = await getGlobalConfig();
    console.log('res.data========', res.data);
    setSettingData(res.data);
  };

  const handleFillForm = (url) => {
    formRef.setFieldsValue({
      url,
    });
  };

  return (
    <View>
      {JSON.stringify(settingData) === '{}' ? null : (
        <View>
          <ConfigProvider
            theme={{
              nutuiNoticebarBackground: SUB_COLOR,
              nutuiNoticebarColor: BASE_COLOR,
            }}>
            <NoticeBar
              scrollable={false}
              wrap
              leftIcon={false}
              content={settingData.announcement}
            />
          </ConfigProvider>
          <Cell>
            <Space wrap>
              <Text>支持平台列表如下: (点击可进行链接测试)</Text>
              <View className="support_list">
                {settingData.platform.map((item) => {
                  return (
                    <View
                      key={item.name}
                      className="support_item"
                      onClick={() => handleFillForm(item.url)}>
                      <Image
                        src={item.icon}
                        alt={item.name}
                      />
                      <Text>{item.name}</Text>
                    </View>
                  );
                })}
              </View>
            </Space>
          </Cell>
        </View>
      )}
    </View>
  );
};

export default PlatformList;
