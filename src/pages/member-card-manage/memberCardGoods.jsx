/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Checkbox, message, Icon, Popconfirm, Switch, Modal, Button} from 'antd';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
import {
  StatusFlag,
  AlertModal,
  ProgressBar,
} from '../../components/common/new-component/NewComponent';
import AddGoodsModalComponent from '../../components/membercard-manage/memberGoods/addGoodsModalComponent';
import StockSettingModalComponent from '../../components/membercard-manage/memberGoods/stockSettingModalComponent';
import QrcodeModal from '../../components/common/qrcode/QrcodeModal';
import NewArrivalComponent from '../../components/membercard-manage/memberCardManage/newArrivalComponent'
import moment from 'moment';
function hqSupercardGoods({ dispatch, hqSupercardGoodsModel, }) {
  const {
    /*搜索*/
    searchContent, //搜索内容
    /*表格项*/
    defaultAppointCheckedArr,//默认预约其他信息选中
    appointOther,//预约其他信息
    appointOtherList,//预约选中右侧数据项目
    loading,
    dataSource,
    defaultCheckedValue,
    newColumns,
    firstTable,
    resultCount,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
    /* 推荐排序值 */
    isEditTagSortOrder, //排序值弹窗显示
    sortTagOrderNum, //排序值
    saveTagRecord, // 排序值所在列表的行信息
    /* 商品排序值 */
    isEditSortOrder, //排序值弹窗显示
    sortOrderNum, //排序值
    saveRecord, // 排序值所在列表的行信息
    /* 新增商品 */
    addGoodsVisible, // 新增显隐
    addGoodsLoading, // 新增loading
    stockType, //库存类型
    appointNeedLimit, //单人预约限额
    goodsInfo, // 商品信息
    modalType, //弹窗类型
    toupType,
    detail, //活动详情
    updateRecord, // 编辑所在列表信息
    memberCardList, // 会员卡下拉列表
    isChangeTime, // 有效期限是否改变
    isChangeNum, // 是否更改数量
    /* 图片显示 */
    previewVisible, //封面图预览显示
    previewImage, //封面图预览图片
    bannerVisible, //轮播图预览显示
    bannerImage, //轮播图预览图片
    /* 库存设置 */
    stockSettingVisible, // 库存设置显隐
    orderTimeRange, //预约时间范围
    stock, // 总库存
    haveSetStock, //已设置库存
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    defaultDateStock, // 当天设置库存数
    /* 二维码显示 */
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址
    /* 预约日期提示 */
    isAdvanceOrder, //提前预约天数是否在扣除押金范围内
    allData, // 获取传递的总value
    isUpload, //上传弹窗
    showBar, //展示进度条
    fileError,
    /* 新品展示 */
    newArrivalVisible,
    newArrivalImage,
    newArrivalImageVisible,
    newArrivalId,
    errorMessage,
    errorVisible,
  } = hqSupercardGoodsModel;

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
      type: 'hqSupercardGoodsModel/queryAuditGoods',
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
      type: 'hqSupercardGoodsModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  /*新增/编辑商品*/
  function addAndEditGoods(type, record) {
    dispatch({
      type: 'hqSupercardGoodsModel/queryPlatGoodsAdditionalInfo',
      payload: {

      },
    });
    if (type == '1') {
      if (!isChangeTime) {
        const idx = stockList.findIndex(
          item => item.key === moment(selectedDate).format('YYYY-MM-DD')
        );
        if (idx == -1) {
          stockList.push({
            key: moment(new Date()).format('YYYY-MM-DD'),
            value: 1,
          });
        }
      }
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          addGoodsVisible: true,
          modalType: type,
          stockType: '0',
          appointNeedLimit: '0',
          goodsInfo: {},
          haveSetStock: 1,
        },
      });
    } else if (type == '2' || type=='3') {
      dispatch({
        type: 'hqSupercardGoodsModel/getPlatGoods',
        payload: {
          id: type=='3'?record:record.spuId,
        },
      });
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          modalType: type,
          updateRecord: record,
          isChangeTime: true,
        },
      });
    }
    if(type == '2' && record.newGoods == '4'){//上新状态
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          toupType:'1'
        },
      });
    }else{
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          toupType:'0'
        },
      });
    }
  }
  /* 新增 / 编辑 保存 - 1 */
  function addAndEditSave(values) {
    const newArr = stockList.filter(item => {
    
      if (item.value > -1) {
       
        return true;
      }
    });
    const arr = JSON.parse(JSON.stringify(newArr));
    arr &&
      arr.map(item => {
        item.date = item.key;
        item.setNum = item.value;
        delete item.value;
        delete item.key;
      });
    const val = {
      ...values,
      daySetStock: JSON.stringify(arr),
    };
    if (arr && arr.length <= 0) {
      message.error('请设置预约库存');
      return;
    }
    if (modalType == '1') {
      dispatch({
        type: 'hqSupercardGoodsModel/createPlatGoods',
        payload: {
          val,
        },
      });
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          detail: '',
          defaultDateStock: -1,
          // stockList: [],
          isChangeTime: false,
          isChangeNum: false,
        },
      });
    } else {
      dispatch({
        type: 'hqSupercardGoodsModel/updatePlatGoods',
        payload: {
          val,
          id: updateRecord.spuId,
        },
      });
    }
  }
  /*新增/编辑保存 判断预约提醒是否显示 - 2*/
  function confirmCreate(values) {
    if (
      values.cancel == '1' &&
      Number(values.lossRefundHour) / 24 >= Number(values.appointAdvanceDay)
    ) {
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          isAdvanceOrder: true,
          allData: values,
        },
      });
    } else {
      addAndEditSave(values);
    }
  }
  /* 新增 / 编辑 校验库存设置保存 */
  function addGoodsSave(values) {
    if (stockType == '0') {
      confirmCreate(values);
    } else {
      if (Number(stock) >= Number(haveSetStock)) {
        confirmCreate(values);
      } else {
        message.error('设置库存不能大于总库存');
      }
    }
  }
  /* 关闭新增/编辑 */
  function addGoodsCancel() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        addGoodsVisible: false,
        detail: '',
        defaultDateStock: -1,
        haveSetStock: 0,
        stockList: [],
        defaultAppointCheckedArr: [],
        appointOther: [],
        appointOtherList:[],
        isChangeTime: false,
        isChangeNum: false,
      },
    });
  }
  /* 库存改变 */
  function stockTypeChange(val) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        stockType: val.target.value,
      },
    });
  }
  /* 已设置的库存根据预约有效期的改变 */
  function orderValiTimeChange(val) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        // haveSetStock: 0,
        // stockList: [],
        defaultDateStock: -1,
        isChangeTime: true,
      },
    });
  }
  /*富文本改变*/
  function receiveHtml(html) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        detail: html,
      },
    });
  }
  /* 单人预约限额 */
  function singleOrderNumChange(val) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        appointNeedLimit: val.target.value,
      },
    });
  }


  /* 预约其他信息 */
  function onAppointChange(checkedValues) {
    const data=[];
    const tmp=Object.assign(appointOther,[]);
    tmp.forEach(e=>{
      checkedValues.forEach(i=>{
        if(e.value==i){
          data.push(e)   
        }
      });

    });
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        appointOtherList: data,
      },
    });
  }

  /* 库存总数设置 */
  function stocksChange(val) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        stock: val,
      },
    });
  }
  /* 库存设置显隐 */
  function stockSettingFunc(val) {
    if (!isChangeTime) {
      if (!isChangeNum) {
        dispatch({
          type: 'hqSupercardGoodsModel/updateState',
          payload: {
            stockList: [],
          },
        });
        const arr = [];
        const idx = arr.findIndex(
          item => item.key === moment(selectedDate).format('YYYY-MM-DD')
        );
        if (idx == -1) {
          arr.push({
            key: moment(val[0]).format('YYYY-MM-DD'),
            value: 1,
          });
        }
        dispatch({
          type: 'hqSupercardGoodsModel/updateState',
          payload: {
            stockList: arr,
          },
        });
      }
    }
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
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
            type: 'hqSupercardGoodsModel/updateState',
            payload: {
              defaultDateStock: item.value,
            },
          });
        }
      });
  }
  /* 库存设置保存 */
  function stockSettingSave() {
    if (stockType == '0') {
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          stockSettingVisible: false,
        },
      });
    } else if (stockType == '1') {
      if (Number(stock) >= Number(haveSetStock)) {
        dispatch({
          type: 'hqSupercardGoodsModel/updateState',
          payload: {
            stockSettingVisible: false,
          },
        });
      } else {
        message.error('设置的库存不能大于总库存');
      }
    }
  }

  /* 库存列表改变 */
  function countChange(val, num) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        haveSetStock: num,
        isChangeNum: true,
      },
    });
  }

  //修改推荐排序值
  function editTagSortOrder(record) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        isEditTagSortOrder: true,
        saveTagRecord: record,
        sortTagOrderNum: record.tagSortOrder,
      },
    });
  }
  /*取消修改推荐排序值*/
  function cancelTagAlert() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        isEditTagSortOrder: false,
        sortTagOrderNum: '',
      },
    });
  }
  /*获取输入的推荐排序值*/
  function getTagValue(e) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        sortTagOrderNum: e.target.value,
      },
    });
  }
  /*确认推荐排序值*/
  function confirmTagAlert() {
    if (Number(sortTagOrderNum) > 0) {
      dispatch({
        type: 'hqSupercardGoodsModel/setPlatTagSortOrder',
        payload: {
          spuId: saveTagRecord.spuId,
          sortOrder: sortTagOrderNum,
        },
      });
    } else {
      message.error('推荐排序值不能小于0');
    }
  }

  //修改商品排序值
  function editSortOrder(record) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        isEditSortOrder: true,
        saveRecord: record,
        sortOrderNum: record.sortOrder,
      },
    });
  }
  /*取消修改商品排序值*/
  function cancelAlert() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        isEditSortOrder: false,
        sortOrderNum: '',
      },
    });
  }
  /*获取输入的商品排序值*/
  function getTextValue(e) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        sortOrderNum: e.target.value,
      },
    });
  }
  /*确认商品排序值*/
  function confirmAlert() {
    if (Number(sortOrderNum) > 0) {
      dispatch({
        type: 'hqSupercardGoodsModel/setPlatGoodsSortOrder',
        payload: {
          id: saveRecord.spuId,
          sortOrder: sortOrderNum,
        },
      });
    } else {
      message.error('商品排序值不能小于0');
    }
  }

  /* 库存日期选择改变 */
  function selectDateChange(date) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        selectedDate: date,
        defaultDateStock: -1,
      },
    });
  }
  /* 库存月份改变 */
  function onPanelChangeAction(date) {
    if (orderTimeRange && orderTimeRange.length > 0) {
      if (moment(date).isAfter(orderTimeRange[1])) {
        dispatch({
          type: 'hqSupercardGoodsModel/updateState',
          payload: {
            selectedDate: orderTimeRange[1],
            defaultDateStock: -1,
          },
        });
        stockList &&
          stockList.map(item => {
            if (item.key == orderTimeRange[1].format('YYYY-MM-DD')) {
              dispatch({
                type: 'hqSupercardGoodsModel/updateState',
                payload: {
                  defaultDateStock: item.value,
                },
              });
            }
          });
      } else if (moment(date).isBefore(orderTimeRange[0])) {
        dispatch({
          type: 'hqSupercardGoodsModel/updateState',
          payload: {
            selectedDate: orderTimeRange[0],
            defaultDateStock: -1,
          },
        });
        stockList &&
          stockList.map(item => {
            if (item.key == orderTimeRange[0].format('YYYY-MM-DD')) {
              dispatch({
                type: 'hqSupercardGoodsModel/updateState',
                payload: {
                  defaultDateStock: item.value,
                },
              });
            }
          });
      } else {
        dispatch({
          type: 'hqSupercardGoodsModel/updateState',
          payload: {
            selectedDate: date,
            defaultDateStock:-1,
          },
        });
      }
    }
  }
  /* 是否勾选推荐 */
  function checkChange(val, record) {
    dataSource &&
      dataSource.map(item => {
        if (item.spuId == record.spuId) {
          if (item.recommend == '') {
            item.recommend = '2';
          } else {
            item.recommend = '';
          }
        }
      });
    let tag = '0';
    if (val) {
      tag = '1';
    } else {
      tag = '0';
    }
    dispatch({
      type: 'hqSupercardGoodsModel/setPlatGoodsTag',
      payload: {
        id: record.spuId,
        tag: tag,
      },
    });
    // dispatch({
    //   type: 'hqSupercardGoodsModel/updateState',
    //   payload: {
    //     dataSource,
    //   },
    // });
  }
  /* 提交审核 */
  function handleAudit(record) {
    dispatch({
      type: 'hqSupercardGoodsModel/submitPlatGoodsAudit',
      payload: {
        id: record.spuId,
      },
    });
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        dataSource,
      },
    });
  }
  /* 更新上下架 */
  function updateStatus(record, status) {
    dispatch({
      type: 'hqSupercardGoodsModel/updatePlatGoodsStatus',
      payload: {
        ids: record.spuId,
        status: status,
     },
    });
  }
  /* 删除商品 */
  function deleteGoods(type, record) {
    if (type == '1') {
      dispatch({
        type: 'hqSupercardGoodsModel/deletePlatGoods',
        payload: {
          ids: record.spuId,
        },
      });
    } else if (type == '0') {
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        dispatch({
          type: 'hqSupercardGoodsModel/deletePlatGoods',
          payload: {
            ids: selectedRowKeys.join(','),
          },
        });
      } else {
        message.error('请选择删除项');
      }
    }
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        selectedRowKeys: [],
        selectedRows: [],
        dataSource,
      },
    });
  }
  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    console.log('选择的表格行---',selectedRowKeys, selectedRows)
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }
  /* 复选框内容 */
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: rowSelectChange,
  };
  /*批量删除*/
  const upStatus = () => {
    const statusBtns = [];
    statusBtns.push({
      label: '删除',
      handle: deleteGoods.bind(null, '0'),
      confirm: true,
    },selectedRows.length==1?{
      label: '复制',
      handle: addAndEditGoods.bind(this, '3',selectedRowKeys[0]),
      confirm: true,
    }:'');
    return statusBtns;
  };

  /*显示二维码*/
  function showQrcode(qrUrl, path) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
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
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        codeVisible: false,
      },
    });
  }

  /*新品展示图预览显示*/
  function newArrivalPreview(file) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        newArrivalImageVisible: true,
        newArrivalImage: file.url || file.thumbUrl,
      },
    });
  }

  /*新品展示图取消预览*/
  function newArrivalCancel() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        newArrivalImageVisible: false,
        newArrivalImage: '',
      },
    });
  }

  /*封面预览显示*/
  function handlePreview(file) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        previewVisible: true,
        previewImage: file.url || file.thumbUrl,
      },
    });
  }

  /*封面取消预览*/
  function handleCancel() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        previewVisible: false,
        previewImage: '',
      },
    });
  }

  /*轮播预览显示*/
  function bannerPreview(file) {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        bannerVisible: true,
        bannerImage: file.url || file.thumbUrl,
      },
    });
  }

  /*轮播取消预览*/
  function bannerCancel() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        bannerVisible: false,
        bannerImage: '',
      },
    });
  }
  /* 取消预约提醒 */
  function cancelOrderAlert() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        isAdvanceOrder: false,
      },
    });
  }
  /* 确认预约提醒 */
  function confirmOrderAlert() {
    if (stockType == '0') {
      addAndEditSave(allData);
    } else {
      if (Number(stock) >= Number(haveSetStock)) {
        addAndEditSave(allData);
      } else {
        message.error('设置库存不能大于总库存');
      }
    }
  }
  /* 导入 */
  function importFileFunc(info) {
   
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        isUpload: true,
        showBar: true,
      },
    });
    if (
      info.file.status != 'uploading' &&
      info.file.response &&
      info.file.response.errorCode != 9000
    ) {
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          showBar: false,
          fileError: true,
        },
      });
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status == 'done') {
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          showBar: false,
          fileError: false,
        },
      });
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          showBar: false,
          fileError: true,
        },
      });
      message.error(`${info.file.name} 上传失败`);
    }
  }
  //关闭导入弹窗
  function confirmUploadAlert() {
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        isUpload: false,
        showBar: false,
      },
    });
  }
  /* 下载模板 */
  function downloadTemplate() {
    dispatch({
      type: 'hqSupercardGoodsModel/downloadTemplate',
      payload: {
        templateType: '2',
      },
    });
  }

  //新品展示Modal显示/隐藏
  function showNewArrivalModalFn(record){
    if(!record.newGoods){
      dispatch({
        type: 'hqSupercardGoodsModel/updateState',
        payload: {
          newArrivalVisible: true,
          newArrivalId:record.spuId,
        },
      })
    }else{
      dispatch({
        type: 'hqSupercardGoodsModel/setNewPlatGoods',
        payload: {
          id:record.spuId,
          img:'',
          status:'0'
        },
      });
    }
  }

  //执行上新操作
  function setNewPlatGoods(img) {
    dispatch({
      type: 'hqSupercardGoodsModel/setNewPlatGoods',
      payload: {
        id:newArrivalId,
        img,
        status:'1'
      },
    });
  }

  function hideNewArrivalModalFn(){
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        newArrivalVisible: false,
      },
    })
  }

  function errorFn(){
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        errorVisible: false,
        errorMessage: '',
        newArrivalVisible:false,
      },
    })
  }

  const newArrivalProps={
    newArrivalVisible,
    newArrivalImage,
    newArrivalImageVisible,
    hideNewArrivalModalFn,
    newArrivalPreview,
    newArrivalCancel,
    setNewPlatGoods,
  }

  const tableColumns=[
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
          <a onClick={addAndEditGoods.bind(this, '2', record)}>{text}</a>
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
      width: '100px',
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
        <div>
          {text == '1'
            ? '门票'
            : text == '2'
              ? '消费卡'
              : text == '3'
                ? '零售商品'
                : text == '9'
                  ? '会员卡'
                  : ''}
        </div>
      ),
    },
    {
      dataIndex: 'goodsType',
      key: 'goodsType',
      title: '类别标签',
      width: '96px',
      render: (text, record) => (
        <Popover
          content={
            text == '101'
              ? '门票'
              : text == '102'
                ? '消费卡'
                : text == '103'
                  ? '课程'
                  : ''
          }
          placement="top"
          trigger="hover"
        >
          <span>
            {text == '101'
              ? '门票'
              : text == '102'
                ? '消费卡'
                : text == '103'
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
        <span>
          {text == '0' ? '否' : text == '1' ? '是' : ''}
        </span>
      ),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: '状态',
      width: '96px',
      render: text => (
        <div>
          {text == '1' ? (
            <StatusFlag type="green">上架</StatusFlag>
          ) : text == '0' ? (
            <StatusFlag type="red">下架</StatusFlag>
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      dataIndex: 'recommend',
      key: 'recommend',
      title: '推荐',
      width: '100px',
      render: (text, record) => (
        <Checkbox
          checked={text == '' ? false : text == '2' ? true : ''}
          disabled={record.status == '0' ? true : false}
          key={'goods_' + record.goodsId}
          onChange={e => checkChange(e.target.checked, record)}
        />
      ),
    },
    {
      dataIndex: 'tagSortOrder',
      key: 'tagSortOrder',
      title: '推荐排序值',
      width: '96px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {record.recommend == '2' && record.status == '1' ? (
            <a onClick={editTagSortOrder.bind(this, record)}>{text}</a>
          ) : (
            ''
          )}
        </Popover>
      ),
    },
    {
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      title: '商品排序值',
      width: '96px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a onClick={editSortOrder.bind(this, record)}>{text}</a>
        </Popover>
      ),
    },
    {
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      title: '审核状态',
      width: '106px',
      render: text => (
        <div>
          {text == '1' ? (
            <StatusFlag type="light_blue">待审核</StatusFlag>
          ) : text == '0' ? (
            <StatusFlag type="red">待提交审核</StatusFlag>
          ) : text == '2' ? (
            <StatusFlag type="green">审核通过</StatusFlag>
          ) : text == '9' ? (
            <StatusFlag type="deep_red">审核拒绝</StatusFlag>
          ) : (
            ''
          )}
        </div>
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
      width: '136px',
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
      width: '106px',
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
      width: '96px',
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
      dataIndex: 'totalNum',
      key: 'totalNum',
      title: '商品总使用量',
      width: '106px',
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
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      width: '96px',
      render: (text, record) => (
        <div>
          {record.status == '1' ? (
            <a onClick={updateStatus.bind(this, record, '0')}>下架</a>
          ) : (
            <a onClick={updateStatus.bind(this, record, '1')}>上架</a>
          )}
          <Popconfirm
            cancelText="取消"
            icon={
              <Icon style={{ color: 'red', }}
                type="exclamation-circle"
              />
            }
            okText="确定"
            onConfirm={deleteGoods.bind(this, '1', record)}
            title="确定要删除吗?"
          >
            <a style={{ marginLeft: '10px', }}>删除</a>
          </Popconfirm>
        </div>
      ),
    },
    {
      dataIndex: 'newGoods',
      key: 'newGoods',
      title: '上新',
      width: '96px',
      render: (text, record) => (
        <div>
          <Switch onChange={showNewArrivalModalFn.bind(this,record)} checked={text == '4'}></Switch>
        </div>
      ),
    },
    {
      dataIndex: 'options',
      key: 'options',
      title: '审核操作',
      width: '96px',
      render: (text, record) =>
        record.auditStatus == '0' ? (
          <a onClick={handleAudit.bind(this, record)}>提交审核</a>
        ) : (
          '已提交审核'
        ),
    },
    {
      dataIndex: 'refuseReason',
      key: 'refuseReason',
      title: '拒绝理由',
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
  ];

    /*改变表格显示项*/
  function changeColumns(checkedValues) {
    const data = [];
    let checkedArr = null;
    if (checkedValues) {
      checkedArr = checkedValues;
    } else {
      checkedArr = defaultCheckedValue;
    }
    tableColumns.forEach((r, index) => {
      checkedArr.forEach(rs => {
        if (r.key == rs) {
          data.push(r);
        }
      });
    });
    dispatch({
      type: 'hqSupercardGoodsModel/updateState',
      payload: {
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
      },
    });
  }
  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: 'hqSupercardGoodsModel/tableColumnSave',
      payload: {},
    });
  }

  const uploadProps = {
    name: 'file',
    action: `${
      window.BASE_URL
    }/manage/plat/goods/equity/importGoodsDateSetAppoint`,
    accept: '.xlsx' || '.xls',
    showUploadList: false,
    onChange: info => importFileFunc(info),
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };

  /*新增商品*/
  const btns = [
    {
      label: '导入',
      type: 'import',
      className: 'uploadBtn',
      uploadProps: uploadProps,
    },
    {
      label: '下载模板',
      handle: downloadTemplate.bind(this),
    },
    {
      label: '创建商品',
      handle: addAndEditGoods.bind(this, '1'),
    },
  ];
  /*表格属性*/
  const HqSupercardComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'goodsName', type: 'input', placeholder: '商品名称', },
        {
          key: 'goodsType',
          type: 'select',
          placeholder: '商品类型',
          options: [
            { label: '门票', key: '101', },
            { label: '消费卡', key: '102', },
            { label: '课程', key: '103', },
          ],
        },
        {
          key: 'auditStatus',
          type: 'select',
          placeholder: '审核状态',
          options: [
            { label: '待提交审核', key: '0', },
            { label: '审核通过', key: '2', },
            { label: '审核拒绝', key: '9', },
          ],
        },
        {
          key: 'saleMode',
          type: 'select',
          placeholder: '售卖模式',
          options: [
            { label: '运营操作', key: '4', },
            { label: '自核销', key: '5', },
          ],
        },
        {
          key: 'status',
          type: 'select',
          placeholder: '商品状态',
          options: [{ label: '上架', key: '1', }, { label: '下架', key: '0', },],
        },
        {
          key: 'vipCardId',
          type: 'select',
          placeholder: '所属会员卡',
          opt_key: 'id',
          opt_label: 'name',
          options: memberCardList,
        },
        {
          key: 'createTime',
          type: 'rangePicker',
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
        },
      ],
    },
    rightBars: {
      btns: btns,
      isSuperSearch: false,
    },
    table: {
      yScroll: '690px',
      xScroll: '1000px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      haveSet:true,
      firstTable: firstTable,
      defaultCheckedValue: defaultCheckedValue,
      changeColumns: changeColumns,
      saveColumns: saveColumns,
      rowKey: 'spuId',
      columns: tableColumns,
      rowSelection: rowSelection,
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
    leftBars: {
      label: '已选',
      labelNum: selectedRowKeys.length,
      btns: upStatus(),
    },
  };
  /* 推荐排序值 */
  const alertModalTagContent = (
    <div>
      <Input
        onChange={getTagValue}
        placeholder="请输入排序值"
        type="Number"
        value={sortTagOrderNum}
      />
    </div>
  );
  /* 商品排序值 */
  const alertModalContent = (
    <div>
      <Input
        onChange={getTextValue}
        placeholder="请输入排序值"
        type="Number"
        value={sortOrderNum}
      />
    </div>
  );
  /* 预约日期提醒 */
  const orderAlertContent = (
    <div style={{ fontSize: '16px', }}>
      “提前{allData.appointAdvanceDay || 0}
      天预约”规则设置，可能造成用户取消预约时，扣除
      {allData.lossRate * 100 || 100}%保证金，确定？
    </div>
  );

  const uploadAlertContent = (
    <div style={{ fontSize: '16px', }}>
      {showBar ? (
        <ProgressBar content="正在上传"
          type="fixed"
        />
      ) : (
        <div>
          <h2>{fileError ? '失败上传' : '上传成功'}</h2>
        </div>
      )}
    </div>
  );
  /*二维码属性*/
  const QrcodeProps = {
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址

    cancelQrcode, //二维码取消
  };
  const addGoodsProps = {
    defaultAppointCheckedArr,//默认选中
    appointOtherList,
    appointOther,
    onAppointChange,//预约其他信息选中方法
    addGoodsVisible,
    cancelCreate: addGoodsCancel,
    createLoading: addGoodsLoading,
    stockType, //库存类型
    stockList, // 设置库存列表
    appointNeedLimit, //单人预约限额
    detail, //详情内容
    goodsInfo, // 商品信息
    modalType, //弹窗类型
    toupType,
    haveSetStock, //已设置库存
    stockTypeChange, //库存改变
    orderValiTimeChange, // 已设置的库存改变
    singleOrderNumChange, //单次预约限制人数
    receiveHtml, // 富文本改变
    stockSettingFunc, // 打开库存设置
    addGoodsSave, // 确定
    stocksChange, //总库存数量
    memberCardList, // 会员卡下拉列表
    selectedDate, //选中的日期
    /* 图片显示 */
    previewVisible, //封面图预览显示
    previewImage, //封面图预览图片
    bannerVisible, //轮播图预览显示
    bannerImage, //轮播图预览图片
    handlePreview, //封面预览
    handleCancel, //封面取消预览
    bannerPreview, //轮播预览
    bannerCancel, //轮播取消预览
  };
  /* 库存设置 */
  const stockSettingProps = {
    stockSettingVisible, // 库存设置显隐
    stock, // 总库存
    goodsInfo, //库存数量信息
    stockType, //库存类型
    haveSetStock, //已设置库存
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    orderTimeRange, //预约时间范围
    defaultDateStock, // 当天设置库存数
    stockSettingFunc, // 打开关闭
    selectDateChange, // 时间更改
    countChange, // 数量更新
    onPanelChangeAction, // 月份切换
    stockSettingSave, //库存设置保存
    createLoading: addGoodsLoading,
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
        content={alertModalTagContent}
        onCancel={cancelTagAlert}
        onOk={confirmTagAlert}
        title="修改排序值"
        visible={isEditTagSortOrder}
      />
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title="修改排序值"
        visible={isEditSortOrder}
      />
      <AlertModal
        closable
        content={orderAlertContent}
        onCancel={cancelOrderAlert}
        onOk={confirmOrderAlert}
        title="预约提醒"
        visible={isAdvanceOrder}
      />
      <AlertModal
        btnVisible="true"
        buttonLoading={showBar}
        closable
        content={uploadAlertContent}
        footerCancel="关闭弹窗"
        onCancel={confirmUploadAlert}
        onOk={confirmUploadAlert}
        title="文件上传"
        visible={isUpload}
        width="700px"
      />

      <QrcodeModal {...QrcodeProps} />

      <NewArrivalComponent {...newArrivalProps} />

      <Modal
        title={'提示'}
        visible={errorVisible}
        footer={
          [
            <Button type='primary' onClick={errorFn}>确定</Button>
          ]
        }
      >
        <p style={{textAlign:'center',color:'#000',fontSize:'16px'}}>{errorMessage}</p>
        {/* <p style={{textAlign:'center',color:'#000',fontSize:'16px'}}>请把其他商品从”上新“设置扯下来，再设置新的商品</p> */}
      </Modal>
    </div>
  );
}

function mapStateToProps({ hqSupercardGoodsModel, }) {
  return { hqSupercardGoodsModel, };
}

export default connect(mapStateToProps)(hqSupercardGoods);
