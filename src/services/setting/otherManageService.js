//白名单查询所有
export async function queryWhiteList(params) {
    return requestData(`${BASE_URL}/manage/plat/whitelist/findAll`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
  }

//根据手机号查询白名单
export async function getByMobile(params) {
    return requestData(`${BASE_URL}/manage/plat/whitelist/getByMobile`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//白名单更新
export async function update(params) {
    return requestData(`${BASE_URL}/manage/plat/whitelist/update`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//白名单删除
export async function deleteWhiteList(params) {
    return requestData(`${BASE_URL}/manage/plat/whitelist/delete`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}