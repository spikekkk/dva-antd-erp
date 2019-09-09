/* eslint-disable no-undef */

//获取待审核商品列表
export async function queryPlatToAuditGoods(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/queryPlatToAuditGoods`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//审批商品
export async function auditPlatGoods(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/auditPlatGoods`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}
