/* eslint-disable no-undef */
import {
  login, //登录
} from '../../services/login/loginService';
import { parse, } from 'qs';
import { message, } from 'antd';

export default {
  namespace: 'login',

  state: {
    initData: {},
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, }) => {
        if (pathname == '/') {
          dispatch({
            type: 'updateState',
            payload: {
              initData: window._init_data || {},
            },
          });
        }
      });
    },
  },

  effects: {
    //登录
    *login({ payload, }, { call, }) {
      const { ret, } = yield call(login, parse(payload));
      if (ret && ret.errorCode == '9000') {
        message.success('登陆成功', 3);
        window.location = BASE_URL;
      } else if (ret && ret.errorMessage) {
        message.error((ret && ret.errorMessage) || '登陆失败');
      } else {
        message.error('您的网络状况不佳，请检查网络情况');
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
