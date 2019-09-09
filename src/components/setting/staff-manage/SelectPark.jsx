/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Modal, Select, Form, Button, Checkbox, List, Input,Row, Col } from 'antd';
import styles from './SelectPark.less';
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const { Search } = Input;

function SelectPark({
  checkedall,
  parkVisible, //显示
  parkList, //游乐园列表
  searchparkList,
  mgrShops, //当前管辖游乐园
  choose_mgrShops,
  //方法
  cancelPark, //取消
  confirmPark, //确定
  searchParkFn,
  onCheckAllChange,
  checkboxChangeFn,
  handleCheck,
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

  //搜索
  function search(val){
    let newArr=[];
    parkList.map(item=>{
      if(item.label.includes(val)){
        newArr.push(item)
      }
    })
    searchParkFn(newArr)
  }

  const formItemLayout = {
    labelCol: { span: 0, },
    wrapperCol: { span: 24, },
  };

  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*选择管辖游乐园*/
  const confirmParkAction = () => {
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      confirmPark(values);
    });
  };

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelPark"
          onClick={cancelPark}
        >
          取消
        </Button>,
        <Button
          key="confirmPark"
          onClick={confirmParkAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          保存
        </Button>,
      ]}
      maskClosable={false}
      onCancel={cancelPark}
      onClose={cancelPark}
      title="管辖游乐园"
      visible={parkVisible}
      width="500px"
      wrapClassName="vertical_center_modal"
      centered={false}
    >
      <FormItem {...formItemLayout}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:'10px',borderBottom:'1px solid rgba(217,217,217,1)'}}>
          <Checkbox checked={checkedall} onChange={onCheckAllChange}>全选</Checkbox>
          <Search style={{width:'70%'}} placeholder="搜索" onSearch={search} enterButton />
        </div>
        {getFieldDecorator('name', {
          initialValue: choose_mgrShops || [],
          // rules: [{ required: true, message: '请选择管辖游乐园', },],
          rules:[{validator:handleCheck}]
        })(
            <CheckboxGroup onChange={checkboxChangeFn} className={styles.boxstyle} options={searchparkList} />
        )}
      </FormItem>
    </Modal>
  );
}

export default Form.create({})(SelectPark);
