/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import {
  login, //登录
  logout, //登出
} from '../../services/login/loginService';
import {
  queryPlatAppointOrderList, //获取列表
} from '../../services/order-manage/cancelAppointOrderService';
import {
  getUserPermShops, //获取对应门店
  updateShopUser, //修改密码
  getMenuList, //获取菜单及操作权限
} from '../../services/index-layout/indexLayoutService';
import { parse, } from 'qs';
import { message, } from 'antd';
import { routerRedux, } from 'dva/router';

export default {
  namespace: 'indexLayout',

  state: {
    subMuneKeys: '', //父级菜单key数组
    currentMenuKey: '', //当前子菜单key
    menuList: [], //菜单列表

    tabList: [], //历史页面
    tabKey: '',

    currentShop: undefined, //当前园区
    passCount: 0, //新信息--审核通过的数据
    refuseCount: '', //拒绝--审核拒绝的数据
    goodsName: '', //通过审核的商品
    shopList: [], //通过登录人获取所管辖的游乐园
    activeShop: '',

    hasInitMenu: false, //菜单加载

    visible: false, //修改密码
    loading: false,

    isLogin: false, //登录状态
    initData: {},
    // eslint-disable-next-line no-dupe-keys
    loading: false,

    //待处理的取消预约订单数量
    waitHandleCount: 0,
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (!hasInitMenu || pathname == '/') {
          dispatch({
            type: 'updateState',
            payload: {
              initData: window._init_data || {},
            },
          });

          if (sessionStorage.getItem('isLogin') == '1') {
            window.hasInitMenu = true;
            dispatch({
              type: 'updateState',
              payload: {
                isLogin: true,
              },
            });
            dispatch({
              type: 'getParkList',
            });

            dispatch({
              type: 'countOrder',
            });
          }

          //                    let tabs = JSON.parse(sessionStorage.getItem('tabList'));
          //                    let tabList = !!tabs ? tabs : [
          //                        { title : '家长信息', key : '//zyg_appoint_order_manage' }
          //                    ];

          //                    //获取管辖门店
          //                    dispatch({
          //                        type : 'getParkList'
          //                    })
          //                    //用户对应门店查询
          //                    dispatch({
          //                        type : 'getUserPermShops'
          //                    })
          //                    dispatch({
          //                        type : 'getMenuList'
          //                    })
          //                    dispatch({
          //                        type : 'login',
          //                        payload : {
          //                            acct : 'acct',
          //                            pwd : '123456'
          //                        }
          //                    })
          //                    dispatch({
          //                        type : 'updateState',
          //                        payload : {
          //                            tabList,
          //                            subMuneKeys: 'vip',
          //                            currentMenuKey: '//zyg_appoint_order_manage',
          //                            tabKey: '//zyg_appoint_order_manage',
          //                            hasInitMenu: true,
          //                        }
          //                    })
          //                    dispatch(routerRedux.push('//zyg_appoint_order_manage'))
        }
      });
    },
  },

  effects: {
    //获取待处理取消订单数量
    *countOrder({ payload, }, { call, put, select, }) {
      const { ret, } = yield call(queryPlatAppointOrderList, parse(payload));
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            waitHandleCount: ret.waitHandleCount,
          },
        });
      } else {
        message.error('获取 取消预约订单待处理数 失败');
      }
    },
    //登录
    *login({ payload, }, { call, put, select, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { ret, } = yield call(login, parse(payload));

      if (ret && ret.errorCode == '9000') {
        sessionStorage.getItem('token')
          ? sessionStorage.removeItem('token')
          : '';
        message.success('登录成功', 3);
        // console.log('登录数据----------------', ret);
        sessionStorage.setItem('token', ret.token);
        sessionStorage.setItem('isLogin', '1');
        window.hasInitMenu = true;
        yield put({
          type: 'updateState',
          payload: {
            isLogin: true,
          },
        });
        yield put({
          type: 'getParkList',
        });
      } else if (ret && ret.errorMessage) {
        window.hasInitMenu = false;
        message.error(ret.errorMessage || '登陆失败');
      } else {
        window.hasInitMenu = false;
        message.error('您的网络状况不佳，请检查网络情况');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },

    //通过登录人获取所管辖的游乐园
    *getParkList({ payload, }, { call, put, select, }) {
      const { ret, } = yield call(getUserPermShops, parse(payload));
      if (ret && ret.errorCode == 9000) {
        if (ret.data == null) {
          message.error('登陆失效');
          yield put({
            type: 'updateState',
            payload: { isLogin: false, passCount: '0', },
          });
          sessionStorage.removeItem('isLogin');
          sessionStorage.removeItem('tabList');
        } else {
          // yield put({
          //   type: 'getUserPermShops',
          // });

          window._init_data.shopId = ret.id;
          yield put({
            type: 'updateState',
            payload: {
              currentShop: ret.data.mgrShops,
              activeShop: ret.data.mgrShops[0],
            },
          });
          yield put({
            type: 'getMenuList',
          });
          window._init_data.shopList = ret.data.mgrShops;
          window._init_data.options = [];
          ret.data.mgrShops.map(item => {
            window._init_data.options.push({
              label: item.name,
              key: item.shopId,
            });
          });

          yield put({
            type: 'updateState',
            payload: {
              shopList: ret.data.mgrShops,
            },
          });
        }
      } else {
        message.error((ret && ret.errorMessage) || '园区列表加载失败');
        yield put({
          type: 'updateState',
          payload: { isLogin: false, },
        });
        sessionStorage.removeItem('isLogin');
        sessionStorage.removeItem('tabList');
      }
    },

    /*获取菜单及操作权限*/
    *getMenuList({ payload, }, { call, put, select, }) {
      const { ret, } = yield call(getMenuList);
      const tabs = JSON.parse(sessionStorage.getItem('tabList'));
      console.log('历史tabs----', tabs);
      let tabList = [];
      let parentKey = null;
      if (ret && ret.errorCode == 9000) {
        window._init_data.id = ret.data.id;
        window._init_data.opts = ret.data.opts; //操作权限

        if (!!tabs && tabs.length > 0) {
          tabs.forEach((tab, index) => {
            ret.data.menus.forEach(item => {
              if (tab.key == item.route) {
                tabList.push(tabs[index]);
                sessionStorage.setItem('tabList', JSON.stringify(tabList));
              }
            });
          });
        } else {
          const childeId = ret.data.menus[0].pid;
          ret.data.menus.forEach(e => {
            if (e.id === childeId) {
              parentKey = e.route;
            }
          });
          console.log('parentKey', parentKey);
          tabList = [
            {
              title: ret.data.menus[0].name,
              key: ret.data.menus[0].route,
              parentKey: parentKey,
            },
          ];
        }

        yield put({
          type: 'updateState',
          payload: {
            acct: ret.data.acct,
            menuList: ret.data.menus,
            opts: ret.data.opts,
            tabList,
            subMuneKeys: parentKey,
            currentMenuKey: ret.data.menus[0].route,
            tabKey: ret.data.menus[0].route,
            hasInitMenu: true,
          },
        });
        yield put(routerRedux.push(ret.data.menus[0].route));
      } else {
        message.error((ret && ret.errorMessage) || '菜单列表加载失败');
      }
    },

    /*用户对应门店查询*/
    *getUserPermShops({ payload, }, { call, put, select, }) {
      const { ret, } = yield call(getUserPermShops);
      if (ret && ret.errorCode == 9000) {
        window._init_data.shopId = ret.id;
        yield put({
          type: 'updateState',
          payload: {
            currentShop: ret.results,
            activeShop: ret.results[0],
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '园区列表加载失败');
      }
    },

    /*修改密码*/
    *updateShopUser({ payload, }, { call, put, select, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { ret, } = yield call(updateShopUser, { ...payload, });
      if (ret && ret.errorCode == 9000) {
        message.success('密码修改成功');
        yield put({
          type: 'updateState',
          payload: {
            visible: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '密码修改失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },

    //登出
    *logout({ payload, }, { call, put, select, }) {
      const { ret, } = yield call(logout);
      if (ret && ret.errorCode == 9000) {
        message.success('登出成功');
        window.hasInitMenu = false;
        sessionStorage.removeItem('tabList');
        sessionStorage.removeItem('isLogin');
        sessionStorage.removeItem('token');
        yield put({
          type: 'updateState',
          payload: {
            isLogin: false,
          },
        });
        yield put(routerRedux.push('/'));
      } else {
        message.error((ret && ret.errorMessage) || '登出失败');
      }
    },
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload, };
    },
    showTableLoading(state, action) {
      return { ...state, ...action.payload, koubeiMyGameTableLoading: true, };
    },
    closeTableLoading(state, action) {
      return { ...state, ...action.payload, koubeiMyGameTableLoading: false, };
    },
  },
};
