import {
	getBannerList,              //获取轮播图列表
    changeStatus,               //修改轮播图状态
    getHotComList,              //获取热门商品列表
    updateHotComStatus,         //热门商品状态修改
    queryShare,                 //查询分享
    editShare,                  //编辑分享
}from '../../services/setting/miniProgramService';
import { parse } from 'qs';
import { message } from 'antd';

export default {

    namespace: 'MiniProgramModel',

    state: {
        /*搜索*/
        searchContent         : {},         //搜索内容

        /*表格项*/
		loading               : false,
		dataSource            : [],
		newColumns            : [],
		resultCount           : 0,
		pageIndex             : 0,
		pageSize              : 20,
        selectedRows          : [],
        selectedRowKeys       : [],
        selectedRecordIds     : [],

        miniKey               : '0',        //tabKey

        previewVisible        : false,      //图片预览显示
        previewImage          : '',         //图片预览图片
        data                  : {},         //分享信息
        createLoading         : false,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/zyg_set_miniprogram' && sessionStorage.getItem('isLogin') == '1'){
                    dispatch({
                        type : 'getBannerList',
                        payload : {
                            pageIndex : 0,
                            pageSize : 20
                        }
                    })
                }
            });
        },
    },

    effects: {
        //获取轮播图列表
        *getBannerList({ payload } , { select , call , put }){
            yield put({ type : 'updateState', payload : { loading : true } });
            let { pageIndex, pageSize, searchContent } = payload;
            let { ret } = yield call( getBannerList, ({ ...searchContent, pageIndex, pageSize }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource        : ret.results,
                        resultCount       : ret.data != null && !!ret.data.resultCount ? ret.data.resultCount : 0,
                        selectedRows      : [],
                        selectedRowKeys   : [],
                        selectedRecordIds : [],
                        searchContent,
                        pageIndex,
                        pageSize,
                    }
                })
            } else{
                message.error( (ret && ret.errorMessage) || '列表加载失败' );
            }
            yield put({ type : 'updateState', payload : { loading : false } });
        },

        //分页
        *pageChange({ payload } , { select , call , put }){
            let { pageIndex, pageSize } = payload;
            let state = yield select( state => state.MiniProgramModel );
            if(state.miniKey == '0'){
                yield put({
                    type : 'getBannerList',
                    payload : {
                        pageIndex : pageIndex - 1,
                        pageSize,
                        searchContent : state.searchContent
                    }
                })
            } else if(state.miniKey == '1'){
                yield put({
                    type : 'getHotComList',
                    payload : {
                        pageIndex : pageIndex - 1,
                        pageSize,
                        searchContent : state.searchContent
                    }
                })
            }
        },

        //轮播图上下架
        *changeStatus({ payload } , { select , call , put }){
            let { status, refresh } = payload;
            let state = yield select( state => state.MiniProgramModel );
            let text = status == '0' ? '删除' : status == '1' ? '上架' : status == '2' ? '下架' : '';
            let params = {
                id : state.selectedRowKeys.join(','),
                status
            };
            let { ret } = yield call( changeStatus, (params));
            if( ret && ret.errorCode == '9000' ){
                message.success( text + '成功' );
                refresh && refresh();
            } else{
                message.error( (ret && ret.errorMessage) || text + '失败' );
            }
        },

        //获取热门商品列表
        *getHotComList({ payload } , { select , call , put }){
            yield put({ type : 'updateState', payload : { loading : true } });
            let { pageIndex, pageSize, searchContent } = payload;
            let { ret } = yield call( getHotComList, ({ ...searchContent, pageIndex, pageSize }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource        : ret.results,
                        resultCount       : ret.data != null && !!ret.data.resultCount ? ret.data.resultCount : 0,
                        selectedRows      : [],
                        selectedRowKeys   : [],
                        selectedRecordIds : [],
                        searchContent,
                        pageIndex,
                        pageSize,
                    }
                })
            } else{
                message.error( (ret && ret.errorMessage) || '列表加载失败' );
            }
            yield put({ type : 'updateState', payload : { loading : false } });
        },

        //热门商品上下架
        *upStateHot({ payload } , { select , call , put }){
            let { status, refreshHot } = payload;
            let state = yield select( state => state.MiniProgramModel );
            let text = status == '0' ? '删除' : status == '1' ? '上架' : status == '2' ? '下架' : '';
            let params = {
                id : state.selectedRowKeys.join(','),
                status
            };
            let { ret } = yield call( updateHotComStatus, (params));
            if( ret && ret.errorCode == '9000' ){
                message.success( text + '成功' );
                refreshHot && refreshHot();
            } else{
                message.error( (ret && ret.errorMessage) || text + '失败' );
            }
        },

        //查询分享
        *queryShare({ payload } , { select , call , put }){
            let state = yield select( state => state.MiniProgramModel );
            let { ret } = yield call( queryShare );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        data : !!ret.results && ret.results.length > 0 && ret.results != null ? ret.results[0] : {}
                    }
                })
            } else{
                message.error( (ret && ret.errorMessage) || '查询失败' );
            }
        },

        //编辑分享
        *editShare({ payload } , { select , call , put }){
            yield put({ type : 'updateState', payload : { createLoading : true } });
            let { values } = payload;
            let { ret } = yield call( editShare, ({...values}) );
            if( ret && ret.errorCode == '9000' ){
                message.success('编辑成功');
                yield put({
                    type : 'queryShare'
                })
            } else{
                message.error( (ret && ret.errorMessage) || '编辑失败' );
            }
            yield put({ type : 'updateState', payload : { createLoading : false } });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
        showLoading(state, action) {
            return { ...state, ...action.payload , loading : true};
        },
        closeLoading(state, action) {
            return { ...state, ...action.payload , loading : false};
        },
    },
};
