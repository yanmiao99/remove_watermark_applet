import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Cell, Space } from '@nutui/nutui-react-taro';
import './index.less';
import { BASE_COLOR } from '@/src/global/global';

export default function CardBox({ title, text, img }) {
  return (
    <Cell.Group>
      {title ? (
        <Cell
          title={
            <View className="card_box_header">
              <Text
                style={{
                  borderColor: BASE_COLOR,
                }}
                className="card_box_vertical_line"></Text>
              {title}
            </View>
          }></Cell>
      ) : null}
      <Cell align="center">
        <Space
          wrap
          direction="vertical">
          <Text className="card_box_text">{text}</Text>
          <>
            {img ? (
              <Image
                style={{
                  display: 'block',
                  margin: '0 auto',
                }}
                mode="widthFix"
                src={img}
              />
            ) : null}
          </>
        </Space>
      </Cell>
    </Cell.Group>
  );
}
