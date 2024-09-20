import Taro from '@tarojs/taro';

const BASE_URL = 'https://api.52vmy.cn/api'

const request = (params) => {
  const { url, data, method, headers } = params;

  const header = {
    'content-type': 'application/x-www-form-urlencoded',
    ...headers,
  };

  return new Promise((resolve, reject) => {
    Taro.request({
      url: BASE_URL + url,
      data,
      method,
      header,
      timeout: 50000,
      success: (res) => {
        const { code } = res.data;
        if (code === 200) {
          resolve(res.data.data || res.data.content);
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        Taro.hideLoading();
      },
    });
  });
};

export default request;
