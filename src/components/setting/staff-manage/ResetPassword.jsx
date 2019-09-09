import React from 'react';
import { Modal, Button, } from 'antd';

function ResetPassword({
  resetVisible,
  cancelReset,
  confirmReset,
  resetLoading,
}) {
  return (
    <Modal
      className="staff_create_modal"
      footer={[
        <Button key="cancel"
          onClick={cancelReset}
        >
          取消
        </Button>,
        <Button
          disabled={resetLoading}
          key="confirm"
          loading={resetLoading}
          onClick={confirmReset}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确认
        </Button>,
      ]}
      maskClosable={false}
      onCancel={cancelReset}
      onClose={cancelReset}
      title="重置密码"
      visible={resetVisible}
      width="500px"
      wrapClassName="vertical_center_modal"
    >
      <div>密码将重置成123456，是否继续？</div>
    </Modal>
  );
}

export default ResetPassword;
