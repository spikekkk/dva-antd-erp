/* eslint-disable no-undef */

//获取商品列表
export async function queryAuditGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/queryAuditGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//查询商品详情
export async function getPlatGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/getPlatGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//新建商品
export async function createPlatGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/createPlatGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//编辑商品
export async function updatePlatGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/updatePlatGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//设置商品排序值
export async function setPlatGoodsSortOrder(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/setPlatGoodsSortOrder`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//修改商品上下架
export async function updatePlatGoodsStatus(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/updatePlatGoodsStatus`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//删除商品
export async function deletePlatGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/deletePlatGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//提交审核
export async function submitPlatGoodsAudit(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/submitPlatGoodsAudit`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//商品设置成推荐
export async function setPlatGoodsTag(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/setPlatGoodsTag`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//设置推荐排序值
export async function setPlatTagSortOrder(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/setPlatTagSortOrder`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//查询会员卡下拉框列表
export async function queryPlatVipCardList(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/queryPlatVipCardList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//查询预约中其他信息
export async function queryPlatGoodsAdditionalInfo(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/queryPlatGoodsAdditionalInfo`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}



// 上新/下架 操作
export async function setNewPlatGoods(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/setNewPlatGoods`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}
