/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import {
  Button,
  Modal,
  Form,
  InputNumber,
  message,
} from 'antd';
const FormItem = Form.Item;
import styles from './stockAndAmountModal.less';

function stockSettingComponent({
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
  stock, // 总库存
  amount, // 商品预约限额
  isSetStockAndAmount, //设置库存和限额
  selectedDate, //选中的日期
  /* 方法 */
  setStockAndAmountCancel, // 取消查看库存和限额
  setStockAndAmountConfirm, // 确认
}) {

  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*保存*/
  const confirmCreateAction = () => {
    validateFieldsAndScroll((err, values) => {
      if((values.stock > 0 && values.amount > 0)) {
        setStockAndAmountConfirm(values);
      }else {
        message.error('总库存或预约限额不能小于0');
      }
    });
  };
  const dateStr = selectedDate && selectedDate.slice(5);
  const reg =/(\d{2})\-(\d{2})/;
  const date = dateStr.replace(reg,'$1月$2日');
  return (
    <Modal
      afterClose={afterClose}
      className="look_stock_modal"
      footer={[
        // <Button key="cancelAdd"
        //   onClick={setStockAndAmountCancel}
        // >
        //   取消
        // </Button>,
        // <Button
        //   key="confirmAdd"
        //   onClick={confirmCreateAction}
        //   style={{ marginLeft: 20, }}
        //   type="primary"
        // >
        //   确定
        // </Button>,
      ]}
      maskClosable={false}
      onCancel={setStockAndAmountCancel}
      onClose={setStockAndAmountCancel}
      title={''}
      visible={isSetStockAndAmount}
      width="400px"
      wrapClassName="stock_vertical_center_modal"
    >
      <div>
        <div className={styles.date}>{date}</div>
        <Form>
          <div className={styles.stock}>
          商品总库存：
            <FormItem style={{display:'inline-block',}}>
              {getFieldDecorator('stock', {
                initialValue: stock || 0,
                rules: [{ required: false , message: '请输入商品总库存', },],
              })(
                <InputNumber
                  disabled
                  formatter={value => `${value}个`}
                  min={0}
                  precision={0}
                  step={1}
                  style={{width:'120px',}}
                />
              )}
            </FormItem>
          </div>
          <div className={styles.amount}>
            商品预约限额：
            <FormItem style={{display:'inline-block',}}>
              {getFieldDecorator('amount', {
                initialValue: amount || 0,
                rules: [{ required: false , message: '请输入商品预约限额', },],
              })(
                <InputNumber
                  disabled
                  formatter={value => `${value}元`}
                  min={0.00}
                  precision={2}
                  step={0.01}
                  style={{width:'120px',}}
                />
              )}
            </FormItem>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default Form.create({})(stockSettingComponent);
