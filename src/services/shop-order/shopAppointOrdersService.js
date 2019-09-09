/* eslint-disable no-undef */
/*查询订单列表*/
export async function queryShopAppointOrder(params) {
  return requestData(`${BASE_URL}/manage/shop/queryShopAppointOrder`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
