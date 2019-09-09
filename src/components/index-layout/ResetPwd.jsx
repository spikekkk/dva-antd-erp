import React from 'react';
import { Modal, Form, Button, Input, message, } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

function ResetPwd({
  visible,
  loading,
  cancelCreate,
  confirmCreate,

  form: {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
    getFieldsValue,
    resetFields,
    getFieldValue,
    validateFieldsAndScroll,
  },
}) {
  /*检验密码是否有空格*/
  function checkPassWord(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback();
    } else if (/^[\s]*$/.test(value)) {
      callback(new Error('密码不能为空'));
    } else if (value.indexOf(' ') >= 0) {
      callback(new Error('密码中不能包含空格'));
    } else {
      callback();
    }
  }

  /*弹窗关闭后*/
  function afterClose() {
    resetFields();
  }

  /*保存*/
  function confirmCreateAction() {
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      if (values.newPwd != values.confirmPwd) {
        message.error('新密码与确认新密码不一致，请修改');
        return;
      }
      confirmCreate(values);
    });
  }

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelReset"
          onClick={cancelCreate}
        >
          取消
        </Button>,
        <Button
          disabled={loading}
          key="confirmReset"
          loading={loading}
          onClick={confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          保存
        </Button>,
      ]}
      maskClosable={false}
      onCancel={cancelCreate}
      onClose={cancelCreate}
      title="重置密码"
      visible={visible}
      width="500px"
      wrapClassName="vertical_center_modal"
    >
      <Form>
        <FormItem label="原密码"
          {...formItemLayout}
        >
          {getFieldDecorator('oldPwd', {
            rules: [
              { required: true, message: '请输入原密码', },
              { validator: checkPassWord, },
            ],
          })(
            <Input placeholder="请输入原密码"
              size="default"
              type="password"
            />
          )}
        </FormItem>
        <FormItem label="新密码"
          {...formItemLayout}
        >
          {getFieldDecorator('newPwd', {
            rules: [
              {
                required: true,
                message: '请输入新密码(6-12位)',
                min: 6,
                max: 12,
              },
              { validator: checkPassWord, },
            ],
          })(
            <Input
              placeholder="请输入新密码(6-12位)"
              size="default"
              type="password"
            />
          )}
        </FormItem>
        <FormItem label="确认新密码"
          {...formItemLayout}
        >
          {getFieldDecorator('confirmPwd', {
            rules: [
              {
                required: true,
                message: '请确认新密码(6-12位)',
                min: 6,
                max: 12,
              },
              { validator: checkPassWord, },
            ],
          })(
            <Input
              placeholder="请确认新密码(6-12位)"
              size="default"
              type="password"
            />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(ResetPwd);
