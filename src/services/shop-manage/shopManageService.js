import qs from 'qs';
//查询店铺列表
export async function httpQueryShoplist(params) {
  return requestData(`${BASE_URL}/manage/shop/shopQueryList`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(params),
  });
}
//查询店铺详情
export async function httpQueryShopItem(params) {
  return requestData(`${BASE_URL}/manage/shop/shopQueryInfo`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(params),
  });
}
//编辑店铺详情
export async function httpUpdateShopItem(params) {
  return requestData(`${BASE_URL}/manage/shop/updateShop`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(params),
  });
}
//新增店铺详情
export async function httpAddShopItem(params) {
  return requestData(`${BASE_URL}/manage/shop/insertShop`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(params),
  });
}
