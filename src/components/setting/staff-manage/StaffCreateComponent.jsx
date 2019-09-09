/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Icon,
  Radio,
  DatePicker,
  Row,
  Col,
  message,
  Cascader,
  Checkbox,
} from 'antd';
import moment from 'moment';
import { BlockTitle, } from '../../common/new-component/NewComponent';
import './StaffCreateComponent.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea, } = Input;

function StaffCreateComponent({
  createVisible, //新增显示
  createLoading,
  mgrShops,
  choose_mgrShops,
  record_mgrShops,
  modalType, //弹窗类型
  userInfo, //员工信息
  roleList, //所有角色

  //方法
  cancelCreate, //取消
  confirmCreate, //确定
  showParkList, //显示管辖游乐园

  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    validateFields,
    getFieldsValue,
    getFieldValue,
    getFieldError,
    setFieldsValue,
    resetFields,
  },
}) {
  const formItemLayout = {
    labelCol: { span: 5, },
    wrapperCol: { span: 19, },
  };

  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*确定*/
  const confirmCreateAction = () => {
    validateFieldsAndScroll((err, values) => {
      console.log(err)
      if (!!err) {
        return;
      }

      confirmCreate(values);
    });
  };

  const validator = (rule, value, callback) => {
    if (modalType == '1') {
      if (!mgrShops || mgrShops.length <= 0) {
        callback('请选择游乐园！');
      }
    } else {
      if (!userInfo.mgrShops || userInfo.mgrShops.split(',').length <= 0) {
        callback('请选择游乐园！');
      }
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  const title =
    modalType == '1' ? '新增员工' : modalType == '2' ? '编辑员工' : 'title';

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelStudent"
          onClick={cancelCreate}
        >
          取消
        </Button>,
        <Button
          disabled={createLoading}
          key="confirmStudent"
          loading={createLoading}
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
      title={title}
      visible={createVisible}
      width="500px"
      wrapClassName="vertical_center_modal"
    >
      <Form>
        <BlockTitle content="基本信息" />
        <FormItem {...formItemLayout}
          label="员工姓名"
        >
          {getFieldDecorator('name', {
            initialValue: userInfo.name || '',
            rules: [{ required: true, message: '请输入员工姓名', },],
          })(<Input placeholder="请输入员工姓名" />)}
        </FormItem>
        <FormItem {...formItemLayout}
          label="员工手机"
        >
          {getFieldDecorator('mobile', {
            initialValue: userInfo.mobile || '',
            rules: [{ pattern: /^1\d{10}$/, message: '请输入11位手机号', },],
          })(<Input placeholder="请输入员工手机" />)}
        </FormItem>
        <FormItem {...formItemLayout}
          label="性别"
        >
          {getFieldDecorator('sex', {
            initialValue: userInfo.sex || '',
            rules: [{ required: true, message: '请选择性别', },],
          })(
            <RadioGroup>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="简介"
        >
          {getFieldDecorator('intro', {
            initialValue: userInfo.intro || '',
            rules: [{ max: 255, message: '字数不得超过255', },],
          })(<TextArea placeholder="请输入简介(字数不超过255)"
            rows={4}
          />)}
        </FormItem>

        <BlockTitle content="账号信息" />
        <FormItem {...formItemLayout}
          label="账号"
        >
          {getFieldDecorator('acct', {
            initialValue: userInfo.acct || '',
            rules: [
              {
                required: true,
                pattern: /^[a-zA-Z0-9]{6,20}$/,
                message: '请输入账号（6-20位字母或数字）',
              },
            ],
          })(<Input disabled={modalType == '2'}
            placeholder="请输入账号"
          />)}
        </FormItem>
        <FormItem {...formItemLayout}
          label="初始密码"
        >
          {getFieldDecorator('pwd', {
            initialValue: '123456',
            rules: [{ required: true, message: '请输入初始密码', },],
          })(<Input disabled
            placeholder="请输入初始密码"
          />)}
        </FormItem>

        <BlockTitle content="职能信息" />
        <FormItem {...formItemLayout}
          label="角色"
        >
          {getFieldDecorator('roleId', {
            initialValue: userInfo.roleId || '',
            rules: [{ required: true, message: '请输入角色', },],
          })(
            <Select placeholder="请输入角色">
              {roleList &&
                roleList.map((role, index) => {
                  return (
                    <Option key={'role_' + index}
                      value={role.id}
                    >
                      {role.name}
                    </Option>
                  );
                })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="管辖游乐园"
        >
          {getFieldDecorator('mgrShops', {
            rules: [{ validator: validator, },],
          })(
            <div style={{ lineHeight: '28px', }}>
              {!!mgrShops && mgrShops.length > 0
                ? mgrShops.length + '个'
                : '请选择管辖游乐园'}
              <Button
                onClick={showParkList}
                style={{ marginLeft: 20, }}
                type="primary"
              >
                选择
              </Button>
            </div>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create({})(StaffCreateComponent);
