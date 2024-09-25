import Taro, { useShareTimeline, useShareAppMessage } from '@tarojs/taro';
import { SHARE_TIMELINE_URL,SHARE_APP_MESSAGE_URL } from '@/src/global/global';
import { isEmptyObject } from '@/src/utils/index';

const useShare = (props) => {
  const { title, path, timelineUrl,messageUrl } = props;

  // 分享朋友圈
  useShareTimeline(() => {
    return {
      title,
      path,
      imageUrl:timelineUrl ? timelineUrl : SHARE_TIMELINE_URL,
    };
  });

  // 转发
  useShareAppMessage(() => {
    return {
      title,
      path,
      imageUrl:messageUrl ? messageUrl : SHARE_APP_MESSAGE_URL
    };
  });

  return {
    useShareTimeline,
    useShareAppMessage,
  };
};

export default useShare;
