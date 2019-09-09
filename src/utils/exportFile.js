import { message, } from 'antd';

export function exportFile(res, val, firlsName) {
  const content = res;
  const blob = new Blob([content,]);
  const fileName =
    firlsName + val + '--' + new Date().toLocaleString() + '.xlsx';
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
  message.success('下载成功');
}
