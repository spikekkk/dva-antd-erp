/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import {
  Button,
  Modal,
  Checkbox,
  Form,
  Input,
  Select,
  Upload,
  Icon,
  Radio,
  DatePicker,
  InputNumber,
  message,
} from 'antd';
import moment from 'moment';
import { BlockTitle, } from '../../common/new-component/NewComponent';
import { transformArea, } from '../../../utils/arrayUtils';
import { transformPic, } from '../../../utils/uploadUtils';
import styles from './addGoodsModalComponent.less';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { richTextUpload, } from '../../../utils/uploadUtils';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea, } = Input;
const RangePicker = DatePicker.RangePicker;
let id = 0;
let promptId = 0;
function AddTicketComponent({
  addGoodsVisible, //新增显示
  defaultAppointCheckedArr, //默认预约其他信息
  createLoading,
  previewVisible, //封面图预览显示
  previewImage, //封面图预览图片
  bannerVisible, //轮播图预览显示
  bannerImage, //轮播图预览图片
  detail, //详情内容

  stockType, //库存类型
  haveSetStock, //已设置库存
  stockList, // 设置库存列表
  appointNeedLimit, //单人预约限额
  modalType, //弹窗类型
  toupType,
  goodsInfo, // 商品信息
  memberCardList, // 会员卡下拉列表
  selectedDate, ///选中的日期
  appointOther, //预约其他消息项目

  appointOtherList,
  //方法
  onAppointChange,
  cancelCreate, //取消
  addGoodsSave, //确定
  stockSettingFunc, //库存设置
  handlePreview, //封面预览
  handleCancel, //封面取消预览
  bannerPreview, //轮播预览
  bannerCancel, //轮播取消预览
  stockTypeChange, //库存改变
  singleOrderNumChange, //单次预约限制人数
  receiveHtml, //富文本改变
  orderValiTimeChange, // 已设置的库存改变
  stocksChange, //总库存数量
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
}) {
  const auditDisabled = modalType == 'audit' ? true : false;
  const disabled = (modalType == '1'|| modalType=='3') ? false : true;

  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };
  const formItemLayout_1 = {
    labelCol: { span: 12, },
    wrapperCol: { span: 12, },
  };

  getFieldDecorator('keys', {
    initialValue: goodsInfo.appointExplain
      ? JSON.parse(goodsInfo.appointExplain)
      : [],
  });

  function remove(k) {
    const keys = getFieldValue('keys');
    // if (keys.length === 1) {
    //   return;
    // }
    setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  const noAdd = getFieldValue('keys').length == 6 ? true : false;
  function add() {
    const keys = getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    setFieldsValue({
      keys: nextKeys,
    });
  }
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => (
    <div key={disabled ? index : k}>
      <BlockTitle content={'文本' + (index + 1)} />
      <FormItem
        {...formItemLayout}
        key={disabled ? index : k}
        label={'标题'}
        required={false}
      >
        {getFieldDecorator(`appointTitle[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.title,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入文本标题',
            },
            {
              max: 10,
              message: '最多输入十个字符',
            },
          ],
        })(
          <Input
            disabled={auditDisabled}
            placeholder="最多十个字"
            style={{ width: '60%', marginRight: 8, }}
          />
        )}


        {auditDisabled ? (
          ''
        ) : (
          <Icon
            className="dynamic-delete-button"
            onClick={() => remove(k)}
            type="minus-circle-o"
          />
        )
        }
      </FormItem>
      <FormItem
        {...formItemLayout}
        key={(disabled ? index : k) + 'text'}
        label={'内容'}
        required={false}
      >
        {getFieldDecorator(`appointContent[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.content,
          rules: [
            { max: 2000, message: '字数不得超过2000', },
            { required: true, message: '请输入内容', },
          ],
        })(
          <TextArea
            disabled={auditDisabled}
            placeholder="请输入使用说明(字数不超过2000)"
            rows={4}
          />
        )}
      </FormItem>
    </div>
  ));

  getFieldDecorator('promptkeys', {
    initialValue: goodsInfo.appointTips
      ? JSON.parse(goodsInfo.appointTips)
      : [],
  });

  function removePrompt(k) {
    const keys = getFieldValue('promptkeys');
    // if (keys.length === 1) {
    //   return;
    // }
    setFieldsValue({
      promptkeys: keys.filter(key => key !== k),
    });
  }
  const noAddprompt = getFieldValue('promptkeys').length ==3 ? true : false;
  function addPrompt() {
    const keys = getFieldValue('promptkeys');
    const nextKeys = keys.concat(promptId++);
    setFieldsValue({
      promptkeys: nextKeys,
    });
  }
  const promptkeys = getFieldValue('promptkeys');
  const promptFormItems = promptkeys.map((k, index) => (
    <div key={disabled ? index : k}>
      <BlockTitle content={'文本' + (index + 1)} />
      <FormItem
        {...formItemLayout}
        key={disabled ? index : k}
        label={'标题'}
        required={false}
      >
        {getFieldDecorator(`promptTitle[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.title,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入文本标题',
            },
            {
              max: 10,
              message: '最多输入十个字符',
            },
          ],
        })(
          <Input
            disabled={auditDisabled}
            placeholder="最多十个字"
            style={{ width: '60%', marginRight: 8, }}
          />
        )}

        {
          auditDisabled ? (
            ''
          ) : (
            <Icon
              className="dynamic-delete-button"
              onClick={() => removePrompt(k)}
              type="minus-circle-o"
            />
          )
        }
      </FormItem>
      <FormItem
        {...formItemLayout}
        key={(disabled ? index : k) + 'text'}
        label={'内容'}
        required={false}
      >
        {getFieldDecorator(`promptContent[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.content,
          rules: [
            { max: 2000, message: '字数不得超过2000', },
            { required: true, message: '请输入内容', },
          ],
        })(
          <TextArea
            disabled={auditDisabled}
            placeholder="请输入使用说明(字数不超过2000)"
            rows={4}
          />
        )}
      </FormItem>
    </div>
  ));

  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*封面图*/
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  /*保存*/
  const confirmCreateAction = () => {
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      console.log('form进行的value------', values);
      if (values.adultNum == 0 && values.childNum == 0) {
        message.error('大人人数和小孩人数不能同时为0');
        return;
      }
      if (values.cancel == '1') {
        values.lossRate = values.lossRate / 100;
        if (values.refundDay < 0) {
          message.error('退还工作日不能小于0');
          return;
        } else {
          values.workDay = values.refundDay;
        }
      } else if (values.cancel == '0') {
        delete values.lossRate;
        delete values.lossRefundHour;
        if (values.refundDayTwo < 0) {
          message.error('退还工作日不能小于0');
          return;
        } else {
          values.workDay = values.refundDayTwo;
        }
      }
      if (Number(values.settlePrice) > Number(values.price)) {
        message.error('结算价不能大于原价');
        return;
      }
      delete values.refundDay;
      delete values.refundDayTwo;
      if (stockList && stockList.length < 1) {
        message.error('请设置预约库存');
        return;
      }
      values.cover = transformPic(values.cover);
      values.imgs = transformPic(values.imgs);
      values.useStartTime = values.orderValiTime[0].format('YYYY-MM-DD');
      values.useEndTime = values.orderValiTime[1].format('YYYY-MM-DD');
      delete values.orderValiTime;
      values.useNotice =
        values.useNotice && values.useNotice.replace(/\n/g, '<br/>');

      const newAppointContent =
        values.appointContent && values.appointContent.filter(item => item);
      const newAppointTitle =
        values.appointTitle && values.appointTitle.filter(item => item);
      const appointExplain = [];
      if (newAppointContent) {
        for (let i = 0; i < newAppointContent.length; i++) {
          const data = {
            title: newAppointTitle[i],
            content: newAppointContent[i],
          };
          appointExplain[i] = data;
        }
        values.appointExplain = JSON.stringify(appointExplain);//预约说明
      }

      delete values.appointTitle;
      delete values.appointContent;
      const appointChecked = [];
      if (values.appointOtherChecked) {
        values.appointOtherChecked &&
          values.appointOtherChecked.forEach((e, index) => {
            const data = {
              fieldLabel: values.appointItme[e],
              fieldName: e,
            };
            appointChecked.push(data);
          });
        values.additionalInfo = JSON.stringify(appointChecked);//预约选中信息
      }
      const newpromptContent =
      values.promptContent && values.promptContent.filter(item => item);
      const newpromptTitle =
      values.promptTitle && values.promptTitle.filter(item => item);
      const promptExplain = [];
      if (newpromptContent) {
        for (let i = 0; i < newpromptContent.length; i++) {
          const data = {
            title: newpromptTitle[i],
            content: newpromptContent[i],
          };
          promptExplain[i] = data;
        }
        values.appointTips = JSON.stringify(promptExplain);//预约其他信息
      }
      delete values.promptkeys,
      delete values.promptTitle;
      delete values.promptContent;
      delete values.appointTitle;
      delete values.appointContent;
      delete values.appointOtherChecked;
      delete values.appointItme;
      delete values.checkkeys;
      delete values.keys;
      addGoodsSave(values);
    });
  };

  /*封面图上传图片*/
  function getfileList() {
    const fileList = [];
    !!goodsInfo.cover
      ? goodsInfo.cover.split(',').map((item, index) => {
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

  /*轮播图上传图片*/
  function slideFileList() {
    const fileList = [];
    !!goodsInfo.imgs
      ? goodsInfo.imgs.split(',').map((item, index) => {
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
  /*富文本图片校验*/
  const validateFn = file => {
    const fileSize = file.size;
    if (fileSize > 1048576 * 5) {
      message.error('图片大小不能超过' + 5 + 'M');
      return false;
    }
    return true;
  };

  /*富文本上传函数*/
  const uploadFn = param => {
    const serverURL = `${BASE_URL}/manage/uploadController/upload`;
    richTextUpload(param, serverURL);
  };

  /*富文本改变*/
  const receiveHtmlAction = html => {
    setFieldsValue({ detail: html, });
    receiveHtml(html);
  };
  /* 预约有效期设置 */
  function calendarSetting() {
    if (
      getFieldValue('orderValiTime') &&
      getFieldValue('orderValiTime').length > 0
    ) {
      stockSettingFunc(getFieldValue('orderValiTime'));
    } else {
      message.error('请选择预约有效期后方可设置');
    }
  }
  let isRequire = true;
  /* 押金退还情况 */
  function depositRefundChange(e) {
    if (e.target.value == 0) {
      isRequire = true;
      setFieldsValue({ refundDayTwo: 0, });
    } else {
      isRequire = false;
      setFieldsValue({ refundDay: 0, });
    }
  }
  const modalTitle =
    modalType == '1'
      ? '新增商品'
      : modalType == '2'
        ? '编辑商品'
        : modalType == 'audit'
          ? '查看商品'
          : modalType == '3'
            ? '复制商品':
            '';

  getFieldDecorator('checkkeys', { initialValue: appointOtherList, });

  const checkkeys = getFieldValue('checkkeys');
  const checkRightList = checkkeys.map((k, index) => (
    <div key={k.value}>
      <FormItem
        {...formItemLayout}
        key={k.value}
        // label={k.label}
        required={false}
      >
        {getFieldDecorator(`appointItme[${k.value}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.label,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入文本标题',
            },
            {
              max: 10,
              message: '最多输入十个字符',
            },
          ],
        })(
          <Input
            placeholder="最多十个字"
            style={{ width: '60%', marginRight: 8, }}
          />
        )}
      </FormItem>
    </div>
  ));
  /*富文本属性*/
  const editorProps = {
    height: 500,
    contentFormat: 'html',
    initialContent: detail,
    forceNewLine: true,
    onHTMLChange: receiveHtmlAction,
    media: {
      allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
      image: true, // 开启图片插入功能
      video: true, // 开启视频插入功能
      audio: true, // 开启音频插入功能
      validateFn: validateFn, // 指定本地校验函数
      uploadFn: uploadFn, // 指定上传函数
      //        removeConfirmFn: null, // 指定删除前的确认函数
      //        onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
      //        onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
      //        onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
    },
  };
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="upload_text">选择图片</div>
    </div>
  );

  function disabledDate(current) {
    return current && current < moment().add(-1, 'd');
  }
  /* 明年的今天 */
  const nextYear = moment(new Date())
    .add(1, 'year')
    .format('YYYY-MM-DD');

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelAdd"
          onClick={cancelCreate}
        >
          取消
        </Button>,
        <Button
          disabled={createLoading || auditDisabled}
          key="confirmAdd"
          loading={createLoading}
          onClick={confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
      loading={createLoading}
      maskClosable={false}
      onCancel={cancelCreate}
      onClose={cancelCreate}
      title={modalTitle}
      visible={addGoodsVisible}
      width="520px"
      wrapClassName="vertical_center_modal_1"
    >
      <Form>
        <BlockTitle content="基础信息" />
        <FormItem {...formItemLayout}
          label="所属游乐园"
        >
          {getFieldDecorator('shopId', {
            initialValue:
              modalType !== '1'
                ? goodsInfo.shopId
                : window._init_data.shopList &&
                  window._init_data.shopList.length <= 1
                  ? window._init_data.shopList[0].shopId
                  : undefined,
            rules: [{ required: true, message: '请选择所属游乐园', },],
          })(
            <Select disabled={disabled}
              placeholder="请选择所属游乐园"
            >
              {!!window._init_data.shopList &&
                window._init_data.shopList.map((option, index) => (
                  <Option key={'shop_' + index}
                    value={option.shopId}
                  >
                    {option.name}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="会员卡"
        >
          {getFieldDecorator('vipCardId', {
            initialValue: goodsInfo.vipCardId,
            rules: [{ required: true, message: '请选择会员卡', },],
          })(
            <Select disabled={disabled}
              placeholder="请选择会员卡"
            >
              {!!memberCardList &&
                memberCardList.length > 0 &&
                memberCardList.map((option, index) => (
                  <Option
                    key={'shop_' + index}
                    value={option.id}
              
                  >
                    {option.name}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="商品名称"
        >
          {getFieldDecorator('goodsName', {
            initialValue: goodsInfo.goodsName,
            rules: [
              { required: true, message: '请输入商品名称', },
              { max: 50, message: '名称不得超过50字', },
            ],
          })(
            <Input
              disabled={auditDisabled}
              placeholder="请输入商品名称(限50字以内)"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="商品类型标签"
        >
          {getFieldDecorator('goodsType', {
            initialValue: goodsInfo.goodsType || '101',
            rules: [{ required: true, message: '请选择商品类型标签', },],
          })(
            <RadioGroup disabled={auditDisabled || toupType == '1'}>
              <Radio value="101">门票</Radio>
              <Radio value="102">消费卡</Radio>
              <Radio value="103">课程</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="售卖模式"
        >
          {getFieldDecorator('saleMode', {
            initialValue: goodsInfo.saleMode,
            rules: [{ required: true, message: '请选择售卖情况标签', },],
          })(
            <RadioGroup disabled={auditDisabled || toupType == '1'}>
              <Radio value="4">运营操作</Radio>
              <Radio value="5">自核销</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="限额是否受限"
        >
          {getFieldDecorator('limitedByVip', {
            initialValue: goodsInfo.limitedByVip || '1',
            rules: [{ required: true, message: '请选择是否受限', },],
          })(
            <RadioGroup disabled={auditDisabled || toupType == '1'}>
              <Radio value="0">否</Radio>
              <Radio value="1">是</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <div className="people_num">
          <FormItem {...formItemLayout}
            label="使用人数"
          >
            {getFieldDecorator('adultNum', {
              initialValue: goodsInfo.adultNum || 0,
              rules: [{ required: true, message: '请输入大人人数', },],
            })(<InputNumber disabled={auditDisabled || toupType == '1'}
              min={0}
              precision={0}
            />)}
          </FormItem>
          <span
            style={{
              position: 'absolute',
              top: 0,
              lineHeight: '28px',
              left: 170,
            }}
          >
            大人
          </span>
          <FormItem {...formItemLayout}
            className="goods_children_num"
          >
            {getFieldDecorator('childNum', {
              initialValue: goodsInfo.childNum || 0,
              rules: [{ required: true, message: '请输入小孩人数', },],
            })(<InputNumber disabled={auditDisabled || toupType == '1'}
              min={0}
              precision={0}
            />)}
          </FormItem>
          <span
            style={{
              position: 'absolute',
              top: 0,
              lineHeight: '28px',
              left: 252,
            }}
          >
            小孩
          </span>
        </div>

        <FormItem
          {...formItemLayout}
          help="推荐尺寸690*388, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="封面图"
        >
          {getFieldDecorator('cover', {
            initialValue: getfileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [{ type: 'array', required: true, message: '请上传封面图', },],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '封面图')}
              disabled={auditDisabled || toupType == '1'}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={handlePreview}
            >
              {getFieldValue('cover') && getFieldValue('cover').length >= 1
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
          <img alt="封面图"
            src={previewImage}
            style={{ width: '100%', }}
          />
        </Modal>

        <FormItem
          {...formItemLayout}
          className="upload_item"
          help="最多5张, 推荐尺寸750*666, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="轮播图"
        >
          {getFieldDecorator('imgs', {
            initialValue: slideFileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [{ type: 'array', required: true, message: '请上传轮播图', },],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '轮播图')}
              disabled={auditDisabled || toupType == '1'}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={bannerPreview}
            >
              {getFieldValue('imgs') && getFieldValue('imgs').length >= 5
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>
        <Modal
          footer={null}
          onCancel={bannerCancel}
          visible={bannerVisible}
          width="792px"
          wrapClassName="upload_modal"
        >
          <img alt="轮播图"
            src={bannerImage}
            style={{ width: '100%', }}
          />
        </Modal>

        <FormItem {...formItemLayout}
          label="原价"
        >
          {getFieldDecorator('price', {
            initialValue: goodsInfo.price,
            rules: [{ required: true, message: '请输入原价', },],
          })(
            <InputNumber
              className="all_input_number"
              disabled={auditDisabled || toupType == '1'}
              min={0.01}
              placeholder="请输入原价(大于0的数字，最多到小数点后2位)"
              precision={2}
              step={0.01}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="结算价"
        >
          {getFieldDecorator('settlePrice', {
            initialValue: goodsInfo.settlePrice,
            rules: [{ required: true, message: '请输入结算价', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              disabled={auditDisabled || toupType == '1'}
              min={0.01}
              precision={2}
              step={0.01}
            />
          )}
          <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
            请输入结算价(大于0的数字，最多到小数点后2位，不大于原价){' '}
          </span>
        </FormItem>
        <FormItem {...formItemLayout}
          label="保证金退款情况"
        >
          {getFieldDecorator('cancel', {
            initialValue: goodsInfo.cancel || '1',
            rules: [{ required: true, message: '请选择保证金退款情况', },],
          })(
            <RadioGroup disabled={auditDisabled || toupType == '1'}
              onChange={depositRefundChange}
            >
              <Radio style={{ lineHeight: '28px', }}
                value="1"
              />
              <div className={styles.refundTime}>
                <span>订单完成后&nbsp;</span>
                <FormItem style={{ display: 'inline-block', }}>
                  {getFieldDecorator('refundDay', {
                    initialValue: goodsInfo.refundDay || 2,
                    rules: [{ required: isRequire, message: '请输入工作日', },],
                  })(
                    <InputNumber
                      disabled={auditDisabled || toupType == '1'}
                      min={0}
                      precision={0}
                      step={1}
                      style={{ width: '50px', }}
                    />
                  )}
                  &nbsp;个工作日保证金退还用户
                </FormItem>
              </div>
              <div className={styles.refundRange}>
                <FormItem
                  style={{ display: 'inline-block', marginBottom: '0', }}
                >
                  {getFieldDecorator('lossRefundHour', {
                    initialValue:
                      goodsInfo.cancel == '1'
                        ? goodsInfo.refundRule && goodsInfo.refundRule[0].ltHour
                        : 0 || 48,
                    rules: [{ required: true, message: '请输入时间', },],
                  })(
                    <InputNumber
                      disabled={auditDisabled || toupType == '1'}
                      min={1}
                      precision={0}
                      step={1}
                      style={{ width: '50px', }}
                    />
                  )}
                  &nbsp;小时内，申请取消预约，扣除&nbsp;
                </FormItem>
                <FormItem
                  style={{ display: 'inline-block', marginBottom: '0', }}
                >
                  {getFieldDecorator('lossRate', {
                    initialValue:
                      goodsInfo.cancel == '1'
                        ? goodsInfo.refundRule &&
                          goodsInfo.refundRule[0].breachRate * 100
                        : 30 || 30,
                    rules: [{ required: !isRequire, message: '请输入保证金', },],
                  })(
                    <InputNumber
                      disabled={auditDisabled || toupType == '1'}
                      formatter={value => `${value}%`}
                      max={100}
                      min={1}
                      precision={0}
                      step={1}
                      style={{ width: '80px', }}
                    />
                  )}
                  &nbsp;保证金
                </FormItem>
              </div>
              <Radio style={{ lineHeight: '28px', }}
                value="0"
              />
              <div className={styles.refundTime}>
                <span>订单完成后&nbsp;</span>
                <FormItem
                  style={{ display: 'inline-block', marginBottom: '0', }}
                >
                  {getFieldDecorator('refundDayTwo', {
                    initialValue: goodsInfo.refundDayTwo || 2,
                    rules: [{ required: true, message: '请输入工作日', },],
                  })(
                    <InputNumber
                      disabled={auditDisabled || toupType == '1'}
                      min={0}
                      precision={0}
                      step={1}
                      style={{ width: '50px', }}
                    />
                  )}
                  &nbsp;个工作日保证金退还用户
                </FormItem>
              </div>
              <div style={{ marginLeft: '24px', }}>用户不可申请取消预约</div>
            </RadioGroup>
          )}
        </FormItem>
        <div className="count_num">
          <FormItem {...formItemLayout}
            label="单人预约限额"
          >
            {getFieldDecorator('appointNeedLimit', {
              initialValue: appointNeedLimit || '0',
              rules: [{ required: true, message: '请选择单人预约限额', },],
            })(
              <RadioGroup
                disabled={auditDisabled || toupType == '1'}
                onChange={singleOrderNumChange}
              >
                <Radio value="0">不限次数</Radio>
                <Radio value="1">次数</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {appointNeedLimit && appointNeedLimit == '1' ? (
            <FormItem {...formItemLayout}
              className="count_num_right_goods"
            >
              {getFieldDecorator('limitNum', {
                initialValue: goodsInfo.limitNum,
                rules: [{ required: true, message: '请输入次数', },],
              })(
                <InputNumber
                  disabled={auditDisabled || toupType == '1'}
                  min={1}
                  placeholder="请输入次数"
                  precision={0}
                  step={1}
                />
              )}
            </FormItem>
          ) : null}
        </div>
        <div className="count_num">
          <FormItem {...formItemLayout}
            label="商品总库存"
          >
            {getFieldDecorator('stockType', {
              initialValue: stockType || '0',
              rules: [{ required: true, message: '请选择库存类型', },],
            })(
              <RadioGroup disabled={auditDisabled || toupType == '1'}
                onChange={stockTypeChange}
              >
                <Radio value="0">不限库存</Radio>
                <Radio value="1">库存</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {stockType && stockType == '1' ? (
            <FormItem {...formItemLayout}
              className="count_num_right_goods"
            >
              {getFieldDecorator('stock', {
                initialValue: goodsInfo.stock,
                rules: [{ required: true, message: '请输入库存', },],
              })(
                <InputNumber
                  disabled={auditDisabled || toupType == '1'}
                  min={1}
                  onChange={stocksChange}
                  placeholder="请输入库存"
                  precision={0}
                  step={1}
                />
              )}
            </FormItem>
          ) : null}
        </div>
        <FormItem
          {...formItemLayout}
          className="grounding_time"
          label="预约有效期"
        >
          {getFieldDecorator('orderValiTime', {
            initialValue:
              !!goodsInfo.useStartTime || !!goodsInfo.useEndTime
                ? [
                  goodsInfo.useStartTime &&
                      moment(goodsInfo.useStartTime, 'YYYY-MM-DD'),
                  goodsInfo.useEndTime &&
                      moment(goodsInfo.useEndTime, 'YYYY-MM-DD'),
                ]
                : [
                  moment(new Date(), 'YYYY-MM-DD'),
                  moment(nextYear, 'YYYY-MM-DD'),
                ],
            rules: [{ required: true, message: '请选择预约有效期', },],
          })(
            <RangePicker
              disabled={auditDisabled || toupType == '1'}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
              onChange={orderValiTimeChange}
              placeholder={['请选择预约开始时间', '请选择预约结束时间',]}
            />
          )}
        </FormItem>
        <div className={styles.orderStock}>
          <FormItem {...formItemLayout_1}
            label="预约库存设置"
          >
            <Button disabled={toupType == '1'} onClick={calendarSetting}>日历表上设置</Button>
          </FormItem>
          <FormItem {...formItemLayout_1}
            label="目前已设置库存"
          >
            {getFieldDecorator('assignedStock', {
              initialValue: haveSetStock,
            })(<Input disabled
              style={{ width: '100px', }}
            />)}
          </FormItem>
        </div>
        <FormItem {...formItemLayout}
          label="是否需要身份证"
        >
          {getFieldDecorator('needIdCard', {
            initialValue: goodsInfo.needIdCard || '1',
            rules: [{ required: true, message: '请选择是否需要身份证', },],
          })(
            <RadioGroup disabled={auditDisabled || toupType == '1'}>
              <Radio value="0">不需要</Radio>
              <Radio value="1">需要</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="提前预约天数"
        >
          {getFieldDecorator('appointAdvanceDay', {
            initialValue: goodsInfo.appointAdvanceDay || 3,
            rules: [{ required: true, message: '请输入提前预约天数', },],
          })(
            <InputNumber
              className="all_input_number"
              disabled={auditDisabled || toupType == '1'}
              formatter={value => `${value}天`}
              min={0}
              placeholder="请输入提前预约天数(大于等于0的整数)"
              precision={0}
              style={{ width: '100px', }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="商品排序值"
        >
          {getFieldDecorator('sortOrder', {
            initialValue: goodsInfo.sortOrder || 0,
            rules: [{ required: true, message: '请输入商品排序值', },],
          })(
            <InputNumber
              className="all_input_number"
              disabled={auditDisabled || toupType == '1'}
              min={0}
              placeholder="请输入商品排序值(大于等于0的整数)"
              precision={0}
              style={{ width: '100px', }}
            />
          )}
        </FormItem>
        <BlockTitle content="预约说明" />
        {formItems}
        <Form.Item {...formItemLayout}>
          <Button
            disabled={noAdd}
            onClick={add}
            style={{ width: '60%', marginTop: '20px', }}
            type="primary"
          >
            <Icon type="plus" /> 新增预约说明（最多6个）
          </Button>
        </Form.Item>
        <div style={{border:'1px solid rgba(217,217,217,1)',borderRadius:'5px',padding:'10px 15px',margin:'10px 0'}}>
          <p>(商品需要用户提供更多附加信息时，填写这个模块)</p>
        <BlockTitle content="预约中其他信息" />
        <div className={styles.appointBlock}>
          <FormItem {...formItemLayout}
            className={styles.appointForm}
          >
            {getFieldDecorator('appointOtherChecked', {
              initialValue: defaultAppointCheckedArr,
            })(
              <Checkbox.Group
                className={styles.checkBox}
                disabled={auditDisabled}
                onChange={onAppointChange}
                options={appointOther}
              />
            )}
          </FormItem>
          {checkRightList}
        </div>
        {/* <FormItem {...formItemLayout}
          label="使用说明"
        >
          {getFieldDecorator('useNotice', {
            initialValue: transformArea(goodsInfo.useNotice),
            rules: [{ max: 2000, message: '字数不得超过2000', },],
          })(
            <TextArea
              disabled={auditDisabled}
              placeholder="请输入使用说明(字数不超过2000)"
              rows={4}
            />
          )}
        </FormItem> */}
        <BlockTitle content="预约提示信息"
          style={{ marginTop: '20px',}}
        />
        {promptFormItems}
        <Form.Item {...formItemLayout}>
          <Button
            disabled={noAddprompt}
            onClick={addPrompt}
            style={{ width: '60%', marginTop: '20px', }}
            type="primary"
          >
            <Icon type="plus" /> 新增预约提示（最多3个）
          </Button>
        </Form.Item>
        </div>
        <BlockTitle content="商品详情" />
        <FormItem wrapperCol={{ span: 24, }}>
          {getFieldDecorator('detail', {
            initialValue: detail,
          })(
            <div>
              <BraftEditor {...editorProps} />
            </div>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create({})(AddTicketComponent);
