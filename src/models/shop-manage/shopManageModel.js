import {
  httpQueryShoplist,
  httpQueryShopItem,
  httpUpdateShopItem,
  httpAddShopItem,
} from '../../services/shop-manage/shopManageService';
import { message, } from 'antd';
export default {
  namespace: 'shopDetailModel',
  state: {
    /*搜索*/

    searchContent: {}, //搜索内容
    /*分页项*/
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    dataSource: [], //列表信息
    loading: false,
    shopDetailComponentShow: false,
    shopId: 0,
    /**店铺详情页 */
    shopItemDetailShow: false,
    detailLoading: false,
    /*店铺详细信息 */
    shopDetailMess: {},
    lng: 0,
    lat: 0,
    shopAddress: '',
    /*编辑新增店铺 */
    isCopy: false,
    editeShopDetailShow: false,
    createLoading: false, // 创建loading,
    shareVisible: false, // logo图片显示
    shareImage: '', // logo图片预览
    previewVisible: false, //门店图片预览显示
    previewImage: '', //门店图片预览图片,
    addShopLoading: false,
  },
  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, state, }) => {
        if (pathname == '/zyg_shop_manage') {
          dispatch({
            type: 'queryShoplist',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
        }
        if (RegExp(/\/zyg_shop_manage\/\d/).test(pathname)) {
          dispatch({
            type: 'queryShopDetail',
          });
        }
      });
    },
  },
  effects: {
    *queryShoplist({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(httpQueryShoplist, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: ret && ret.results,
            resultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
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
    *queryShopDetail({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopDetailModel);
      // httpQueryShopItem queryShopDetail
      yield put({
        type: 'updateState',
        payload: {
          shopItemDetailShow: true,
        },
      });
      const { id, } = payload;
      const { ret, } = yield call(httpQueryShopItem, {
        shopId: id,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            shopDetailMess: ret,
            detailLoading: true,
            lng: ret.lon,
            lat: ret.lat,
            shopAddress: ret.address,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取店铺信息失败');
      }
    },
    *editeShopDetail({ payload, }, { select, call, put, }) {
      yield put({
        type: 'updateState',
        payload: {
          shopItemDetailShow: false,
          editeShopDetailShow: true,
        },
      });
    },
    // edite
    *updateShopDetail({ payload, }, { select, call, put, }) {
      console.log(payload);
      // httpUpdateShopItem
      yield put({ type: 'showAddShopLoading', });
      const state = yield select(state => state.shopDetailModel);
      const { ret, } = yield call(httpUpdateShopItem, {
        ...payload,
      });
      if (ret && ret.errorCode == '9000') {
        // console.log('成功');queryShoplist
        yield put({
          type: 'queryShoplist',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            shopItemDetailShow: false,
            editeShopDetailShow: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '更新失败');
      }
      yield put({ type: 'closeAddShopLoading', });
    },
    // add
    *addShopDetail({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopDetailModel);
      yield put({ type: 'showAddShopLoading', });
      const { ret, } = yield call(httpAddShopItem, {
        ...payload,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryShoplist',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            shopItemDetailShow: false,
            editeShopDetailShow: false,
            isCopy: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '新增失败');
      }
      yield put({ type: 'closeAddShopLoading', });
    },
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.shopDetailModel);
      yield put({
        type: 'queryShoplist',
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
    showAddShopLoading(state, action) {
      return { ...state, ...action.payload, addShopLoading: true, };
    },
    closeAddShopLoading(state, action) {
      return { ...state, ...action.payload, addShopLoading: false, };
    },
  },
};
