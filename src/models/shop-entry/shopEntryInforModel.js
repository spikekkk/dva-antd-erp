/* eslint-disable no-unused-vars */
import {
  businessList, //获取列表
  businessStatus, //核销
  businessExport, //导出
} from '../../services/shop-entry/shopEntryInforService';
import { message, Popover, } from 'antd';
import { exportFile, } from '../../utils/exportFile';

export default {
  namespace: 'shopEntryInforModel',

  state: {
    orderBaseInfo: '', //订单详细信息
    isHq: true, //总部门票详情页面确认按钮改变
    alertModalVisible: false, //同意弹窗
    firstTable: false, //第一次请求
    alertModalTitle: '请输入处理说明',
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
        if (pathname == '/zyg_shop_entry') {
          dispatch({
            type: 'businessList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
        }
      });
    },
  },
  effects: {
    //获取订单列表
    *businessList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });

      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(businessList, {
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
      const state = yield select(state => state.shopEntryInforModel);
      yield put({
        type: 'businessList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },

    //核销
    *businessStatus({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopEntryInforModel);
      const data = {
        id: state.orderBaseInfo.id,
        status: state.orderBaseInfo.status ? '0' : '1',
        remark: state.remarksValue,
      };

      const { ret, } = yield call(businessStatus, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'businessList',
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

    //下载批量导入模板
    *downloadTemplate({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopEntryInforModel);
      payload = { ...state.searchContent, };

      const { ret, } = yield call(businessExport, payload);
      console.info('ret', ret);
      exportFile(ret, '', '入驻门店信息');
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
