/* eslint-disable no-unused-vars */
import {
  queryPlatAppointOrderList, //获取列表
  verifyOrder, //核销
  drawOrder, //出票
  appointOrderCancel, //取消预约
} from '../../services/order-manage/platformAppointOrderService';
import { message, Popover, } from 'antd';

import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';

export default {
  namespace: 'platformAppointOrderModel',

  state: {
    orderBaseInfo: '', //订单详细信息
    isHq: true, //总部门票详情页面确认按钮改变
    alertModalVisible: false, //同意弹窗
    firstTable: false, //第一次请求
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
    defaultCheckedValue: [], //默认选中的checked
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
        if (pathname == '/zyg_appoint_order_manage') {
          dispatch({
            type: 'queryPlatAppointOrderList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
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
    //获取订单列表
    *queryPlatAppointOrderList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      console.log('payload-----------获取预约商品列表', payload);
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryPlatAppointOrderList, {
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
            alertModalVisible: false,
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
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.platformAppointOrderModel);
      yield put({
        type: 'queryPlatAppointOrderList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },

    //核销
    *verifyOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        appointId: state.orderBaseInfo.id,
        verifierDescription: state.remarksValue,
      };

      const { ret, } = yield call(verifyOrder, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'queryPlatAppointOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '核销失败');
      }
    },

    //出票
    *drawOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        appointId: state.orderBaseInfo.id,
        drawerDescription: state.remarksValue,
      };
      const { ret, } = yield call(drawOrder, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');

        yield put({
          type: 'queryPlatAppointOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '出票失败');
      }
    },
    //取消预约
    *appointOrderCancel({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        appointOrderId: state.orderBaseInfo.id,
        appointCancelDescription: state.remarksValue,
      };

      const { ret, } = yield call(appointOrderCancel, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'queryPlatAppointOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '取消预约失败');
      }
    },
    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        tableKey: 'plat_appoint_list',
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
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        tableKey: 'plat_appoint_list',
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
