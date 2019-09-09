/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import { Button, Modal, Form, Calendar, InputNumber, message, } from 'antd';
import moment from 'moment';
import styles from './stockSettingModalComponent.less';
const FormItem = Form.Item;

function stockSettingComponent({
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
  singleStockSettingVisible, // 库存设置显隐
  singleSelectedDate, // 单个设置选中日期
  stockList, // 设置库存列表
  defaultDateStock, //当天设置库存数
  defaultDateAmount, // 当天设置限额
  //方法
  singleDateStockCancel, // 单个日期设置关闭
  selectDateChange, //单个库存日期选择改变
  countChange, // 数量更新
  amountChange, // 单个限额设置改变
  onPanelChangeAction,
  singleDateStockSetSave, //单个日期库存设置保存
}) {
  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*保存*/
  const confirmCreateAction = () => {
    singleDateStockSetSave();
  };

  /* 禁用日期 */
  function disabledDate(val) {
    if (val > moment().add(-1, 'd')) {
      return false;
    } else {
      return true;
    }
  }
  /* 日期选择改变 */
  function onChange(date) {
    console.log(
      '日期改变数-----------',
      getFieldValue('stockNum'),
      getFieldValue('amount')
    );
    // if (
    //   (getFieldValue('stockNum') == 0 && getFieldValue('amount') == 0) ||
    //   (getFieldValue('stockNum') > 0 && getFieldValue('amount') > 0)
    // ) {
    const dateValue = moment(date).format('YYYY-MM-DD');
    selectDateChange(date);
    resetFields(['stockNum', 'amount',]);
    stockList &&
      stockList.map(item => {
        if (item.date == dateValue) {
          setFieldsValue({ stockNum: item.stock, amount: item.amount, });
        }
      });
    // } else {
    //   message.error('库存和限额不能小于0');
    // }
  }
  /* 月份切换 */
  function onPanelChange(date, mode) {
    const dateValue = moment(date).format('YYYY-MM-DD');
    onPanelChangeAction(date);
    resetFields(['stockNum', 'amount',]);
    stockList &&
      stockList.map(item => {
        if (item.date == dateValue) {
          setFieldsValue({ stockNum: item.stock, amount: item.amount, });
        }
      });
  }
  /* 数量改变 */
  function numChange(val) {
    const idx = stockList.findIndex(
      item => item.date === moment(singleSelectedDate).format('YYYY-MM-DD')
    );
    if (idx == -1) {
      stockList.push({
        date: moment(singleSelectedDate).format('YYYY-MM-DD'),
        stock: val,
        amount: defaultDateAmount,
      });
    }
    stockList &&
      stockList.map(item => {
        if (item.date == moment(singleSelectedDate).format('YYYY-MM-DD')) {
          item.stock = val;
        }
      });
    countChange(val);
  }

  /* 限额改变 */
  function amountChangeAction(val) {
    const idx = stockList.findIndex(
      item => item.date === moment(singleSelectedDate).format('YYYY-MM-DD')
    );
    if (idx == -1) {
      stockList.push({
        date: moment(singleSelectedDate).format('YYYY-MM-DD'),
        stock: defaultDateStock,
        amount: val,
      });
    }
    stockList &&
      stockList.map(item => {
        if (item.date == moment(singleSelectedDate).format('YYYY-MM-DD')) {
          item.amount = val;
        }
      });
    amountChange(val);
  }

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelAdd"
          onClick={singleDateStockCancel}
        >
          取消
        </Button>,
        <Button
          key="confirmAdd"
          onClick={confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
      maskClosable={false}
      onCancel={singleDateStockCancel}
      onClose={singleDateStockCancel}
      title={''}
      visible={singleStockSettingVisible}
      width="600px"
      wrapClassName="stock_vertical_center_modal"
    >
      <div>
        <div className={styles.head}>
          <span style={{ marginRight: '50px', }}>商品总库存: 不限制</span>
        </div>
        <div className={styles.content}>
          <div
            style={{
              width: 300,
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              marginRight: '20px',
            }}
          >
            <Calendar
              disabledDate={disabledDate}
              fullscreen={false}
              onChange={onChange}
              onPanelChange={onPanelChange}
              value={singleSelectedDate}
            />
          </div>
          <div>
            <div style={{ marginBottom: '10px', }}>设置数量</div>
            <FormItem>
              {getFieldDecorator('stockNum', {
                initialValue: defaultDateStock || -1,
                rules: [{ required: true, message: '请输入数量', },],
              })(
                <InputNumber
                  min={-1}
                  onChange={numChange}
                  placeholder="请输入数量"
                  precision={0}
                  step={1}
                />
              )}
            </FormItem>
            <div style={{ marginBottom: '10px', }}>设置限额</div>
            <FormItem>
              {getFieldDecorator('amount', {
                initialValue: defaultDateAmount || 0,
                rules: [{ required: true, message: '请输入限额', },],
              })(
                <InputNumber
                  min={0.0}
                  onChange={amountChangeAction}
                  placeholder="请输入限额"
                  precision={2}
                  step={0.01}
                />
              )}
            </FormItem>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default Form.create({})(stockSettingComponent);
