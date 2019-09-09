/*
 * 表单校验的工具方法
 */

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓口碑的表单相关校验↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

/*
 * 关键字校验
 * 禁止输入以下关键字: 储值卡、充值卡、会员卡、vip卡、充值卡、打折卡、年卡、美容卡、健身卡
 */
export function checkWrongWord(rule, value, callback) {
  if (value && value != '') {
    if (
      /^.*(储\s*值\s*卡|充\s*值\s*卡|会\s*员\s*卡|v\s*i\s*p\s*卡|充\s*值\s*卡|打\s*折\s*卡|年\s*卡|美\s*容\s*卡|健\s*身\s*卡).*$/.test(
        value.toLowerCase()
      )
    ) {
      callback('不能包含关键字');
    } else {
      callback();
    }
  } else {
    callback();
  }
}

/*
 * 校验是否是纯数字
 */
export function checkDenyOnlyNum(rule, value, callback) {
  if (/^[0-9.]*$/.test(value)) {
    callback('内容项不可以是纯数字');
  } else {
    callback();
  }
}

/*
 * 校验必须是纯数字
 */
export function checkIsOnlyNum(rule, value, callback) {
  if (!/^[0-9.]*$/.test(value)) {
    callback('内容项必须纯数字');
  } else {
    callback();
  }
}

/*
 * 校验是否未填写内容
 */
export function checkWetherSpace(rule, value, callback) {
  if (
    value == '' ||
    value == undefined ||
    value == null ||
    /^[\s]*$/.test(value)
  ) {
    callback(new Error('填写内容不能为空'));
  } else {
    callback();
  }
}

//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑口碑的表单相关校验↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
