/* eslint-disable no-undef */
/*查询订单列表*/
export async function queryPlatCustomerCard(params) {
  return requestData(`${BASE_URL}/manage/plat/queryPlatCustomerCard`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
