import React from 'react';
import { connect, } from 'dva';
import { routerRedux, } from 'dva/router';
import IndexLayoutComponent from '../../components/index-layout/IndexLayoutComponent';
import ResetPwd from '../../components/index-layout/ResetPwd';
import WaitPage from '../../components/index-layout/WaitPage';
import Login from '../login/LoginPage';

function IndexLayout({ dispatch, indexLayout, children, }) {
  const {
    subMuneKeys, //父级菜单key数组
    currentMenuKey, //当前子菜单key
    menuList, //菜单列表
    tabList, //历史页面
    tabKey, //当前页面key
    currentShop, //当前园区
    passCount, //审核通过的信息
    refuseCount, //审核拒绝的信息
    goodsName,
    shopList, //通过登录人获取所管辖的游乐园
    activeShop,
    hasInitMenu, //菜单加载完成

    visible, //修改密码
    loading,

    isLogin,
    waitHandleCount,
  } = indexLayout;

  /*菜单选择*/
  function onSelect(item) {
    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        currentMenuKey: item.key,
        tabKey: item.key,
      },
    });

    let sameKey = false;
    tabList.map(tab => {
      if (tab.key == item.key) {
        sameKey = true;
      }
    });
    if (currentMenuKey != item.key && !sameKey) {
      // eslint-disable-next-line no-use-before-define
      addTab(
        item.item.props.children,
        item.key,
        item.item.props.subMenuKey.split('-')[0]
      ); //增加tab页
    }

    dispatch(
      routerRedux.push({
        pathname: item.key,
      })
    );
  }

  /*使当前展开的菜单有且只有一项*/
  function onOpenChange(item) {
    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        subMuneKeys: item[item.length - 1],
      },
    });
  }
  /*密码修改*/
  function ChangePassWord() {
    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        visible: true,
      },
    });
  }

  /*切换页签*/
  function changeRoute(key, parentKey) {
    if (key != tabKey) {
      dispatch({
        type: 'indexLayout/updateState',
        payload: {
          currentMenuKey: key,
          tabKey: key,
          subMuneKeys: parentKey,
        },
      });
      dispatch(routerRedux.push(key));
    }
  }

  /*增加页签*/
  function addTab(title, key, parentKey) {
    const tabs = tabList;
    tabs.length > 0 ? tabs.push({ title, key, parentKey, }) : null;
    sessionStorage.setItem('tabList', JSON.stringify(tabs));

    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        tabList: tabs,
      },
    });
  }

  /*删除页签*/
  function closeTab(key, e) {
    e.stopPropagation();
    const tabs = tabList;
    let lastKey = '';
    let parentKey = '';
    tabs.map((tab, index) => {
      if (tab.key == key) {
        lastKey =
          tabKey != tabs[index].key
            ? tabKey
            : index != 0
              ? tabs[index - 1].key
              : tabs[index + 1].key;
        parentKey =
          tabKey != tabs[index].key
            ? parentKey
            : index != 0
              ? tabs[index - 1].parentKey
              : tabs[index + 1].parentKey;
        tabs.splice(index, 1);
      }
    });
    sessionStorage.setItem('tabList', JSON.stringify(tabs));

    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        tabList: tabs,
        currentMenuKey: lastKey,
        tabKey: lastKey,
        subMuneKeys: parentKey,
      },
    });
    dispatch(routerRedux.push(lastKey));
  }

  /*取消*/
  function cancelCreate() {
    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        visible: false,
      },
    });
  }

  /*确认*/
  function confirmCreate(values) {
    dispatch({
      type: 'indexLayout/updateShopUser',
      payload: {
        ...values,
      },
    });
  }

  /*改变当前游乐园*/
  function changeShop(item) {
    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        activeShop: item,
      },
    });
  }

  function toDefaultRoute() {
    dispatch({
      type: 'indexLayout/updateState',
      payload: {
        currentMenuKey: '/zyg_cancel_order_manage',
        tabKey: '/zyg_cancel_order_manage',
      },
    });

    let sameKey = false;
    tabList.map(tab => {
      if (tab.key == '/zyg_cancel_order_manage') {
        sameKey = true;
      }
    });
    if (currentMenuKey != '/zyg_cancel_order_manage' && !sameKey) {
      // eslint-disable-next-line no-use-before-define
      addTab(
        '出票后取消的预约单',
        '/zyg_cancel_order_manage',
        '/zyg_order'
      ); //增加tab页
    }

    dispatch(
      routerRedux.push({
        pathname: '/zyg_cancel_order_manage',
      })
    );
  }

  /*注销*/
  const logout = () => {
    dispatch({
      type: 'indexLayout/logout',
    });
  };

  /*NewTabs属性*/
  const NewTabsProps = {
    changeRoute,
    closeTab,

    tabList, //历史页面
    tabKey, //当前页面key
  };

  /*布局组件属性*/
  const IndexLayoutComponentProps = {
    children,

    currentShop, //当前园区
    passCount, //审核通过的信息
    refuseCount, //审核拒绝的信息
    shopList, //通过登录人获取所管辖的游乐园
    activeShop,
    goodsName,

    /*方法*/
    onSelect,
    onOpenChange,
    ChangePassWord,
    changeShop,
    logout,

    /*菜单*/
    subMuneKeys, //父级菜单key数组
    currentMenuKey, //当前子菜单key
    menuList, //菜单列表

    /*tab页*/
    NewTabsProps,

    toDefaultRoute,

    waitHandleCount,
  };

  const reset = {
    visible, //修改密码
    loading,

    cancelCreate,
    confirmCreate,
  };

  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      {!isLogin ? (
        <Login />
      ) : !hasInitMenu ? (
        <WaitPage />
      ) : (
        <IndexLayoutComponent {...IndexLayoutComponentProps} />
      )}
      {!!visible ? <ResetPwd {...reset} /> : null}
    </div>
  );
}

function mapStateToProps({ indexLayout, }) {
  return { indexLayout, };
}

export default connect(mapStateToProps)(IndexLayout);
