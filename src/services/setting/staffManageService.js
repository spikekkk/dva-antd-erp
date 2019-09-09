/* eslint-disable no-undef */

//查询员工列表
export async function queryShopUser(params) {
  return requestData(`${BASE_URL}/manage/plat/user/findAll`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//重置员工密码
export async function reset(params) {
  return requestData(`${BASE_URL}/manage/plat/user/pwdReset`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//删除员工
export async function deleteStaff(params) {
  return requestData(`${BASE_URL}/manage/plat/user/delete`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

/**********************************角色管理**************************************/

/*请求左边角色总览列表数据*/
export async function searchAllRoleList(params) {
  return requestData(`${BASE_URL}/manage/plat/role/list`, {
    method: 'post',
    body: JSON.stringify(params || {}),
  });
}

/*请求右边所有功能列表数据*/
export async function searchAllFunction(params) {
  return requestData(`${BASE_URL}/manage/plat/role/tree`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

/*左边角色列表重命名角色*/
export async function RenameRole(params) {
  return requestData(`${BASE_URL}/manage/plat/role/rename`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

/*左边角色列表复制角色*/
export async function CopyRole(params) {
  return requestData(`${BASE_URL}/manage/plat/role/copy`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

/*左边角色列表删除角色*/
export async function DeleteRole(params) {
  return requestData(`${BASE_URL}/manage/plat/role/delete`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

/*左边角色列表新增角色*/
export async function CreateRole(params) {
  return requestData(`${BASE_URL}/manage/plat/role/create`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

/*权限保存*/
export async function SaveRoleFunction(params) {
  return requestData(`${BASE_URL}/manage/plat/role/update`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}
