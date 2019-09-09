/*查询预约订单列表*/
export async function queryPlatAppointOrderList(params) {
    return requestData(`${BASE_URL}/manage/plat/appoint/findCanceled`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }

export async function handleSe(params) {
    return requestData(`${BASE_URL}/manage/plat/appoint/handledCancelAfterDraw`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }