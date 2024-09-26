import { useEffect, useState } from 'react';
import { View, Image, Ad, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';
import useShare from '@/src/hooks/useShare';
import {
  AnimatingNumbers,
  Checkbox,
  Form,
  Range,
  Button,
  Space,
} from '@nutui/nutui-react-taro';
import { Reload, Copy } from '@nutui/icons-react-taro';
import HotPosition from '@/src/components/HotPosition';

const optionsMap = {
  number: {
    label: '数字',
    value: '1234567890',
  },
  lowercase: {
    label: '小写字母',
    value: 'abcdefghijklmnopqrstuvwxyz',
  },
  uppercase: {
    label: '大写字母',
    value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  character: {
    label: '特殊字符',
    value: '~!@#$%^&*()',
  },
};

export default function RandomPassword() {
  useShare({
    title: '随机密码生成',
    path: '/subPages/RandomPassword/index',
    timelineUrl: 'https://qny.weizulin.cn/images/202409232141215.png',
    messageUrl: 'https://qny.weizulin.cn/images/202409251310332.png',
  });

  useDidShow(() => {});

  // 密码
  const [password, setPassword] = useState('');

  const handleGeneratePassword = (value) => {
    setPassword('');

    const { options, passwordLen } = value;

    let password = '';

    const optionsStr = options
      .map((option) => optionsMap[option].value)
      .join('');

    for (let i = 0; i < passwordLen; i++) {
      const randomIndex = Math.floor(Math.random() * optionsStr.length);
      password += optionsStr[randomIndex];
    }

    setPassword(password);
  };

  const handleCopy = () => {
    if (!password) {
      Taro.showToast({
        title: '请先生成密码',
        icon: 'none',
      });
      return;
    }

    Taro.setClipboardData({
      data: password,
      success: () => {
        Taro.showToast({
          title: '密码已复制',
          icon: 'none',
        });
      },
    });
  };

  return (
    <View className="random_password_wrapper">
      <View className="password_content">
        <View className="password_title">随机密码生成器</View>
        <View className="password_desc">
          生成一个随机的密码，可以设置密码长度和是否包含数字、小写字母、大写字母、特殊字符等选项。
        </View>

        <View className="password_result">
          {password && password.length > 0 ? (
            <AnimatingNumbers.CountUp value={password} />
          ) : (
            <View>等待生成密码~ </View>
          )}
        </View>

        <View className="password_option">
          <Form
            initialValues={{
              options: ['number', 'lowercase', 'uppercase', 'character'],
              passwordLen: '8',
            }}
            onFinish={(value) => handleGeneratePassword(value)}
            footer={
              <Space
                direction="vertical"
                style={{ marginTop: '20px ' }}>
                <View className="password_btn_group">
                  <Button
                    block
                    className="password_btn"
                    type="primary"
                    onClick={handleCopy}>
                    <Copy />
                    <Text>复制密码</Text>
                  </Button>
                  <Button
                    nativeType="submit"
                    block
                    className="password_btn"
                    type="primary">
                    <Reload />
                    <Text>生成密码</Text>
                  </Button>
                </View>
                <View className="password_notice">
                  注意 : 选项只会保证可选,不保证一定会包含
                </View>
              </Space>
            }>
            <Form.Item
              label="密码选项"
              rules={[
                { required: true, message: '请选择密码选项' },
                {
                  validator: (rule, value) => {
                    if (value.length < 1) {
                      return Promise.reject('至少选择一个选项');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              name="options">
              <Checkbox.Group direction={'vertical'}>
                {Object.keys(optionsMap).map((key) => (
                  <Checkbox
                    key={key.label}
                    value={key}>
                    {optionsMap[key].label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label="密码长度"
              rules={[{ required: true, message: '请输入密码长度' }]}
              name="passwordLen">
              <Range
                min={4}
                max={26}
                step={1}
                showValue
              />
            </Form.Item>
          </Form>
        </View>
      </View>

      <HotPosition exclude={'RandomPassword'} />

      <Ad
        adIntervals={30}
        updatetime={30}
        unit-id="adunit-fc0b31a19db60c2b"
      />
    </View>
  );
}
