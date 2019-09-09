/* eslint-disable no-unused-vars */
import {
  queryPlatToAuditGoods,
  auditPlatGoods,
} from '../../services/member-card-manage/hqSupercardGoodsAuditService';

import {
  getPlatGoods,
  queryPlatGoodsAdditionalInfo,
} from '../../services/member-card-manage/hqSupercardGoodsService';
import { message, } from 'antd';
import moment from 'moment';

export default {
  namespace: 'hqSupercardGoodsAuditModel',

  state: {
    /*表格项*/
    loading: false,
    appointOther: [], //预约其他想选
    defaultAppointCheckedArr: [], //默认预约其他信息选中
    appointOtherList: [], //预约选中右侧数据项目
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    isEditRefund: false, //拒绝理由弹窗显示
    refuseReason: '', //拒绝理由
    refuseReasonRecord: {}, // 拒绝理由所在列表的行信息
    isAgreeSure: false, //同意弹窗显示
    agreeRecord: {}, // 同意所在列表的行信息
    /* 新增商品 */
    addGoodsVisible: false, // 新增商品显隐
    addGoodsLoading: false, // 新增loading
    goodsInfo: {}, // 商品信息
    modalType: '1', //弹窗类型
    stockType: '0', //库存类型
    appointNeedLimit: '0', //单人预约限额
    detail: '', // 活动详情
    /* 设置库存 */
    stockSettingVisible: false, // 库存设置显隐
    orderTimeRange: {}, // 预约时间范围
    totalStock: 0, // 总库存
    haveSetStock: 0, //已设置库存
    oldSetStock: 100, // 返回的已设置库存
    selectedDate: moment().format('YYYY-MM-DD'), //选中的日期
    stockList: [], // 设置库存列表
    defaultDateStock: 0, // 当天设置库存数
    oldStockList: [], //编辑后台返回库存列表
    /* 二维码显示 */
    codeVisible: false, //二维码显示
    qrUrl: '', //二维码图片
    path: '', //二维码地址
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_hqsupercard_goodsAudit') {
          dispatch({
            type: 'queryPlatToAuditGoods',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });

          dispatch({
            type: 'queryPlatVipCardList',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    //获取待审核商品列表
    *queryPlatToAuditGoods({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, } = payload;
      const { ret, } = yield call(queryPlatToAuditGoods, {
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
            pageIndex,
            pageSize,
            auditVisible: true,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    /* 审批商品 */
    *auditPlatGoods({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.hqSupercardGoodsAuditModel);
      const { ret, } = yield call(auditPlatGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatToAuditGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品状态成功');
      }
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
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: true,
            goodsInfo: data,
            stockList: arr,
            haveSetStock: Number(data.setNum),
            detail: data.detail,
            stockType: data.stockType,
            appointNeedLimit: data.appointNeedLimit,
            stock: data.stock,
            defaultAppointCheckedArr: defaultCheckedArr,
            appointOtherList: appointArr,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品成功');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.hqSupercardGoodsAuditModel);
      yield put({
        type: 'queryPlatToAuditGoods',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
        },
      });
    },
    /* 修改预约中其他信息*/
    *queryPlatGoodsAdditionalInfo({ payload, }, { select, call, put, }) {
      const data = {};
      const { ret, } = yield call(queryPlatGoodsAdditionalInfo, data);

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
