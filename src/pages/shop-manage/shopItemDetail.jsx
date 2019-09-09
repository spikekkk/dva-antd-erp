import React from 'react';
import { connect, } from 'dva';
import ShopDetailComponent from '../../components/shop-manage/shopDetailComponent';
import { routerRedux, } from 'dva/router';
function ShopDetailPage({ dispatch, shopDetailModel, }) {

  const { shopDetailMess, detailLoading, } = shopDetailModel;

  function navigateBack() {
    dispatch(routerRedux.goBack());
  }
  const shopDetailMessProps = {
    ...shopDetailMess,
    detailLoading,
    navigateBack,
  };
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <div style={{ position: 'relative', height: 'calc(100% - 42px)', }}>
        <ShopDetailComponent {...shopDetailMessProps} />
      </div>
    </div>
  );
}
function mapStateToProps({ shopDetailModel, }) {
  return { shopDetailModel, };
}

export default connect(mapStateToProps)(ShopDetailPage);
