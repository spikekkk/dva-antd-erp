/* eslint-disable no-unused-vars */
import {
  queryPlatVipCard,
  createPlatVipGoods,
  updatePlatVipCard,
  getVipCard,
  updatePlatVipCardStatus,
  downloadTemplate,
  importVipCardDateSetAppoint,
  queryVipCardDaySet,
  queryPlatCardCategoryList,
  setNewPlatGoods,
} from '../../services/member-card-manage/memberCardManageService';
import { message, } from 'antd';
import moment from 'moment';
import { exportFile, } from '../../utils/exportFile';

export default {
  namespace: 'memberCardModel',

  state: {
    /*搜索*/
    searchContent: {}, //搜索内容
    /*分页项*/
    memberCardList: [], //会员卡下拉列表
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    dataSource: [], //列表信息
    loading: false,
    /* 状态弹窗 */
    isUpdateStatus: false, //状态显隐
    updateRecord: {}, // 状态改变的信息
    /* 会员卡创建/编辑 */
    vipCardInfo: {}, // 会员卡信息
    addVipCardVisible: false, //新增/编辑会员卡显隐
    createLoading: false, // 创建loading
    myBannerImage: '', //我的首页--banner
    myBannerVisible: false, //我的首页--banner开关

    bannerVisible: false, //首页banner预览显示
    bannerImage: '', //首页banner预览图片
    previewVisible: false, //会员卡长图预览显示
    previewImage: '', //会员卡长图预览图片
    shareVisible: false, // 分享图片显示
    shareImage: '', // 分享图片预览
    modalType: '1', //弹窗类型 1-新增 2-编辑
    updateCardRecord: {}, //编辑获取当前信息
    /* 批量日期库存设置 */
    stockSettingVisible: false, //库存设置显隐
    year: 2019, //年
    thisYear: 2019, //今年
    holidays: [], //节假日
    holidayList: [], //节假日对象集合
    today: moment().format('YYYY-MM-DD'), //当天
    isSetStockAndAmount: false, //设置库存和限额
    selectedDate: '', //选中的日期
    stock: 0, // 总库存
    amount: 0, // 商品预约限额
    cardItem: {}, //点击查看获取该条详情
    dateSetList: [], // 批量查看设置
    /* 单个日期设置 */
    singleStockSettingVisible: false, //单个日期设置
    singleSelectedDate: {}, //选中的日期
    stockList: [], // 设置库存列表
    defaultDateStock: 0, // 当天设置库存数
    defaultDateAmount: 0, // 当天设置限额
    /* 上新展示图 */
    newArrivalVisible:false,
    newArrivalImage:'',
    newArrivalImageVisible:false,
    newArrivalId:'',
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_memberCard_manage') {
          dispatch({
            type: 'queryPlatVipCard',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });

          dispatch({
            type: 'queryPlatCardCategoryList',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    //获取商品列表
    *queryPlatVipCard({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryPlatVipCard, {
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

    /* 创建会员卡 */
    *createPlatVipGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddCardLoading', });
      const { val, } = payload;
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(createPlatVipGoods, val);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatVipCard',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addVipCardVisible: false,
          },
        });
        message.success((ret && ret.errorMessage) || '新增会员卡成功');
      } else {
        message.error((ret && ret.errorMessage) || '新增会员卡失败');
      }
      yield put({ type: 'closeAddCardLoading', });
    },

    /* 编辑商品 */
    *updatePlatVipCard({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddCardLoading', });
      const { val, id, } = payload;
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(updatePlatVipCard, {
        ...val,
        id,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatVipCard',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addVipCardVisible: false,
          },
        });
        message.success((ret && ret.errorMessage) || '修改会员卡成功');
      } else {
        message.error((ret && ret.errorMessage) || '修改会员卡失败');
      }
      yield put({ type: 'closeAddCardLoading', });
    },

    /* 查看商品信息 */
    *getVipCard({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddCardLoading', });
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(getVipCard, payload);
      if (ret && ret.errorCode == '9000') {
        const data = ret;
        data.buyNotice = data.buyNotice.replace(/<br>/g, '\n');
        yield put({
          type: 'updateState',
          payload: {
            addVipCardVisible: true,
            vipCardInfo: data,
            stockList: data.dateSetStock,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查看会员卡失败');
      }
      yield put({ type: 'closeAddCardLoading', });
    },

    /* 修改上下架状态 */
    *updatePlatVipCardStatus({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(updatePlatVipCardStatus, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatVipCard',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            isUpdateStatus: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改状态失败');
      }
    },

    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.memberCardModel);
      yield put({
        type: 'queryPlatVipCard',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    /* 获取会员卡日历设置 */
    *queryVipCardDaySet({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(queryVipCardDaySet, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dateSetList: ret && ret.dateSetList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改状态失败');
      }
    },
    //选择日期
    *selectDate({ payload, }, { put, call, select, }) {
      const selectDate = payload.dateStr;
      const state = yield select(state => state.memberCardModel);
      if (state.holidays.indexOf(selectDate) < 0) {
        state.holidays.push(selectDate);
        state.holidayList.push({
          content: '',
          hday: selectDate,
          id: '',
          year: state.year,
          editable: true,
        });
        if (state.holidays && state.holidays.length > 1) {
          state.holidays = state.holidays.slice(1);
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          holidays: state.holidays,
          holidayList: state.holidayList,
        },
      });
    },
    //上一年
    *beforeYear({ payload, }, { put, call, select, }) {
      const state = yield select(state => state.memberCardModel);
      if (state.year - 1 >= state.thisYear) {
        yield put({
          type: 'updateState',
          payload: {
            year: state.year - 1,
          },
        });
      }
    },
    //下一年
    *nextYear({ payload, }, { put, call, select, }) {
      const state = yield select(state => state.memberCardModel);
      yield put({
        type: 'updateState',
        payload: {
          year: state.year + 1,
        },
      });
    },
    //下载批量导入模板
    *downloadTemplate({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(downloadTemplate, payload);
      console.info('ret', ret);
      exportFile(ret, '', '会员卡模板');
    },
    //上传
    *importVipCardDateSetAppoint({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(importVipCardDateSetAppoint, payload);
      if (ret && ret.errorCode === 9000) {
        // console.info('ret---',ret);
      } else {
        message.error((ret && ret.errorMessage) || '上传失败');
      }
    },
    /* 查询会员卡下拉框列表 */
    *queryPlatCardCategoryList({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(queryPlatCardCategoryList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            memberCardList: ret && ret.categoryItemList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询会员卡列表失败');
      }
    },
    //上新下架操作
    *setNewPlatGoods({payload},{select, call, put}){
      const { ret, } = yield call(setNewPlatGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatVipCard',
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
    showAddCardLoading(state, action) {
      return { ...state, ...action.payload, createLoading: true, };
    },
    closeAddCardLoading(state, action) {
      return { ...state, ...action.payload, createLoading: false, };
    },
  },
};
