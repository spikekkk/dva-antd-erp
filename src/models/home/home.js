/* eslint-disable no-empty */
import { Test, } from '../../services/home/home';

export default {
  namespace: 'home',

  state: {},

  subscriptions: {
    setup({ history, }) {
      history.listen(({ pathname, }) => {
        if (pathname == '/') {
        }
      });
    },
  },

  effects: {
    // eslint-disable-next-line no-unused-vars
    *Test({ call, }) {},
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
