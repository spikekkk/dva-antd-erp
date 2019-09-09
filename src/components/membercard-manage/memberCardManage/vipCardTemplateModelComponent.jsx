/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import {
  Button,
  Modal,
  Upload,
  message,
} from 'antd';
import styles from './vipCardTemplateModelComponent.less';
import CalendarComponent from './calendar/calendar';

function stockSettingComponent({
  stockSettingVisible, // 库存设置显隐
  holidays, //节假日[]
  holidayList, //节假日对象[]
  year,	//年
  today,
  //方法
  stockSettingCancel, // 关闭
  selectDate, //选中某个日期
  beforeYear, // 上一年
  nextYear, // 下一年
  uploadChange, // 上传文件
}) {

  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  function selectDate1() {

  }

  const calendarProps = {
    holidays, //节假日[]
    holidayList, //节假日对象[]
    year,	//年
    today,
    /* 方法 */
    selectDate, //选中某个日期
    beforeYear, // 上一年
    nextYear, // 下一年
  };
  const uploadProps = {
    name: 'file',
    action: `${BASE_URL}/manage/plat/goods/vip/importVipCardDateSetAppoint`,
    accept: '.xlsx' || '.xls',
    showUploadList: false,
    onChange:(info) => uploadChange(info),
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[]}
      maskClosable={false}
      onCancel={stockSettingCancel}
      onClose={stockSettingCancel}
      title={'会员卡预约配置模板'}
      visible={stockSettingVisible}
      width="1100px"
      wrapClassName="vertical_center_modal"
    >
      <div>
        <div style={{marginBottom:'10px',}}>
          {/* <div className={styles.head}>最近上传时间：2019-7-10</div> */}
          <div className={styles.uploadBtn}>
            <Upload {...uploadProps}>
              <Button
                type="primary"
              >上传</Button>
            </Upload>
          </div>
        </div>
        <div className={styles.content}>
          <CalendarComponent {...calendarProps}/>
        </div>
      </div>
    </Modal>
  );
}

export default stockSettingComponent;
