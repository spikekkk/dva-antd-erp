import './index.html';
import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import 'babel-polyfill';
//import '../../assets/iconfont/iconfont.css';
import '../../utils/request';
import './index.css';
import { routerRedux, } from 'dva/router';
import { message, LocaleProvider, Modal, } from 'antd';

window.BASE_URL = window.BASE_URL || '/spread';
// window.BASE_URL = window.BASE_URL || '/saas-ssp';

window.LODOP; //Lodp 本地打印
window.hasInitMenu = false;
window.changeHeadMenu, window.changeLeftMenu; //变更头部菜单函数，变更侧边栏菜单

import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

//判断当前浏览器类型
const explorer = window.navigator.userAgent.toLowerCase();
//ie
if (explorer.indexOf('msie') > -1) {
  window.currentKernel = '-ms-';
}
//firefox
else if (explorer.indexOf('firefox') > -1) {
  window.currentKernel = '-moz-';
}
//Chrome
else if (explorer.indexOf('chrome') > -1) {
  window.currentKernel = '-webkit-';
}
//Opera
else if (explorer.indexOf('opera') > -1) {
  window.currentKernel = '-o-';
}
//Safari
else if (explorer.indexOf('safari') > -1) {
  window.currentKernel = '-webkit-';
}

message.config({
  duration: 3,
});
/*
 * 前端缓存数据
 * orgPermissionList array 当前登陆用户的机构权限
 * firstOrg object 第一家机构
 * signBySelf object 自主签到的数据
 */
window._init_data = {};

/*
 * 微活动 相关工具方法
 */
window.timer;
window.gameIframeCloseAction; //关闭窗口
window.gameIframeCloseAndRefreshAction; //关闭窗口并刷新

// 1. Initialize
const app = dva({
  onError(e, dispatch) {
    if (e.message.indexOf('登录') > -1) {
      Modal.confirm({
        title: '登录超时，请重新登录系统',
        content: '是否返回登录页面？',
        onOk() {
          sessionStorage.removeItem('isLogin');
          dispatch({
            type: 'indexLayout/updateState',
            payload: {
              isLogin: false,
            },
          });
          dispatch(routerRedux.push('/'));
        },
      });
    } else {
      console.error(e);
    }
  },
});

// 2. Model
/*基础*/
app.model(require('../../models/index-layout/indexLayout'));
app.model(require('../../models/home/home'));

/*会员卡管理*/

app.model(require('../../models/memberCard-manage/memberCardManageModel'));
app.model(require('../../models/memberCard-manage/hqSupercardGoodsModel'));
app.model(require('../../models/memberCard-manage/hqSupercardGoodsAuditModel'));
/*积分商城*/

/*订单管理*/
app.model(require('../../models/order-manage/memberCardOrdersModel')); //会员卡订单
app.model(require('../../models/order-manage/thresholdControlModel')); //限额
app.model(
  require('../../models/order-manage/cancelAppointOrderManage')
); /*会员卡预约订单管理*/
app.model(
  require('../../models/order-manage/platformAppointOrderManage')
); /*出票后取消的预约单/

/*门店订单管理*/
app.model(require('../../models/shop-order/shopAppointOrdersModel')); //门店会员卡订单

/*门店管理*/
app.model(require('../../models/shop-manage/shopManageModel'));
/*门店入住信息*/
app.model(require('../../models/shop-entry/shopEntryInforModel'));
/*设置*/
app.model(require('../../models/setting/otherManageModel'));
app.model(require('../../models/setting/staffManage'));
app.model(require('../../models/setting/staffCreate'));
//会员管理
app.model(require('../../models/vip-manage/vipManageModel'));

// 3. Router
app.router(require('./router'));

// 4. Start
//app.start('#root');
const App = app.start();

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <App />
  </LocaleProvider>,
  document.getElementById('root')
);
