/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import {
    queryWhiteList,
    getByMobile,
    update,
    deleteWhiteList,
} from '../../services/setting/otherManageService'
import {message} from 'antd'
export default{
    namespace: 'OtherManageModel',

    state:{
        //添加白名单相关变量
        addWhiteListModalTitle:'白名单账号设置',//加白名单Modal标题
        addWhiteListModalVisible:false,//添加白名单Modal是否显示
        //设置白名单相关变量
        mobile:'',
        setWhiteListModalTitle:'用户首次预约成功账户设置',
        setWhiteListModalVisible:false,
        cardChoosedId:[],
        setWhiteListDrawerInfo:[],
        //查看白名单相关变量
        lookWhiteListDrawerTitle:'白名单信息',
        lookWhiteListDrawerVisible:false,
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
            if (pathname == '/zyg_set_other') {
                // dispatch({
                //     type: 'queryWhiteList',
                //     payload: {
                //         pageIndex: 0,
                //         pageSize: 20,
                //     },
                // });
            }
          });
        },
    },

    effects:{
        //查询员工列表
        *queryWhiteList({ payload, }, { select, call, put, }) {
            yield put({ type: 'updateState', payload: { loading: true, }, });
            const { pageIndex, pageSize, } = payload;
            const { ret, } = yield call(queryWhiteList, {
                // ...searchContent,
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
                        pageIndex,
                        pageSize,
                    },
                });
            } else {
                message.error((ret && ret.errorMessage) || '白名单列表加载失败');
            }
            yield put({ type: 'updateState', payload: { loading: false, }, });
        },
        //根据手机号查询白名单
        *getByMobile({ payload, }, { select, call, put, }) {
            const { mobile, } = payload;
            const { ret, } = yield call(getByMobile, {
                mobile,
            });
            if (ret && ret.errorCode == '9000') {
                
                yield put({
                    type: 'updateState',
                    payload: {
                        setWhiteListModalVisible:true,
                        mobile,
                        setWhiteListDrawerInfo:ret.custItemList,
                    },
                });
            } else {
                message.error((ret && ret.errorMessage) || '搜索失败');
            }
        },
        //白名单更新
        *update({ payload, }, { select, call, put, }) {
            const { whitelistItems, } = payload;
            const { ret, } = yield call(update, {
                whitelistItems,
            });
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'updateState',
                    payload: {
                        addWhiteListModalVisible:false,
                        setWhiteListModalVisible:false,
                    },
                });
                message.success('成功')
            } else {
                message.error((ret && ret.errorMessage) || '搜索失败');
            }
        },
        //白名单删除
        *deleteWhiteList({ payload, }, { select, call, put, }) {
            const state = yield select(state => state.OtherManageModel);
            const { whitelistId, } = payload;
            const { ret, } = yield call(deleteWhiteList, {
                whitelistId,
            });
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'queryWhiteList',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize: state.pageSize,
                    },
                });
            } else {
                message.error((ret && ret.errorMessage) || '操作失败');
            }
        },
        //分页
        *pageChange({ payload, }, { select, put, }) {
            const { pageIndex, pageSize, } = payload;
            const state = yield select(state => state.OtherManageModel);
            yield put({
            type: 'queryWhiteList',
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
    }
}