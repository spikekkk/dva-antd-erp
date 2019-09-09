/* eslint-disable no-undef */
/*查询订单列表*/
export async function queryPlatOrderList(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/vipPlan`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
