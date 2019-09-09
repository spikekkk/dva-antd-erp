/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { message, Pagination, } from 'antd';
import SearchComponents from '../../components/common/new-component/manager-list/ManagerListSearch';
import MemberCardComponents from '../../components/membercard-manage/memberCardManage/memberCardManageComponent';
import AddVipCardComponents from '../../components/membercard-manage/memberCardManage/addVipCardModelComponent';
import StockSettingModelComponent from '../../components/membercard-manage/memberCardManage/vipCardTemplateModelComponent';
import StockAndAmountModal from '../../components/membercard-manage/memberCardManage/stockAndAmountModal';
import SingleStockSettingModalComponent from '../../components/membercard-manage/memberCardManage/stockSettingModalComponent';
import { AlertModal, } from '../../components/common/new-component/NewComponent';
function memberCardPage({ dispatch, memberCardModel, }) {
  const {
    /*搜索*/
    memberCardList,
    searchContent, //搜索内容
    /*分页项*/
    resultCount,
    pageIndex,
    pageSize,
    dataSource, //列表信息
    loading,
    /* 状态改变 */
    isUpdateStatus, //状态显隐
    updateRecord, // 状态改变的信息
    /* 会员卡创建/编辑 */
    vipCardInfo, // 会员卡信息
    addVipCardVisible, //新增/编辑会员卡显隐
    createLoading, // 创建loading
    myBannerVisible, //我的页面--卡片图
    myBannerImage, //我的页面-卡片图
    bannerVisible, //首页banner预览显示
    bannerImage, //首页banner预览图片
    previewVisible, //会员卡长图预览显示
    previewImage, //会员卡长图预览图片
    shareVisible, // 分享图片显示
    shareImage, // 分享图片预览
    modalType, //弹窗类型 0-新增 1-编辑
    updateCardRecord, //编辑获取当前信息
    /* 库存设置 */
    stockSettingVisible, //库存设置显隐
    holidays, //节假日[]
    holidayList, //节假日对象[]
    year, //年
    today, //当天
    isSetStockAndAmount, //设置库存和限额
    selectedDate, // 选中的日期
    cardItem, //点击查看获取该条详情
    dateSetList, // 批量查看设置
    stock, // 总库存
    amount, // 商品预约限额
    /* 单个日期设置 */
    singleStockSettingVisible, //单个日期设置
    singleSelectedDate, //选中的日期
    stockList, // 设置库存列表
    defaultDateStock, // 当天设置库存数
    defaultDateAmount, // 当天设置限额
  } = memberCardModel;
  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      createStartTime: !!values.createTime
        ? values.createTime[0].format('YYYY-MM-DD')
        : undefined,
      createEndTime: !!values.createTime
        ? values.createTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.createTime;
    for (const i in searchValue) {
      if (!searchValue[i]) {
        delete searchValue[i];
      }
    }
    dispatch({
      type: 'memberCardModel/queryPlatVipCard',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'memberCardModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  /*我的页面-卡页面预览显示*/
  function cardPreview(file){
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        cardVisible: true,
        cardImage: file.url || file.thumbUrl,
      },
    });
  }
  /*我的页面-卡页面取消预览*/
  function cardCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        cardVisible: false,
        cardImage: '',
      },
    });
  }
  /*会员卡首页banner预览显示*/
  function bannerPreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        bannerVisible: true,
        bannerImage: file.url || file.thumbUrl,
      },
    });
  }

  /*会员卡首页banner取消预览*/
  function bannerCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        bannerVisible: false,
        bannerImage: '',
      },
    });
  }

  /*会员卡首页banner预览显示*/
  function myBannerPreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        myBannerVisible: true,
        myBannerImage: file.url || file.thumbUrl,
      },
    });
  }

  /*会员卡首页banner取消预览*/
  function myBannerCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        myBannerVisible: false,
        myBannerImage: '',
      },
    });
  }
  /*会员卡长图预览显示*/
  function handlePreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        previewVisible: true,
        previewImage: file.url || file.thumbUrl,
      },
    });
  }
  /*会员卡长图取消预览*/
  function handleCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        previewVisible: false,
        previewImage: '',
      },
    });
  }
  /*分享图片预览显示*/
  function sharePreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        shareVisible: true,
        shareImage: file.url || file.thumbUrl,
      },
    });
  }
  /*分享图片取消预览*/
  function shareCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        shareVisible: false,
        shareImage: '',
      },
    });
  }

  /* 单个日期设置库存打开 */
  function singleDateStockSet(val) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleStockSettingVisible: true,
        singleSelectedDate: val,
      },
    });
    stockList &&
      stockList.map(item => {
        if (item.date == val.format('YYYY-MM-DD')) {
          dispatch({
            type: 'memberCardModel/updateState',
            payload: {
              defaultDateStock: item.stock,
              defaultDateAmount: item.amount,
            },
          });
        }
      });
  }
  /* 单个日期设置库存关闭 */
  function singleDateStockCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleStockSettingVisible: false,
        defaultDateStock: 0,
        defaultDateAmount: 0,
      },
    });
  }
  /* 单个日期库存设置保存 */
  function singleDateStockSetSave() {
    // console.log('stocklIST---', stockList);
    // const idx = stockList.findIndex(item => item.stock 0 && item.amount > 0);
    // console.log('idx----', idx);
    // if (idx != -1) {
    //   message.error('库存和限额不能小于0');
    //   return;
    // }
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleStockSettingVisible: false,
        defaultDateStock: 0,
        defaultDateAmount: 0,
      },
    });
  }
  /* 单个库存数量改变 */
  function countChange(val) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        defaultDateStock: val,
      },
    });
  }
  /* 单个限额数量改变 */
  function amountChange(val) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        defaultDateAmount: val,
      },
    });
  }
  /* 单个库存日期选择改变 */
  function selectDateChange(date) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleSelectedDate: date,
        defaultDateStock: -1,
        defaultDateAmount: -1,
      },
    });
  }
  /* 月份的切换 */
  function onPanelChangeAction(date) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleSelectedDate: date,
        defaultDateStock: 0,
        defaultDateAmount: 0,
      },
    });
  }

  /* 新增/编辑 */
  function addAndEditMemberCard(type, record) {
    dispatch({
      type: 'memberCardModel/queryPlatCardCategoryList',
      payload: {},
    });
    if (type == '1') {
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          addVipCardVisible: true,
          modalType: type,
          vipCardInfo: {},
        },
      });
    } else if (type == '2') {
      dispatch({
        type: 'memberCardModel/getVipCard',
        payload: {
          id: record.spuId,
        },
      });
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          addVipCardVisible: true,
          modalType: type,
          updateCardRecord: record,
        },
      });
    }
  }
  /* 关闭新增/编辑 */
  function addVipCardCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        addVipCardVisible: false,
        stockList: [],
      },
    });
  }
  /* 新增/编辑保存 */
  function addVipCardSave(values) {
    const newArr = stockList.filter(item => {
      if (item.stock >= 0 && item.amount >= 0) {
        return true;
      }
    });
    console.log('会员卡库存限制--stockList--', stockList);
    const val = {
      ...values,
      dateSetStock: JSON.stringify(newArr),
    };
    if (newArr && newArr.length <= 0) {
      message.error('请设置预约库存');
      return;
    }
    if (modalType == '1') {
      dispatch({
        type: 'memberCardModel/createPlatVipGoods',
        payload: {
          val,
        },
      });
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          stockList: [],
        },
      });
    } else if (modalType == '2') {
      dispatch({
        type: 'memberCardModel/updatePlatVipCard',
        payload: {
          val,
          id: updateCardRecord.spuId,
        },
      });
    }
  }
  /* 库存设置显隐 */
  function stockSettingFunc(item) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        stockSettingVisible: true,
        cardItem: item,
      },
    });
    dispatch({
      type: 'memberCardModel/queryVipCardDaySet',
      payload: {
        id: item.spuId,
      },
    });
  }
  /* 库存设置取消 */
  function stockSettingCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        stockSettingVisible: false,
        holidays: [],
      },
    });
  }
  /* 选中某个日期 */
  function selectDate(dateStr) {
    if (!!dateStr) {
      dispatch({
        type: 'memberCardModel/selectDate',
        payload: {
          dateStr: dateStr,
        },
      });
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          isSetStockAndAmount: true,
          selectedDate: dateStr,
          amount: 0,
          stock: 0,
        },
      });
      dateSetList &&
        dateSetList.map(item => {
          if (item.date == dateStr) {
            dispatch({
              type: 'memberCardModel/updateState',
              payload: {
                stock: item.stock,
                amount: item.amount,
              },
            });
          }
        });
    }
  }
  /* 上一年 */
  function beforeYear() {
    dispatch({
      type: 'memberCardModel/beforeYear',
      payload: {},
    });
  }
  /* 下一年 */
  function nextYear() {
    dispatch({
      type: 'memberCardModel/nextYear',
      payload: {},
    });
  }
  /* 设置库存和限额确认 */
  function setStockAndAmountConfirm(values) {
    const val = {
      ...values,
      selectedDate: selectedDate,
      spuId: cardItem.spuId,
    };
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isSetStockAndAmount: false,
      },
    });
  }
  /* 设置库存和限额关闭 */
  function setStockAndAmountCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isSetStockAndAmount: false,
      },
    });
  }

  //打开状态modal
  function updateStatusOpen(record) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isUpdateStatus: true,
        updateRecord: record,
      },
    });
  }
  /*关闭状态modal*/
  function updateStatusCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isUpdateStatus: false,
      },
    });
  }
  /* 下架确认改变状态 */
  function updateStatusConfirm() {
    dispatch({
      type: 'memberCardModel/updatePlatVipCardStatus',
      payload: {
        id: updateRecord.spuId,
        status: '0',
      },
    });
  }
  /* 上架 */
  function shelvesFunc(item) {
    dispatch({
      type: 'memberCardModel/updatePlatVipCardStatus',
      payload: {
        id: item.spuId,
        status: '1',
      },
    });
  }
  function downloadTemplate() {
    dispatch({
      type: 'memberCardModel/downloadTemplate',
      payload: {
        templateType: '1',
      },
    });
  }
  /* 上传文件 */
  function uploadChange(info) {
    if (
      info.file.status != 'uploading' &&
      info.file.response &&
      info.file.response.errorCode != 9000
    ) {
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status == 'done') {
      message.success('上传成功');
      dispatch({
        type: 'memberCardModel/queryVipCardDaySet',
        payload: {
          id: cardItem.spuId,
        },
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }
  /*新增商品*/
  const btns = [
    {
      label: '新建',
      handle: addAndEditMemberCard.bind(this, '1'),
    },
  ];
  /*搜索栏属性*/
  const searchComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'cardName', type: 'input', placeholder: '名称', },
        {
          key: 'status',
          type: 'select',
          placeholder: '状态',
          width: '100px',
          options: [{ label: '上架', key: '1', }, { label: '下架', key: '0', },],
        },
        {
          key: 'createTime',
          type: 'rangePicker',
          showTime: false,
          width: '220px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
        },
        {
          key: 'cardType',
          type: 'select',
          placeholder: '类型',
          opt_key: 'categoryId',
          opt_label: 'cardName',
          options: memberCardList,
        },
        // {
        //   key: 'uploadTime',
        //   type: 'rangePicker',
        //   showTime: false,
        //   width: '270px',
        //   format: 'YYYY-MM-DD',
        //   startPlaceholder: '上传模板开始时间',
        //   endPlaceholder: '上传模板结束时间',
        // },
      ],
    },
    rightBars: {
      btns: btns,
      isSuperSearch: false,
    },
  };
  /* 分页 */
  const pagination = {
    total: resultCount,
    pageIndex: pageIndex,
    pageSize: pageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: pageOnChange,
    onChange: pageOnChange,
  };
  /* 会员卡列表内容 */
  const memberCardManageProps = {
    dataSource, //列表信息
    loading,
    updateStatusOpen, //状态改变弹窗
    addAndEditMemberCard, //编辑
    stockSettingFunc, // 查看
    shelvesFunc, // 上架
    downloadTemplate, //下载模板
  };
  /* 会员卡创建/编辑 */
  const addMemberCardProps = {
    memberCardList, // 会员卡下拉列表
    vipCardInfo, // 会员卡信息
    addVipCardVisible, //新增/编辑会员卡显隐
    createLoading, // 创建loading
    myBannerVisible, //我的页面显隐
    myBannerImage, //我的页面-卡片图
    bannerVisible, //首页banner预览显示
    bannerImage, //首页banner预览图片
    previewVisible, //会员卡长图预览显示
    previewImage, //会员卡长图预览图片
    shareVisible, // 分享图片显示
    shareImage, // 分享图片预览
    modalType, //弹窗类型 0-新增 1-编辑
    stockList, // 设置库存列表
    cancelCreate: addVipCardCancel, //关闭弹窗
    addVipCardSave, // 新增编辑保存
    myBannerPreview, //我的页面客片图
    myBannerCancel, //我的页面显隐
    bannerPreview, //会员卡首页banner预览
    bannerCancel, //会员卡首页banner取消预览
    handlePreview, //会员卡长图预览
    handleCancel, //会员卡长图取消预览
    sharePreview, // 分享图片预览
    shareCancel, // 分享图片取消预览
    singleDateStockSet, // 单个日期设置库存显隐
  };
  /* 批量库存设置 */
  const stockSettingProps = {
    stockSettingVisible, //库存设置显隐
    stockSettingCancel, // 关闭
    // stockSettingSave, //库存设置保存
    holidays, //节假日[]
    holidayList, //节假日对象[]
    year, //年
    today,
    dateSetList, // 批量查看设置
    /* 方法 */
    selectDate, //选中某个日期
    beforeYear, // 上一年
    nextYear, // 下一年
    uploadChange, // 上传文件
  };
  /* 点击某个日期查看库存 */
  const stockAndAmountProp = {
    stock, // 总库存
    amount, // 商品预约限额
    isSetStockAndAmount, //设置库存和限额
    setStockAndAmountCancel, // 取消查看库存和限额
    setStockAndAmountConfirm, // 确认
    selectedDate, //选中的日期方法
  };
  /* 单个设置库存 */
  const singleDateStockSetProps = {
    singleStockSettingVisible, // 库存设置显隐
    stockList, // 设置库存列表
    singleSelectedDate, // 单个设置选中
    defaultDateStock, // 当天设置库存
    defaultDateAmount, // 当天设置限额
    countChange, // 单个库存量设置改变
    amountChange, // 单个限额设置改变
    singleDateStockCancel, // 单个日期设置关闭
    singleDateStockSetSave, //单个日期库存设置保存
    selectDateChange, //单个库存日期选择改变
    onPanelChangeAction,
  };
  /* 下架提示 */
  const alertModalContent = (
    <div style={{ lineHeight: '50px', }}>
      下架操作以后，此会员对应的权益商品便不在前端显示
    </div>
  );

  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <div style={{ position: 'relative', height: 'calc(100% - 42px)', }}>
        <SearchComponents {...searchComponentProps} />
        <MemberCardComponents {...memberCardManageProps} />
      </div>
      <div
        className="manager_list_pagination_box"
        style={{
          bottom: '49px',
          width: 'calc(100% - 170px)',
        }}
      >
        <div className="manager_list_pagination">
          <Pagination
            {...pagination}
            current={parseInt(pagination.pageIndex) + 1}
            pageSizeOptions={['20', '50', '100', '500', '1000',]}
            size="small"
          />
        </div>
      </div>
      {/* 新增会员卡 */}
      {addVipCardVisible ? (
        <AddVipCardComponents {...addMemberCardProps} />
      ) : (
        ''
      )}
      {/* 批量库存设置 */}
      {stockSettingVisible ? (
        <StockSettingModelComponent {...stockSettingProps} />
      ) : (
        ''
      )}
      {/* 单个日期库存设置 */}
      {singleStockSettingVisible ? (
        <SingleStockSettingModalComponent {...singleDateStockSetProps} />
      ) : (
        ''
      )}
      <AlertModal
        closable
        content={alertModalContent}
        footerCancel="点错了"
        footerEnsure="下架"
        onCancel={updateStatusCancel}
        onOk={updateStatusConfirm}
        title="状态"
        visible={isUpdateStatus}
      />
      <StockAndAmountModal {...stockAndAmountProp} />
    </div>
  );
}

function mapStateToProps({ memberCardModel, }) {
  return { memberCardModel, };
}

export default connect(mapStateToProps)(memberCardPage);
