import request from '../service/goldRequest';

// 黄金价格
export const queryGoldPrice = (data) => {
  return request({
    url: '/huangj/api.php',
    data,
    method: 'GET',
  });
};
