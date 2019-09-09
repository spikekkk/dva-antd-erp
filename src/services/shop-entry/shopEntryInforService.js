/* eslint-disable no-undef */
/*查询列表*/
export async function businessList(params) {
  return requestData(`${BASE_URL}/manage/plat/business/businessList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*商家入驻状态修改*/
export async function businessStatus(params) {
  return requestData(`${BASE_URL}/manage/plat/business/businessStatus`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//下载批量导入的模版
export async function businessExport(params) {
  return requestData(`${BASE_URL}/manage/plat/business/businessExport`, {
    method: 'post',
    body: JSON.stringify(params),
    responseType: 'blob',
    isJson: true,
  });
}
