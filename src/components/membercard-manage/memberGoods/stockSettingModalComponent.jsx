/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import { Button, Modal, Form, Calendar, InputNumber, } from 'antd';
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
  stockSettingVisible, // 库存设置显隐
  createLoading,
  stock, //库存总数
  haveSetStock, //已设置库存
  selectedDate, //选中的日期
  stockList, // 设置库存列表
  orderTimeRange, //预约时间范围
  defaultDateStock, //当天设置库存数
  stockType, //库存类型
  modalType, //弹窗类型
  //方法
  stockSettingFunc, // 打开关闭
  selectDateChange, //时间改变
  countChange, // 数量更新
  onPanelChangeAction, // 月份切换
  stockSettingSave, //库存设置保存
}) {
  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*保存*/
  const confirmCreateAction = () => {
    stockSettingSave();
  };

  /* 禁用日期 */
  function disabledDate(val) {
    if (orderTimeRange && orderTimeRange.length > 0) {
      if (
        val > moment(orderTimeRange[0]).add(-1, 'd') &&
        val < moment(orderTimeRange[1]).add(1, 'd')
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
  /* 日期选择改变 */
  function onChange(date) {
    const dateValue = moment(date).format('YYYY-MM-DD');
    selectDateChange(date);
    resetFields(['stockNum',]);
    stockList &&
      stockList.map(item => {
        if (item.key == dateValue) {
          setFieldsValue({ stockNum: item.value, });
        }
      });
  }

  /* 月份切换 */
  function onPanelChange(date, mode) {
    const dateValue = moment(date).format('YYYY-MM-DD');
    onPanelChangeAction(date);
    resetFields(['stockNum',]);
    stockList &&
      stockList.map(item => {
        if (item.key == dateValue) {
          setFieldsValue({ stockNum: item.value, });
        }
      });
  }
  /* 数量改变 */
  function numChange(val) {
    let num = 0;
    const idx = stockList.findIndex(
      item => item.key === moment(selectedDate).format('YYYY-MM-DD')
    );
    if (idx == -1) {
      stockList.push({
        key: moment(selectedDate).format('YYYY-MM-DD'),
        value: val,
      });
    }
    stockList &&
      stockList.map(item => {
        if (item.key == moment(selectedDate).format('YYYY-MM-DD')) {
          item.value = val;
        }
        num += Number(item.value);
      });
    countChange(val, num);
  }
  const auditDisabled = modalType == 'audit' ? true : false;

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelAdd"
          onClick={stockSettingFunc}
        >
          取消
        </Button>,
        <Button
          disabled={createLoading}
          key="confirmAdd"
          loading={createLoading}
          onClick={confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
      maskClosable={false}
      onCancel={stockSettingFunc}
      onClose={stockSettingFunc}
      title={''}
      visible={stockSettingVisible}
      width="600px"
      wrapClassName="vertical_center_modal"
    >
      <div>
        <div className={styles.head}>
          <span style={{ marginRight: '50px', }}>
            商品总库存:{stockType == '1' ? stock : '不限制'}
          </span>
          <span>已设置：{haveSetStock}个</span>
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
              value={selectedDate}
            />
          </div>
          <div>
            <div style={{ marginBottom: '10px', }}>设置数量</div>
            <FormItem>
              {getFieldDecorator('stockNum', {
                initialValue: defaultDateStock,
                rules: [{ required: true, message: '请输入数量', },],
              })(
                <InputNumber
                  disabled={auditDisabled}
                  min={-1}
                  onChange={numChange}
                  placeholder="请输入数量"
                  precision={0}
                  step={1}
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
