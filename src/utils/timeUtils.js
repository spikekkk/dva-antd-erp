/*
 *	时间函数(获取当前时间)
 */
export function getNowFormatDate() {
  const date = new Date();
  const seperator1 = '-';
  const seperator2 = ':';
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  const currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    ' ' +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
}

//
///*
// *	验证数字
// */
//export function isNum(value) {
//	const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
//	if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
//		return true;
//	}
//	return false;
//}
