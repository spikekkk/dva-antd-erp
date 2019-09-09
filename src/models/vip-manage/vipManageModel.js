import {
    queryCustomerList,
} from '../../services/vip-manage/vipManageService'
import { message, } from 'antd';

export default {
    namespace:'vipManageModel',

    state:{
        changeVisible:false,
        lookVisible:false,
        remarkVisible:false,
        edit:false,

        /*搜索*/
        searchContent: {}, //搜索内容

        /*表格项*/
        loading: false,
        dataSource: [],
        newColumns: [],
        resultCount: 0,
        pageIndex: 0,
        pageSize: 20,
        // selectedRowKeys: [],
        // selectedRows: [],
        // selectedRecordIds: [],
    },

    subscriptions: {
        setup({ dispatch, history, }) {
          history.listen(({ pathname, query, }) => {
            if (pathname == '/zyg_vip') {
              dispatch({
                type: 'queryCustomerList',
                payload: {
                  pageIndex: 0,
                  pageSize: 20,
                },
              });
            }
          });
        },
    },

    effects:{
        //获取订单列表
        *queryCustomerList({ payload, }, { call, put, }) {
            yield put({ type: 'showLoading', });
            const { pageIndex, pageSize, searchContent, } = payload;
            const { ret, } = yield call(queryCustomerList, {
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
                    // selectedRows: [],
                    // selectedRowKeys: [],
                    // selectedRecordIds: [],
        
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
            const state = yield select(state => state.vipManageModel);
            yield put({
            type: 'queryCustomerList',
            payload: {
                pageIndex: pageIndex - 1,
                pageSize,
                searchContent: state.searchContent,
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
}