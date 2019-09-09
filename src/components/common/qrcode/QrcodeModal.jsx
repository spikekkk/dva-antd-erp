import React from 'react';
import { Modal, Input, Button, message, } from 'antd';
import QRCode from 'qrcode.react';
import styles from './QrcodeModal.less';

function QrcodeModal({
  codeVisible, //二维码显示
  qrUrl, //二维码图片
  path, //二维码地址

  cancelQrcode, //二维码取消
}) {
  /*点击复制*/
  const copyText = () => {
    const copy = document.getElementById('copy');
    copy.select();
    document.execCommand('Copy');
    message.success('复制成功！');
  };

  return (
    <Modal
      footer={null}
      onCancel={cancelQrcode}
      visible={codeVisible}
      width={350}
      wrapClassName="upload_modal"
    >
      {/*<QRCode size={300} value="https://zyg.zhaoshengbao.org/saas-ssp/app/ticket/queryDetail?tId=998745190216871936" />*/}
      {!!qrUrl && qrUrl != '' ? (
        <img className={styles.qrcode_content}
          src={qrUrl}
        />
      ) : (
        <div
          className={styles.qrcode_content}
          style={{ height: 300, lineHeight: '300px', background: '#ddd', }}
        >
          暂无二维码
        </div>
      )}
      <p className={styles.qrcode_text}>请用微信扫一扫</p>
      <div className={styles.qrcode_bottom}>
        <Input
          className={styles.qrcode_input}
          id="copy"
          readOnly
          value={!!path && path != '' ? path : '暂无'}
        />
        <Button onClick={copyText}
          type="primary"
        >
          复制地址
        </Button>
      </div>
    </Modal>
  );
}

export default QrcodeModal;
