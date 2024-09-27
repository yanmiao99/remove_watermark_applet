import { memo, useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import './index.less';

const TextAnimation = memo(({ mealOptions }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (mealOptions.length === 0) return;
    setList(mealOptions);
  }, [mealOptions]);

  return (
    <View className="eat_bg_text">
      {list.map((item, index) => (
        <Text
          key={item}
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
  );
});

export default TextAnimation;
