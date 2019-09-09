import React from 'react';
import { Router, Route, IndexRedirect, } from 'dva/router';

import VipManage from '../../pages/supercard-manage/memberCardManage';

export default function({ history, }) {
  return (
    <Router history={history}>
      <Route component={VipManage}
        path="/"
      />
      <Route component={VipManage}
        path="/*"
      >
        <IndexRedirect to="/" />
      </Route>
    </Router>
  );
}
