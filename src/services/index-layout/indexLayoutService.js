/* eslint-disable no-undef */

//用户对应门店查询
export async function getUserPermShops(params) {
  return requestData(`${BASE_URL}/manage/auth/findMgrShops`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//员工修改密码
export async function updateShopUser(params) {
  return requestData(`${BASE_URL}/manage/plat/user/pwdChange`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//获取所管辖的游乐园----乐园
export async function queryShopByMgrShops(params) {
  return requestData(`${BASE_URL}/manage/auth/findMgrShops`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//获取菜单及操作权限
export async function getMenuList(params) {
  return requestData(`${BASE_URL}/manage/auth/permission`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}
