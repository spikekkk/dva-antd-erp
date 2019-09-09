/* eslint-disable no-undef */
import React from 'react';
import styles from './editeShopDetailComponent.less';

import position from '../../utils/area';
import moment from 'moment';
import { Map, Marker, } from 'react-bmap';

import { transformPic, } from '../../utils/uploadUtils';
import {
  Button,
  Modal,
  Form,
  Input,

  Upload,
  Icon,
  Radio,
  DatePicker,

  message,
  Cascader,
  Checkbox,
  Alert,

} from 'antd';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { TextArea, } = Input;
function EditeShopDetailComponent({
  isCopy,
  shopDetailMess,
  editeShopDetailShow,
  closeDialog,
  createLoading,
  shareImage,
  shareVisible,
  sharePreview,
  shareCancel,
  handlePreview, //门店图预览
  handleCancel, //门店图取消预览
  previewVisible, //门店预览显示
  previewImage, //门店预览图片
  updateAddree,
  lng,
  lat,
  shopAddress,
  saveValues,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
}) {

  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };
  /*logo*/
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  /*logo图片上传*/
  function shareFileList() {
    const fileList = [];
    !!shopDetailMess.logo
      ? shopDetailMess.logo.split(',').map((item, index) => {
        const file = {
          uid: -(index + 1),
          name: index,
          status: 'done',
          url: item,
        };
        fileList.push(file);
      })
      : null;
    return fileList;
  }
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="upload_text">选择图片</div>
    </div>
  );
  /*上传状态改变*/
  const uploadStatus = info => {
    if (
      info.file.status != 'uploading' &&
      info.file.response &&
      info.file.response.errorCode != 9000
    ) {
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status === 'done') {
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    }
  };
  function disabledDate(current) {
    return current && current < moment().add(-1, 'd');
  }
  /* 明年的今天 */
  const nextYear = moment(new Date())
    .add(1, 'year')
    .format('YYYY-MM-DD');

  const supFacArr = shopDetailMess.suppFac
    ? shopDetailMess.suppFac.split(',')
    : [];
  const supFacList = [
    { label: '无线', value: '1', },
    { label: '停车劵', value: '2', },
    { label: '休息区', value: '3', },
    { label: '寄存区', value: '4', },
  ];
  /*门店上传图片*/
  function getfileList() {
    const fileList = [];
    !!shopDetailMess.imgs
      ? shopDetailMess.imgs.split(',').map((item, index) => {
        const file = {
          uid: -(index + 1),
          name: index,
          status: 'done',
          url: item,
        };
        fileList.push(file);
      })
      : null;
    return fileList;
  }
  /*图片大小限制*/
  function imgMaxSize(file, size, title) {
    const fileSize = file.size;
    if (fileSize > 1048576 * size) {
      message.error(title + '大小不能超过' + size + 'M');
      return false;
    }
  }
  /*百度地图 地址逆向解析 */
  function bmapQuerAdd(e) {
    const geoc = new BMap.Geocoder();
    const pt = e.point;
    geoc.getLocation(pt, function(rs) {
      const addComp = rs.addressComponents;
      const addressStr=addComp.province +
      ', ' +
      addComp.city +
      ', ' +
      addComp.district +
      ', ' +
      addComp.street +
      ', ' +
      addComp.streetNumber;
      setFieldsValue({
        address:addressStr,
        lat: e.point.lat,
        lng: e.point.lng,
      });
      updateAddree({
        lat: e.point.lat,
        lng: e.point.lng,
        shopAddress:addressStr,
      });
    });
  }

  function queryMapPosition(add,city){
    const myGeo = new BMap.Geocoder();
    myGeo.getPoint(add, function(point){
      if (point) {
        console.log('解析成功');
        updateAddree({
          lat: point.lat,
          lng: point.lng,
          shopAddress:add,
        });
      }else{
        <Alert
          description="您选择地址没有解析到结果!"
          message="Warning"
          showIcon
          type="warning"
        />;

      }
    }, city);
  }

  function addressBlur(){
    const addressValue=getFieldValue('address');
    const city=getFieldValue('provinceCityDistrict')[1];
    queryMapPosition(addressValue,city);
  }

  function selectCityChange(val){
    queryMapPosition(val,'');
  }
  /*保存*/
  const confirmCreateAction = () => {
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      if(!values.provinceCityDistrict){
        message.error('请选择门店省市区');
        return;
      }
      if(Array.isArray(values.address)){
        values.address=values.address.join(',');
      }
      values.lon = lng;
      values.lat = lat;
      values.coopStartTime = values.coopTime[0].format('YYYY-MM-DD HH:mm:ss');
      values.coopEndTime = values.coopTime[1].format('YYYY-MM-DD HH:mm:ss');
      values.logo = transformPic(values.logo);
      values.imgs = transformPic(values.imgs);
      values.suppFac = values.supFac.join(',');
      values.province = values.provinceCityDistrict[0]||'';
      values.city = values.provinceCityDistrict[1]||'';
      values.district = values.provinceCityDistrict[2]||'';
      delete values.openTimeRange;
      delete values.coopTime;
      delete values.provinceCityDistrict;
      delete values.supFac;
      if (shopDetailMess.id) values.shopId = shopDetailMess.id;
      saveValues(values);
      //status
    });
  };
  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };


  return (
    <Modal
      afterClose={afterClose}
      footer={[
        [
          <Button key="cancelAdd"
            onClick={closeDialog}
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
        ],
      ]}
      onCancel={closeDialog}
      title={isCopy?'复制门店':shopDetailMess.name ? '编辑门店' : '新增门店'}
      visible={editeShopDetailShow}
      width="800px"
    >
      <div className={styles.shopDetailContainer}>
        <Form>
          <FormItem {...formItemLayout}
            label="店铺名称"
          >
            {getFieldDecorator('name', {
              initialValue: shopDetailMess.name,
              rules: [
                { required: true, message: '请输入商品名称', },
                { max: 50, message: '名称不得超过50字', },
              ],
            })(<Input placeholder="请输入门店名称(限50字以内)" />)}
          </FormItem>
          <FormItem {...formItemLayout}
            label="门店电话"
          >
            {getFieldDecorator('tel', {
              initialValue: shopDetailMess.tel,
              rules: [{ required: true, message: '请输入电话', },],
            })(<Input placeholder="请输入门店电话" />)}
          </FormItem>
          <FormItem {...formItemLayout}
            label="商家营业时间"
          >
            {getFieldDecorator('bussTime', {
              initialValue: shopDetailMess.bussTime,
              rules: [{ required: true, message: '请输入营业时间', },],
            })(<Input placeholder="请输入营业时间" />)}
          </FormItem>
          <FormItem {...formItemLayout}
            label="所在城市"
          >
            {getFieldDecorator('provinceCityDistrict', {
              initialValue: [shopDetailMess.province, shopDetailMess.city,shopDetailMess.district,],
              rules: [{ required: true, message: '请选择地址', },],
            })(<Cascader onChange={(val)=>{
              selectCityChange(val);
            }}
            options={position}
            />)}
          </FormItem>
          <FormItem {...formItemLayout}
            label="商家地址"
          >
            {getFieldDecorator('address', {
              initialValue: shopAddress,
              rules: [{ required: true, message: '请输入门店地址', },],
            })(<Input onBlur={addressBlur}
              placeholder="请输入门店地址"
               />)}
          </FormItem>
          <div id="mapContainer">
            <Map
              center={{ lng: lng || 116.404, lat: lat || 39.915, }}
              enableScrollWheelZoom
              events={{
                click: e => {
                  bmapQuerAdd(e);
                },
              }}
              style={{ height: '250px', width: '750px', margin: '0 auto 10px', }}
              zoom={20}
            >
              <Marker
                position={{
                  lng: lng,
                  lat: lat,
                }}
              />
            </Map>
          </div>
          <FormItem
            {...formItemLayout}
            className="upload_item"
            help="最多1张, 推荐宽度750, 支持png, jpeg, gif格式的图片, 不大于5M"
            label="logo图片"
          >
            {getFieldDecorator('logo', {
              initialValue: shareFileList(),
              valuePropName: 'fileList',
              action: `${BASE_URL}/manage/uploadController/upload`,
              normalize: normFile,
              rules: [
                { type: 'array', required: true, message: '请上传logo图片', },
              ],
            })(
              <Upload
                action={BASE_URL + '/manage/uploadController/upload'}
                beforeUpload={(file, fileList) =>
                  imgMaxSize(file, 5, '分享图片')
                }
                listType="picture-card"
                onChange={uploadStatus}
                onPreview={sharePreview}
              >
                {getFieldValue('logo') && getFieldValue('logo').length >= 1
                  ? null
                  : uploadButton}
              </Upload>
            )}
          </FormItem>
        </Form>
        <Modal
          footer={null}
          onCancel={shareCancel}
          visible={shareVisible}
          width="792px"
          wrapClassName="upload_modal"
        >
          <img alt="分享图片"
            src={shareImage}
            style={{ width: '100%', }}
          />
        </Modal>
        <FormItem
          {...formItemLayout}
          help="最多9张,推荐宽度750, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="门店图片"
        >
          {getFieldDecorator('imgs', {
            initialValue: getfileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [
              { type: 'array', required: true, message: '请上传门店图片', },
            ],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '门店图片')}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={handlePreview}
            >
              {getFieldValue('imgs') && getFieldValue('imgs').length >= 9
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>
        <Modal
          footer={null}
          onCancel={handleCancel}
          visible={previewVisible}
          wrapClassName="upload_modal"
        >
          <img alt="会员卡长图"
            src={previewImage}
            style={{ width: '100%', }}
          />
        </Modal>
        <FormItem {...formItemLayout}
          label="门店设置"
        >
          {getFieldDecorator('supFac', {
            initialValue: supFacArr,
            rules: [{ required: true, message: '请选择设施', },],
          })(<CheckboxGroup options={supFacList} />)}
        </FormItem>
        <FormItem {...formItemLayout}
          label="门店说明"
        >
          {getFieldDecorator('intro', {
            initialValue: shopDetailMess.intro,
            rules: [{ max: 2000, message: '字数不得超过2000', },],
          })(
            <TextArea placeholder="请输入门店说明(字数不超过2000)"
              rows={4}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          className="grounding_time"
          label="合同有效期"
        >
          {getFieldDecorator('coopTime', {
            initialValue:
              !!shopDetailMess.coopStartTime || !!shopDetailMess.coopEndTime
                ? [
                  shopDetailMess.coopStartTime &&
                      moment(shopDetailMess.coopStartTime, 'YYYY-MM-DD'),
                  shopDetailMess.coopEndTime &&
                      moment(shopDetailMess.coopEndTime, 'YYYY-MM-DD'),
                ]
                : [
                  moment(new Date(), 'YYYY-MM-DD'),
                  moment(nextYear, 'YYYY-MM-DD'),
                ],
            rules: [{ required: true, message: '请选择预约有效期', },],
          })(
            <RangePicker
              disabledDate={disabledDate}
              format="YYYY-MM-DD HH:mm"
              placeholder={['请选择预约开始时间', '请选择预约结束时间',]}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="门店设置"
        >
          {getFieldDecorator('status', {
            initialValue: shopDetailMess.status||1,
          })(
            <RadioGroup>
              <RadioButton value={1}>营业中</RadioButton>
              <RadioButton value={2}>歇业中</RadioButton>
              <RadioButton value={9}>停业整顿</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
      </div>
    </Modal>
  );
}
export default Form.create({})(EditeShopDetailComponent);
