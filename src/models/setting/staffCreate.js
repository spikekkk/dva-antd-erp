import {
  queryShopByMgrShops, //获取所管辖的游乐园
} from '../../services/index-layout/indexLayoutService';
import {
  createShopUser, //创建员工
  getShopUser, //获取当前员工信息
  updateShopUser, //修改员工
  getRoles, //获取所有角色
} from '../../services/setting/staffCreateService';
import { parse, } from 'qs';
import { message, } from 'antd';

export default {
  namespace: 'StaffCreateModel',

  state: {
    checkedall:false,
    createVisible: false,
    createLoading: false,
    mgrShops: [], //当前游乐园
    choose_mgrShops:[],//
    record_mgrShops:[],//
    parkVisible: false, //显示
    parkList: [], //游乐园列表
    searchparkList:[],
    modalType: '1', //弹窗类型
    userInfo: {}, //员工信息
    roleList: [], //所有角色
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/vip_manage') {
        }
      });
    },
  },

  effects: {
    //获取所有角色
    *getRoles({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(getRoles);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            roleList: ret.results,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取角色信息失败');
      }
    },

    //点击创建员工
    *addStaff({ payload, }, { call, put, }) {
      const { createVisible, modalType, } = payload;
      yield put({
        type: 'getRoles',
      });
      yield put({
        type: 'updateState',
        payload: {
          createVisible,
          modalType,
          userInfo: {},
          mgrShops: [],
          choose_mgrShops: [],
          record_mgrShops: [],
          checkedall:false,
        },
      });
    },

    //创建员工
    *createShopUser({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { createLoading: true, }, });
      const state = yield select(state => state.StaffCreateModel);
      const { values, refresh, } = payload;
      const params = {
        ...values,
        mgrShops: state.mgrShops.join(','),
        // choose_mgrShops: state.choose_mgrShops.join(','),
        // record_mgrShops: state.record_mgrShops.join(',')
      };
      const { ret, } = yield call(createShopUser, params);
      if (ret && ret.errorCode == '9000') {
        message.success('创建成功');
        yield put({
          type: 'updateState',
          payload: {
            createVisible: false,
          },
        });
        refresh && refresh();
      } else {
        message.error((ret && ret.errorMessage) || '创建失败');
      }
      yield put({ type: 'updateState', payload: { createLoading: false, }, });
    },

    //显示管辖游乐园
    *showParkList({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { parkVisible: true, }, });
      // const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.StaffCreateModel);
      const { ret, } = yield call(queryShopByMgrShops);
      if (ret && ret.errorCode == '9000') {
        let new_list=[];
        ret.data.mgrShops.map(item=>{
          new_list.push({
            label:item.name,
            value:item.shopId
          })
        })

        yield put({
          type: 'updateState',
          payload: {
            checkedall:state.modalType == '2' ? (new_list.length == state.userInfo.mgrShops.split(',').length):false,
            parkList: new_list,
            searchparkList:JSON.parse(JSON.stringify(new_list)),
            mgrShops:state.modalType == '2' ? state.userInfo.mgrShops.split(','): state.mgrShops,
            choose_mgrShops:state.modalType == '2' ? state.userInfo.choose_mgrShops.split(','): state.choose_mgrShops,
            record_mgrShops:state.modalType == '2' ? state.userInfo.record_mgrShops.split(','): state.record_mgrShops,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
    },

    //获取当前员工信息
    *getShopUser({ payload, }, { select, call, put, }) {
      const { id, } = payload;
      const { ret, } = yield call(getShopUser, { id, });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'getRoles',
        });
        ret.data.choose_mgrShops=JSON.parse(JSON.stringify(ret.data.mgrShops))
        ret.data.record_mgrShops=JSON.parse(JSON.stringify(ret.data.mgrShops))
        console.log(ret.data)
        yield put({
          type: 'updateState',
          payload: {
            createVisible: true,
            modalType: '2',
            userInfo: ret.data,
            mgrShops: !!ret.data.mgrShops ? ret.data.mgrShops.split(',') : [],
            choose_mgrShops:!!ret.data.choose_mgrShops ? ret.data.choose_mgrShops.split(',') : [],
            record_mgrShops:!!ret.data.record_mgrShops ? ret.data.record_mgrShops.split(',') : [],
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取当前员工信息失败');
      }
    },

    //修改员工信息
    *updateShopUser({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { createLoading: true, }, });
      const state = yield select(state => state.StaffCreateModel);
      const { values, refresh, } = payload;

      const params = {
        ...values,
        mgrShops: state.mgrShops.join(','),
        id: state.userInfo.id,
      };
      const { ret, } = yield call(updateShopUser, params);
      if (ret && ret.errorCode == '9000') {
        message.success('修改成功');
        yield put({
          type: 'updateState',
          payload: {
            createVisible: false,
          },
        });
        refresh && refresh();
      } else {
        message.error((ret && ret.errorMessage) || '修改失败');
      }
      yield put({ type: 'updateState', payload: { createLoading: false, }, });
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
