import { message, } from 'antd';

/*
 * textarea数据格式转换
 */
export function transformPic(arr) {
  const imgs = [];
  !!arr &&
    arr.map(item => {
      const head_img_item = item;
      const head_img_item_res = item.response;
      if (head_img_item_res && head_img_item_res.errorCode == 9000) {
        imgs.push(head_img_item_res.data.url);
      } else {
        imgs.push(head_img_item.url || '');
      }
    });
  return imgs.join(',');
}

/**
 * 富文本编辑器上传
 *
 * @param {object} param        必传
 * @param {string} serverURL    上传地址
 * @returns  void
 */
export function richTextUpload(param, serverURL) {
  const xhr = new XMLHttpRequest();
  const fd = new FormData();

  // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
  console.log(param.libraryId);

  // eslint-disable-next-line no-unused-vars
  const successFn = response => {
    // 假设服务端直接返回文件上传后的地址
    // 上传成功后调用param.success并传入上传后的文件地址
    message.success('上传成功');
    param.success({
      url: JSON.parse(xhr.responseText).data.url,
      meta: {
        id: param.file.lastModified,
        title: param.file.name,
        alt: '图片',
        loop: true, // 指定音视频是否循环播放
        autoPlay: true, // 指定音视频是否自动播放
        controls: true, // 指定音视频是否显示控制栏
        poster: 'https://img.tamizoo.cn/img/6f6719b2536bac61b1daa223417fbaa2', // 指定视频播放器的封面
      },
    });
  };

  const progressFn = event => {
    // 上传进度发生变化时调用param.progress
    param.progress((event.loaded / event.total) * 100);
  };

  // eslint-disable-next-line no-unused-vars
  const errorFn = response => {
    // 上传发生错误时调用param.error
    param.error({
      msg: '上传失败',
    });
  };

  xhr.upload.addEventListener('progress', progressFn, false);
  xhr.addEventListener('load', successFn, false);
  xhr.addEventListener('error', errorFn, false);
  xhr.addEventListener('abort', errorFn, false);

  fd.append('file', param.file);
  xhr.open('POST', serverURL, true);
  xhr.send(fd);
}
