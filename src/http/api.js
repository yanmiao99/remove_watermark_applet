import request from '../service/request';

// 解析 url
export const analysisURL = (data) => {
  return request({
    url: '/parseUrl/query',
    data,
    method: 'GET',
  });
};

// 获取全局配置数据
export const getGlobalConfig = () => {
  return request({
    url: '/setting/list',
    method: 'GET',
  });
};

// 获取激活码
export const createActivationCode = () => {
  return request({
    url: '/parseUrl/createActivationCode',
    method: 'POST',
  });
};
