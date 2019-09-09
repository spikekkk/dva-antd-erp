/* eslint-disable no-undef */
import qs from 'qs';

//获取全部口碑门店数据
export async function GetCheckBoxAndChoose(params) {
  return requestData(`${BASE_URL}/attendancePrint/attendInfo`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(params),
  });
}

//保存设置选项
export async function SaveSmallTicketSet(params) {
  return requestData(`${BASE_URL}/attendancePrint/saveAttendInfo`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(params),
  });
}

//保存设置选项
export async function Test(params) {
  return requestData(`${BASE_URL}/admin/mapData`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(params),
  });
}
