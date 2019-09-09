/*查询订单列表*/
export async function queryCustomerList(params) {
    return requestData(`${BASE_URL}/manage/plat/cust/queryCustomer`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }