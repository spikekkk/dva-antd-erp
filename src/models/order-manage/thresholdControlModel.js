/* eslint-disable no-unused-vars */
import {
  queryPlatOrderList, //获取待审核门票列表
} from '../../services/order-manage/thresholdControlService';
/* eslint-disable no-unused-vars */
import { queryPlatVipCardList, } from '../../services/member-card-manage/hqSupercardGoodsService';
import { message, } from 'antd';

export default {
  namespace: 'ThresholdControlModel',

  state: {
    memberCardList: [],
    auditVisible: true, //审核侧栏
    orderBaseInfo: '', //订单详细信息
    isHq: true, //总部门票详情页面确认按钮改变
    alertModalVisible: false, //同意弹窗
    alertModalTitle: '添加备注',
    remarksValue: '', //添加备注

    auditLoading: false, //审核表格loading
    auditModelVisible: false, //审核弹窗
    handleAuditVisible: false,
    /*搜索*/
    searchContent: {}, //搜索内容

    /*表格项*/
    loading: false,
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    selectedRowKeys: [],
    selectedRows: [],
    selectedRecordIds: [],
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_order_threshold') {
          dispatch({
            type: 'queryPlatOrderList',
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
    //获取订单列表
    *queryPlatOrderList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;

      const { ret, } = yield call(queryPlatOrderList, {
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

            pageIndex,
            pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
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
      const state = yield select(state => state.ThresholdControlModel);
      yield put({
        type: 'queryPlatOrderList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
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
  },
};
