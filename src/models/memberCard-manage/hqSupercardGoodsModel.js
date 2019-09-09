/* eslint-disable no-unused-vars */
import {
  queryAuditGoods,
  createPlatGoods,
  updatePlatGoods,
  getPlatGoods,
  setPlatGoodsSortOrder,
  updatePlatGoodsStatus,
  deletePlatGoods,
  submitPlatGoodsAudit,
  setPlatGoodsTag,
  setPlatTagSortOrder,
  queryPlatVipCardList,
  queryPlatGoodsAdditionalInfo,
  setNewPlatGoods,
} from '../../services/member-card-manage/hqSupercardGoodsService';

import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';
import { downloadTemplate, } from '../../services/member-card-manage/memberCardManageService';
import { message, } from 'antd';
import moment from 'moment';
import { exportFile, } from '../../utils/exportFile';
export default {
  namespace: 'hqSupercardGoodsModel',

  state: {
    /*搜索*/

    searchContent: {}, //搜索内容
    /*表格项*/

    appointOther: [], //预约其他想选
    defaultAppointCheckedArr: [], //默认预约其他信息选中
    appointOtherList: [], //预约选中右侧数据项目
    loading: false,
    defaultCheckedValue: [], //默认选中的checked
    firstTable: false, //第一次请求
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    selectedRowKeys: [],
    selectedRows: [],
    selectedRecordIds: [],
    /* 推荐排序值 */
    isEditTagSortOrder: false, //排序值弹窗显示
    sortTagOrderNum: '', //排序值
    saveTagRecord: {}, // 排序值所在列表的行信息
    /* 商品排序值 */
    isEditSortOrder: false, //排序值弹窗显示
    sortOrderNum: '', //排序值
    saveRecord: {}, // 排序值所在列表的行信息
    /* 新增商品 */
    addGoodsVisible: false, // 新增商品显隐
    addGoodsLoading: false, // 新增loading
    goodsInfo: {}, // 商品信息
    modalType: '1', //弹窗类型
    toupType:'0',//上架或下架
    stockType: '0', //库存类型
    appointNeedLimit: '0', //单人预约限额
    detail: '', // 活动详情
    updateRecord: {}, // 编辑所在列表信息
    memberCardList: [], // 会员卡下拉列表
    isChangeTime: false, // 有效期限是否改变
    isChangeNum: false, // 是否更改数量
    /* 图片显示 */
    previewVisible: false, //封面图预览显示
    previewImage: '', //封面图预览图片
    bannerVisible: false, //轮播图预览显示
    bannerImage: '', //轮播图预览图片
    /* 设置库存 */
    stockSettingVisible: false, // 库存设置显隐
    orderTimeRange: {}, // 预约时间范围
    stock: 0, // 总库存
    haveSetStock: 0, //已设置库存
    setNum: 0, // 返回的已设置库存
    selectedDate: '', //选中的日期
    stockList: [], // 设置库存列表
    defaultDateStock: 0, // 当天设置库存数
    daySetNum: [], //编辑后台返回库存列表
    /* 二维码显示 */
    codeVisible: false, //二维码显示
    qrUrl: '', //二维码图片
    path: '', //二维码地址
    /* 提前预约提示 */
    isAdvanceOrder: false, //提前预约天数是否在扣除押金范围内
    allData: {}, // 获取传递的总value
    isUpload: false, //上传进度弹窗
    showBar: false, //上传进度条
    fileError: false, //上传失败字段

    /* 上新展示图 */
    newArrivalVisible:false,
    newArrivalImage:'',
    newArrivalImageVisible:false,
    newArrivalId:'',
    errorMessage:'',
    errorVisible:false,
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_hqsupercard_goods') {
          dispatch({
            type: 'queryAuditGoods',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
          dispatch({
            type: 'queryPlatVipCardList',
            payload: {},
          });

          setTimeout(() => {
            dispatch({
              type: 'tableColumnQuery',
            });
          }, 500);
        }
      });
    },
  },

  effects: {
    //获取商品列表
    *queryAuditGoods({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryAuditGoods, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: ret.results,
            resultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
            selectedRows: [],
            selectedRowKeys: [],
            selectedRecordIds: [],
            searchContent,
            pageIndex,
            pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    /* 创建商品 */
    *createPlatGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const { val, } = payload;
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(createPlatGoods, val);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: false,
            isAdvanceOrder: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '新增商品成功');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 编辑商品 */
    *updatePlatGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const { val, id, } = payload;
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(updatePlatGoods, {
        ...val,
        id,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: false,
            isAdvanceOrder: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 查看商品信息 */
    *getPlatGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(getPlatGoods, payload);
      if (ret && ret.errorCode == '9000') {
        const data = ret;
        const arr = [];
        let obj = {};
        data.daySetNum &&
          data.daySetNum.map(item => {
            for (const i in item) {
              obj = {
                key: i,
                value: item[i],
              };
            }
            arr.push(obj);
          });
        if (data.cancel == '1') {
          data.refundDay = data.workDay;
        } else if (data.cancel == '0') {
          data.refundDayTwo = data.workDay;
        }
        const appointArr = [];
        const defaultCheckedArr = [];
        data.additionalInfo &&
          JSON.parse(data.additionalInfo).forEach(e => {
            const data = {
              label: e.fieldLabel,
              value: e.fieldName,
            };
            defaultCheckedArr.push(e.fieldName);
            appointArr.push(data);
          });
        // console.log(
        //   'goodsInfo---appointExplain',
        //   JSON.parse(data.appointExplain)
        // );
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: true,
            goodsInfo: data,
            stockList: arr,
            haveSetStock: Number(data.setNum),
            setNum: Number(data.setNum),
            detail: data.detail,
            stockType: data.stockType,
            appointNeedLimit: data.appointNeedLimit,
            stock: data.stock,
            defaultAppointCheckedArr: defaultCheckedArr,
            appointOtherList: appointArr,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 修改上下架状态 */
    *updatePlatGoodsStatus({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(updatePlatGoodsStatus, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品状态失败');
      }
    },

    /* 删除商品 */
    *deletePlatGoods({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(deletePlatGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        message.success((ret && ret.errorMessage) || '删除商品成功');
      } else {
        message.error((ret && ret.errorMessage) || '删除商品失败');
      }
    },

    /* 提交审核 */
    *submitPlatGoodsAudit({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(submitPlatGoodsAudit, payload);
      if (ret && ret.errorCode == '9000') {
        message.success((ret && ret.errorMessage) || '提交审核成功');
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '提交审核失败');
      }
    },

    /* 设置成推荐 */
    *setPlatGoodsTag({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(setPlatGoodsTag, payload);
      const state = yield select(state => state.hqSupercardGoodsModel);
      if (ret && ret.errorCode == '9000') {
        message.success('设置推荐成功');
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error('设置推荐失败');
      }
    },

    /* 设置成推荐排序值 */
    *setPlatTagSortOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(setPlatTagSortOrder, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            isEditTagSortOrder: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '设置推荐失败');
      }
    },

    /* 设置商品排序值 */
    *setPlatGoodsSortOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(setPlatGoodsSortOrder, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            isEditSortOrder: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品排序值失败');
      }
    },
    /* 查询会员卡下拉框列表 */
    *queryPlatVipCardList({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(queryPlatVipCardList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            memberCardList: ret && ret.vipCardList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品排序值失败');
      }
    },

    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.hqSupercardGoodsModel);
      yield put({
        type: 'queryAuditGoods',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    //下载批量导入模板
    *downloadTemplate({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(downloadTemplate, payload);
      exportFile(ret, '', '商品模板');
    },

    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const data = {
        tableKey: 'plat_supercard_list',
      };

      const { ret, } = yield call(tableColumnQuery, { ...data, });
      if (ret && ret.errorCode == '9000') {
        console.log('查询的表格接口----', ret);

        yield put({
          type: 'updateState',
          payload: {
            firstTable: true,
            defaultCheckedValue: JSON.parse(ret.columnSet),
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询失败');
      }
    },

    //保存表格项目
    *tableColumnSave({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const data = {
        tableKey: 'plat_supercard_list',
        columnSet: JSON.stringify(state.defaultCheckedValue),
      };

      const { ret, } = yield call(tableColumnSave, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success('保存成功');
        yield put({
          type: 'updateState',
          payload: {},
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询失败');
      }
    },
    /* 修改预约中其他信息*/
    *queryPlatGoodsAdditionalInfo({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsModel);
      const data = {};
      const { ret, } = yield call(queryPlatGoodsAdditionalInfo, data);
      console.log('预约中的其他信息---------------', ret);
      const newArrdata = [];
      ret.forEach(e => {
        const data = {
          label: e.fieldLabel,
          value: e.fieldName,
        };
        newArrdata.push(data);
      });
      yield put({
        type: 'updateState',
        payload: {
          appointOther: newArrdata,
        },
      });
    },
    //上新下架操作
    *setNewPlatGoods({payload},{select, call, put}){
      const state = yield select(state => state.hqSupercardGoodsModel);
      const { ret, } = yield call(setNewPlatGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            newArrivalVisible: false,
          },
        });
      }else if(ret && ret.errorCode == '1034000'){
        yield put({
          type: 'updateState',
          payload: {
            errorVisible: true,
            errorMessage: ret.errorMessage
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
      }
    }
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload, };
    },
    showLoading(state, action) {
      return { ...state, ...action.payload, loading: true, };
    },
    closeLoading(state, action) {
      return { ...state, ...action.payload, loading: false, };
    },
    showAddGoodsLoading(state, action) {
      return { ...state, ...action.payload, addGoodsLoading: true, };
    },
    closeAddGoodsLoading(state, action) {
      return { ...state, ...action.payload, addGoodsLoading: false, };
    },
  },
};
