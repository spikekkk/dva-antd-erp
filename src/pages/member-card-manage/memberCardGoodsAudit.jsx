/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Icon, } from 'antd';
import { AlertModal, } from '../../components/common/new-component/NewComponent';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
import AddGoodsModalComponent from '../../components/membercard-manage/memberGoods/addGoodsModalComponent';
import StockSettingModalComponent from '../../components/membercard-manage/memberGoods/stockSettingModalComponent';
import QrcodeModal from '../../components/common/qrcode/QrcodeModal';
import moment from 'moment';
const { TextArea, } = Input;
function hqSupercardGoods({ dispatch, hqSupercardGoodsAuditModel, }) {
  const {
    /*表格项*/
    loading,

    defaultAppointCheckedArr, //默认预约其他信息选中
    appointOther, //预约其他信息
    appointOtherList, //预约选中右侧数据项目
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    isEditRefund, //拒绝理由弹窗显示
    refuseReason, //拒绝理由
    refuseReasonRecord, // 拒绝理由所在列表的行信息
    isAgreeSure, //同意弹窗显示
    agreeRecord, // 同意所在列表的行信息
    /* 新增商品 */
    addGoodsVisible, // 新增显隐
    addGoodsLoading, // 新增loading
    stockType, //库存类型
    appointNeedLimit, //单人预约限额
    goodsInfo, // 商品信息
    modalType, //弹窗类型
    detail, //活动详情
    /* 库存设置 */
    stockSettingVisible, // 库存设置显隐
    orderTimeRange, //预约时间范围
    totalStock, // 总库存
    haveSetStock, //已设置库存
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    defaultDateStock, // 当天设置库存数
    /* 二维码显示 */
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址
  } = hqSupercardGoodsAuditModel;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  /*新增/编辑商品*/
  function addAndEditGoods(type, record) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/queryPlatGoodsAdditionalInfo',
      payload: {},
    });
    if (type == 'audit') {
      dispatch({
        type: 'hqSupercardGoodsAuditModel/getPlatGoods',
        payload: {
          id: record.spuId,
        },
      });
      dispatch({
        type: 'hqSupercardGoodsAuditModel/updateState',
        payload: {
          modalType: type,
        },
      });
    }
  }
  /* 关闭新增/编辑 */
  function addGoodsCancel() {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        addGoodsVisible: false,
        detail: '',
        defaultDateStock: 0,
        defaultAppointCheckedArr: [],
        appointOther: [],
        appointOtherList: [],
      },
    });
  }
  /* 库存改变 */
  function stockTypeChange(val) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        stockType: val.target.value,
      },
    });
  }
  /* 已设置的库存根据预约有效期的改变 */
  function orderValiTimeChange(val) {
    if (val && val.length <= 0) {
      dispatch({
        type: 'hqSupercardGoodsAuditModel/updateState',
        payload: {
          haveSetStock: 0,
          stockList: [],
        },
      });
    }
  }
  /*富文本改变*/
  function receiveHtml(html) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        detail: html,
      },
    });
  }
  /* 单人预约限额 */
  function singleOrderNumChange(val) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        appointNeedLimit: val.target.value,
      },
    });
  }
  /* 库存设置显隐 */
  function stockSettingFunc(val) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        stockSettingVisible: !stockSettingVisible,
        orderTimeRange: val,
        selectedDate: val[0],
      },
    });
    stockList &&
      stockList.map(item => {
        if (item.key == moment(val[0]).format('YYYY-MM-DD')) {
          dispatch({
            type: 'hqSupercardGoodsAuditModel/updateState',
            payload: {
              defaultDateStock: item.value,
            },
          });
        }
      });
  }
  /* 库存设置保存 */
  function stockSettingSave() {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        stockSettingVisible: false,
      },
    });
  }
  /* 库存列表改变 */
  function countChange(val, num) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        haveSetStock: num,
      },
    });
  }
  /* 日期选择改变 */
  function selectDateChange(date) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        selectedDate: date,
        defaultDateStock: 0,
      },
    });
  }
  /* 预约其他信息 */
  function onAppointChange(checkedValues) {
    const data = [];
    const tmp = Object.assign(appointOther, []);
    tmp.forEach(e => {
      checkedValues.forEach(i => {
        if (e.value == i) {
          data.push(e);
        }
      });
    });
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        appointOtherList: data,
      },
    });
  }
  //打开同意确认modal
  function openAgreeSure(record) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        isAgreeSure: true,
        agreeRecord: record,
      },
    });
  }
  /*关闭同意确认modal*/
  function cancelAgreeAlert() {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        isAgreeSure: false,
      },
    });
  }
  /*确认同意*/
  function confirmAgreeAlert() {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/auditPlatGoods',
      payload: {
        id: agreeRecord.spuId,
        auditStatus: '2',
      },
    });
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        isAgreeSure: false,
      },
    });
  }

  //打开拒绝理由modal
  function editSortOrder(record) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        isEditRefund: true,
        refuseReasonRecord: record,
        refuseReason: '',
      },
    });
  }
  /*关闭拒绝理由modal*/
  function cancelAlert() {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        isEditRefund: false,
        refuseReason: '',
      },
    });
  }
  /*获取输入的拒绝理由*/
  function getTextValue(e) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        refuseReason: e.target.value,
      },
    });
  }
  /*确认拒绝理由*/
  function confirmAlert() {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/auditPlatGoods',
      payload: {
        id: refuseReasonRecord.spuId,
        auditStatus: '9',
        refuseReason: refuseReason,
      },
    });
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        isEditRefund: false,
      },
    });
  }

  /*显示二维码*/
  function showQrcode(qrUrl, path) {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        codeVisible: true,
        qrUrl,
        path,
      },
    });
  }
  /*取消二维码显示*/
  function cancelQrcode() {
    dispatch({
      type: 'hqSupercardGoodsAuditModel/updateState',
      payload: {
        codeVisible: false,
      },
    });
  }

  /*表格属性*/
  const HqSupercardComponentProps = {
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'spuId',
      columns: [
        {
          dataIndex: 'spuId',
          key: 'spuId',
          title: '商品编号',
          width: '168px',
          render: (text, _record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'goodsName',
          key: 'goodsName',
          title: '名称',
          width: '96px',
          render: (text, record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              <a onClick={addAndEditGoods.bind(this, 'audit', record)}>
                {text}
              </a>
            </Popover>
          ),
        },
        {
          dataIndex: 'qrImg',
          key: 'qrImg',
          title: '二维码',
          width: '96px',
          render: (text, record) => (
            <div>
              {text ? (
                <Icon
                  className="table_qrcode"
                  onClick={showQrcode.bind(this, text, record.qrImg)}
                  type="qrcode"
                />
              ) : (
                ''
              )}
            </div>
          ),
        },
        {
          dataIndex: 'vipCardName',
          key: 'vipCardName',
          title: '所属会员卡',
          width: '96px',
          render: text => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'goodsTopType',
          key: 'goodsTopType',
          title: '类别',
          width: '96px',
          render: text => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text == '1'
                ? '门票'
                : text == '2'
                  ? '消费卡'
                  : text == '3'
                    ? '零售商品'
                    : text == '9'
                      ? '会员卡'
                      : ''}
            </Popover>
          ),
        },
        {
          dataIndex: 'goodsType',
          key: 'goodsType',
          title: '类别标签',
          width: '96px',
          render: (text, record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              <span>
                {text == 101
                  ? '门票'
                  : text == 102
                    ? '消费卡'
                    : text == 103
                      ? '课程'
                      : ''}
              </span>
            </Popover>
          ),
        },
        {
          dataIndex: 'saleMode',
          key: 'saleMode',
          title: '售卖模式',
          width: '96px',
          render: text => (
            <span>
              {text == '4' ? '运营操作' : text == '5' ? '自核销' : ''}
            </span>
          ),
        },
        {
          dataIndex: 'limitedByVip',
          key: 'limitedByVip',
          title: '限额是否受限',
          width: '116px',
          render: text => (
            <span>{text == '0' ? '否' : text == '1' ? '是' : ''}</span>
          ),
        },
        {
          dataIndex: 'shopName',
          key: 'shopName',
          title: '可用门店',
          width: '200px',
          render: text => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'deposit',
          key: 'deposit',
          title: '预约押金（原价）',
          width: '96px',
          render: text => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'appointNeedLimit',
          key: 'appointNeedLimit',
          title: '单人预约限制',
          width: '116px',
          render: (text, record) => (
            <Popover
              content={
                record.appointNeedLimit == '1'
                  ? record.subscribeLimit
                  : record.appointNeedLimit == '0'
                    ? '不限次数'
                    : ''
              }
              placement="top"
              trigger="hover"
            >
              {record.appointNeedLimit == '1'
                ? record.subscribeLimit
                : record.appointNeedLimit == '0'
                  ? '不限次数'
                  : ''}
            </Popover>
          ),
        },
        {
          dataIndex: 'stockType',
          key: 'stockType',
          title: '商品总库存',
          width: '116px',
          render: (text, record) => (
            <Popover
              content={
                record.stockType == '1'
                  ? record.stock
                  : record.stockType == '0'
                    ? '不限库存'
                    : ''
              }
              placement="top"
              trigger="hover"
            >
              {record.stockType == '1'
                ? record.stock
                : record.stockType == '0'
                  ? '不限库存'
                  : ''}
            </Popover>
          ),
        },
        {
          dataIndex: 'daySetNum',
          key: 'daySetNum',
          title: '今日设定量',
          width: '96px',
          render: text => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'createTime',
          key: 'createTime',
          title: '创建时间',
          width: '168px',
          render: text => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'operate',
          key: 'operate',
          title: '操作',
          width: '116px',
          render: (text, record) => (
            <div>
              {record.auditStatus == '2' ? (
                <div>审核已通过</div>
              ) : record.isCheckAudit == '9' ? (
                <div>审核已拒绝</div>
              ) : (
                <div>
                  <a onClick={openAgreeSure.bind(this, record, '2')}>同意</a>
                  <a
                    onClick={editSortOrder.bind(this, record, '9')}
                    style={{ marginLeft: '10px', }}
                  >
                    拒绝
                  </a>
                </div>
              )}
            </div>
          ),
        },
      ],
    },
    pagination: {
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: pageOnChange,
      onChange: pageOnChange,
    },
  };
  const addGoodsProps = {
    defaultAppointCheckedArr, //默认选中
    appointOtherList,
    appointOther,

    onAppointChange, //方法
    addGoodsVisible,
    cancelCreate: addGoodsCancel,
    createLoading: addGoodsLoading,
    stockType, //库存类型
    stockList, // 设置库存列表
    appointNeedLimit, //单人预约限额
    detail, //详情内容
    goodsInfo, // 商品信息
    modalType, //弹窗类型
    haveSetStock, //已设置库存
    stockTypeChange, //库存改变
    orderValiTimeChange, // 已设置的库存改变
    singleOrderNumChange, //单次预约限制人数
    receiveHtml, // 富文本改变
    stockSettingFunc, // 打开库存设置
  };
  /* 库存设置 */
  const stockSettingProps = {
    stockSettingVisible, // 库存设置显隐
    totalStock, // 总库存
    haveSetStock, //已设置库存
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    orderTimeRange, //预约时间范围
    defaultDateStock, // 当天设置库存数
    stockSettingFunc, // 打开关闭
    selectDateChange, // 时间更改
    countChange, // 数量更新
    stockSettingSave, //库存设置保存
    createLoading: addGoodsLoading,
    modalType, //弹窗类型
  };
  /* 拒绝理由弹窗内容 */
  const alertModalContent = (
    <div>
      <TextArea
        onChange={getTextValue}
        placeholder="请描述拒绝原因"
        rows={4}
        value={refuseReason}
      />
    </div>
  );
  const agreeModalContent = (
    <div style={{ lineHeight: '50px', fontSize: '16px', }}>
      请确认你看过内容详情
    </div>
  );
  /*二维码属性*/
  const QrcodeProps = {
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址

    cancelQrcode, //二维码取消
  };
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <HqSupercardComponent {...HqSupercardComponentProps} />
      {addGoodsVisible ? <AddGoodsModalComponent {...addGoodsProps} /> : null}
      {stockSettingVisible ? (
        <StockSettingModalComponent {...stockSettingProps} />
      ) : null}
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title="填写拒绝理由"
        visible={isEditRefund}
      />
      <AlertModal
        closable
        content={agreeModalContent}
        onCancel={cancelAgreeAlert}
        onOk={confirmAgreeAlert}
        title="同意申请"
        visible={isAgreeSure}
      />
      <QrcodeModal {...QrcodeProps} />
    </div>
  );
}

function mapStateToProps({ hqSupercardGoodsAuditModel, }) {
  return { hqSupercardGoodsAuditModel, };
}

export default connect(mapStateToProps)(hqSupercardGoods);
