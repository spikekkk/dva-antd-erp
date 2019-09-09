/* eslint-disable no-undef */
/*查询表格coulum项目*/
export async function tableColumnQuery(params) {
  return requestData(`${BASE_URL}/manage/table/tableColumnQuery`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*保存表格coulum项目*/
export async function tableColumnSave(params) {
  return requestData(`${BASE_URL}/manage/table/tableColumnSave`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
