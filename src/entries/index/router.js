/* eslint-disable no-unused-vars */
import React from 'react';
import { Router, Route, IndexRoute, } from 'dva/router';

/***********************************基础配置*******************************************************************************************/
import IndexLayout from '../../pages/index-layout/IndexLayout';
import Home from '../../pages/home/Home';
import NotFound from '../../components/common/not-found/NotFound';

/***********************************会员卡卡管理*******************************************************************************************/

import MemberCardManage from '../../pages/member-card-manage/memberCardManage';
import HqSupercardGoods from '../../pages/member-card-manage/memberCardGoods';
import HqSupercardGoodsAudit from '../../pages/member-card-manage/memberCardGoodsAudit';
/*门店管理 */
import ShopManagePage from '../../pages/shop-manage/shopManage.jsx';

/***********************************订单管理*******************************************************************************************/
import ThresholdControl from '../../pages/order-manage/thresholdControl'; //会员卡限额管理
import memberCardOrders from '../../pages/order-manage/memberCardOrders'; //会员卡订单
import AppointOrderManage from '../../pages/order-manage/platformAppointOrderManage.jsx'; //会员卡预约订单
import CancelAppointOrder from '../../pages/order-manage/cancelAppintOrderManage'; //出票后取消的预约订单

/***********************************门店订单管理*******************************************************************************************/
import shopAppointOrder from '../../pages/shop-order/shopAppointOrder'; //门店预约订单管理
/***********************************门店入驻设置*******************************************************************************************/
import shopEntry from '../../pages/shop-entry/shopEntryInfor';

/***********************************设置*******************************************************************************************/
import OtherManage from '../../pages/setting/other-setting/OtherManage'; //其他设置
import StaffManage from '../../pages/setting/staff-setting/StaffManage'; //员工设置

import VipManage from '../../pages/vip-manage/vipManage';
import ChangeVipInfo from '../../pages/vip-manage/changeVipInfo';

function RouterConfig({ history, }) {
  return (
    <Router history={history}>
      <Route component={IndexLayout}
        path="/"
      >
        //会员管理
        <Route>
          //会员管理
          <Route component={VipManage}
            path="/zyg_vip"
          />
          //修改会员身份审核
          {/* <Route component={ChangeVipInfo}
            path="//zyg_vip_id_card"
          /> */}
        </Route>
        //会员卡管理
        <Route>
          <Route component={MemberCardManage}
            path="/zyg_memberCard_manage"
          />
          <Route
            component={HqSupercardGoodsAudit}
            path="/zyg_hqsupercard_goodsAudit"
          />
          //平台会员卡商品
          <Route component={HqSupercardGoods}
            path="/zyg_hqsupercard_goods"
          />
        </Route>
        //订单管理
        <Route>
          //会员卡限额阈值管理
          <Route component={ThresholdControl}
            path="/zyg_order_threshold"
          />
          //预约订单管理
          <Route
            component={AppointOrderManage}
            path="/zyg_appoint_order_manage"
          />
          <Route component={memberCardOrders}
            path="/zyg_vip_order_manage"
          />
          <Route component={CancelAppointOrder}
            path="/zyg_cancel_order_manage"
          />
        </Route>
        //门店订单
        <Route>
          <Route
            component={shopAppointOrder}
            path="/zyg_shop_appoint_order_manage"
          />
        </Route>
        <Route component={ShopManagePage}
          path="/zyg_shop_manage"
        />
        //设置
        <Route>
          <Route component={OtherManage}
            path="/zyg_set_other"
          />
          <Route component={StaffManage}
            path="/zyg_set_staff"
          />
        </Route>
        //门店入驻
        <Route>
          <Route component={shopEntry}
            path="/zyg_shop_entry"
          />
        </Route>
        <Route component={NotFound}
          path="/*"
        />
      </Route>
    </Router>
  );
}

export default RouterConfig;
