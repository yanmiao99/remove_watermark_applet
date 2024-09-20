import Taro, { useShareTimeline, useShareAppMessage } from '@tarojs/taro';
import { SHARE_TIMELINE_URL, SHARE_APP_MESSAGE_URL } from '@/src/global/global';

const useShare = (props) => {

  const {title, path, imageUrl} = props;

  // 分享朋友圈
  useShareTimeline(() => {
    return {
      title,
      path,
      imageUrl
    };
  });

  // 转发
  useShareAppMessage(() => {
    return {
      title,
      path,
      imageUrl
    };
  });

  return {
    useShareTimeline,
    useShareAppMessage
  };
}

export default useShare;

