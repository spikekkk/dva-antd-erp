import React from 'react';
import { connect, } from 'dva';
import { routerRedux, } from 'dva/router';
import CommonLayoutComponent from '../../../components/common/common-layout/CommonLayoutComponent';

function CommonLayout({
  dispatch,
  commonLayoutModel,
  children,
  location,
  routes,
}) {
  const { collapsed, width, collapsedWidth, } = commonLayoutModel;

  const commonLayoutProps = {
    children,
    collapsed,
    width,
    collapsedWidth,
    location,
    routes,
    dispatch,
  };
  return <CommonLayoutComponent {...commonLayoutProps} />;
}

function mapStateToProps({ commonLayoutModel, }) {
  return { commonLayoutModel, };
}

export default connect(mapStateToProps)(CommonLayout);
