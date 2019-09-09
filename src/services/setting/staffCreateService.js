/* eslint-disable no-undef */

//创建员工
export async function createShopUser(params) {
  return requestData(`${BASE_URL}/manage/plat/user/create`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//获取当前员工信息
export async function getShopUser(params) {
  return requestData(`${BASE_URL}/manage/plat/user/findOne`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//修改员工
export async function updateShopUser(params) {
  return requestData(`${BASE_URL}/manage/plat/user/update`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//获取所有角色
export async function getRoles(params) {
  return requestData(`${BASE_URL}/manage/plat/role/list`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}
