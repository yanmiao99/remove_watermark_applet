import request from '../service/toolsRequest';

// 文档
// https://api.52vmy.cn/

// 全国快递查询
// https://api.52vmy.cn/api/query/kuaidi?id=JD0092947910127
export const queryExpress = (data) => {
  return request({
    url: '/query/kuaidi',
    data,
    method: 'GET',
  });
};

// 热搜榜
// https://api.52vmy.cn/api/wl/hot?type=baidu/weibo/zhihu
export const queryHotSearch = (data) => {
  return request({
    url: '/wl/hot',
    data,
    method: 'GET',
  });
};

// 电视剧实时票房
// https://api.52vmy.cn/api/wl/top/tv?type=json
export const queryTvBoxOffice = (data) => {
  return request({
    url: '/wl/top/tv',
    data,
    method: 'GET',
  });
};