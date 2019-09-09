/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Tabs, message, } from 'antd';
import StaffManageComponent from '../../../components/common/new-component/manager-list/ManagerList';
import StaffCreate from './StaffCreate';
import ResetPassword from '../../../components/setting/staff-manage/ResetPassword';
import RoleManageList from '../../../components/setting/role-manage/RoleManageList';
import styles from './StaffManage.less';

const TabPane = Tabs.TabPane;

function StaffManage({ dispatch, StaffManageModel, }) {
  const {
    /*搜索*/
    searchContent, //搜索内容

    /*表格项*/
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,

    /*重置密码*/
    resetVisible,
    resetLoading,

    /*角色管理*/
    allRoleList, //页面左边角色列表内容
    allRoleListLoading, //页面左边角色列表是否加载中

    allFunctionList, //页面右边功能列表内容
    secondFunctionArray, //页面右边默认打开的二级菜单的菜单列表数组
    roleFunctionArray, //每个角色所拥有的权限ID数组(选中)
    allFunctionListLoading, //页面右边功能列表是否加载中
    wetherRoleItemChooseIndex, //角色被选中查看的索引
    clickedName, //被选中角色名字(用于显示于权限右边)

    roleProperty, //角色属性 包括id,name等
    roleListItemIndex, //角色列表项重命名项索引(遍历时产生,打开重命名输入框)
    createingRoleVisible, //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
    createNameOrRenameContent, //角色名称新建或重命名已有角色名称时输入框内的值
  } = StaffManageModel;

  /*切换tab*/
  function changeTab(activeKey) {
    if (activeKey == 'staff') {
      dispatch({
        type: 'StaffManageModel/queryShopUser',
        payload: {
          pageIndex: 0,
          pageSize: 20,
        },
      });
    } else if (activeKey == 'role') {
      dispatch({
        type: 'StaffManageModel/searchAllRoleList',
      });
    }
  }

  /*搜索*/
  function searchFunction(values) {
    dispatch({
      type: 'StaffManageModel/queryShopUser',
      payload: {
        searchContent: values,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'StaffManageModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }

  /*新增/编辑员工*/
  function addStaff(type, id) {
    if (type == '1') {
      dispatch({
        type: 'StaffCreateModel/addStaff',
        payload: {
          createVisible: true,
          modalType: type,
          mgrShops: [],
        },
      });
    } else if (type == '2') {
      dispatch({
        type: 'StaffCreateModel/getShopUser',
        payload: {
          id,
        },
      });
    }
  }

  /*删除员工*/
  function deleteStaff() {
    if (!!selectedRows) {
      let isAdmin = false;
      selectedRows.map(item => {
        if (item.sysUser) {
          isAdmin = true;
        }
      });
      if (isAdmin) {
        message.error('系统管理员禁止删除');
      } else {
        dispatch({
          type: 'StaffManageModel/deleteStaff',
        });
      }
    }
  }

  /*重置密码*/
  function resetPwd() {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        resetVisible: true,
      },
    });
  }

  /*取消重置*/
  function cancelReset() {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        resetVisible: false,
      },
    });
  }

  /*确认重置*/
  function confirmReset() {
    dispatch({
      type: 'StaffManageModel/reset',
    });
  }

  /*刷新列表*/
  function refresh() {
    dispatch({
      type: 'StaffManageModel/queryShopUser',
      payload: {
        pageIndex: 0,
        pageSize,
        searchContent,
      },
    });
  }

  /*表格属性*/
  const StaffManageComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'name', type: 'input', placeholder: '请输入员工姓名', },
        { key: 'mobile', type: 'input', placeholder: '请输入员工手机号', },
      ],
    },
    rightBars: {
      btns: [
        {
          label: '新增员工',
          handle: addStaff.bind(this, '1'),
        },
      ],
      isSuperSearch: false,
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      changeColumns: changeColumns,
      isTab: true,
      rowKey: 'id',
      columns: [
        {
          dataIndex: 'name',
          key: 'name',
          title: '员工姓名',
          width: '96px',
          render: (text, record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {!record.sysUser ? (
                <a onClick={addStaff.bind(this, '2', record.id)}>{text}</a>
              ) : (
                text
              )}
            </Popover>
          ),
        },
        {
          dataIndex: 'mobile',
          key: 'mobile',
          title: '员工手机',
          width: '96px',
          render: (text, _record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              <span>{text}</span>
            </Popover>
          ),
        },
        {
          dataIndex: 'acct',
          key: 'acct',
          title: '账号',
          width: '160px',
          render: (text, _record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'shops',
          key: 'shops',
          title: '管辖游乐园',
          width: '220px',
          render: (text, _record) => (
            <Popover
              content={
                <div>
                  {text &&
                    text.map(item => {
                      return <p key={'shops_' + item.id}>{item.name}</p>;
                    })}
                </div>
              }
              placement="top"
              trigger="click"
            >
              <a>{!!text ? text.length + '个' : '0个'}</a>
            </Popover>
          ),
        },
      ],
      rowSelection: {
        selectedRowKeys: selectedRowKeys,
        onChange: rowSelectChange,
      },
    },
    pagination: {
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: pageOnChange,
      onChange: pageOnChange,
    },
    leftBars: {
      label: '已选',
      labelNum: selectedRowKeys.length,
      btns: [
        {
          label: '删除',
          handle: deleteStaff,
          confirm: true,
        },
        {
          label: '重置密码',
          handle: resetPwd,
        },
      ],
    },
  };

  /*重置密码*/
  const ResetPasswordProps = {
    resetVisible,
    cancelReset,
    confirmReset,
    resetLoading,
  };

  /**********************************角色管理***************************************/
  /*右边功能列表节点展开事件*/
  const FunctionListOnExpend = function(expandedKeys) {
    //        console.info('expandedKeys',expandedKeys);
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        secondFunctionArray: expandedKeys,
      },
    });
  };

  /*右边功能列表节点checkbox选中事件*/
  const FunctionListOnCheck = function(checkedKeys, e) {
    console.info('checkedKeys', checkedKeys);
    console.info('eeeeeeee---e.node.props.eventKey', e.node.props.eventKey);

    const checkedIds = checkedKeys;

    if (e.node.props.hasChildren != '1') {
      /*判断是否显示页面*/
      if (e.node.props.isTrue == '1' && !e.checked) {
        let removeIndex = null;
        let removeKey = null;
        allFunctionList &&
          allFunctionList.map((item, index) => {
            item.menus &&
              item.menus.map((menu, key) => {
                if (menu.id == e.node.props.eventKey) {
                  removeIndex = index;
                  removeKey = key;
                }
              });
          });
        if (removeIndex != null && removeKey != null) {
          allFunctionList[removeIndex].menus[removeKey].map(opt => {
            const index = checkedIds.indexOf(opt.id + '');
            if (index > -1) {
              checkedIds.splice(index, 1);
            }
          });
        }
      }

      /*是否能选择*/
      if (e.node.props.isTrue != '1' && !!e.checked) {
        let trueIndex = null;
        let trueKey = null;
        allFunctionList &&
          allFunctionList.map((item, index) => {
            item.menus &&
              item.menus.map((menu, key) => {
                if (menu.id == e.node.props.eventKey) {
                  trueIndex = index;
                  trueKey = key;
                }
                // menu.opts &&
                //   menu.opts.map((opt, _num) => {
                //     if (opt.id == e.node.props.eventKey) {
                //       trueIndex = index;
                //       trueKey = key;
                //     }
                //   });
              });
          });

        const keyId = undefined;
        console.log('truekey', trueIndex, trueKey);
        // allFunctionList[trueIndex].menus[trueKey].map(opt => {
        //   if (opt.key_word == '1') {
        //     keyId = opt.id + ''; //获取当前的页面id
        //     if (!!keyId && checkedKeys.indexOf(keyId) == -1) {
        //       checkedIds.splice(checkedKeys.indexOf(e.node.props.eventKey), 1);
        //     }
        //   }
        // });
      }
    }

    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        roleFunctionArray: checkedIds,
        halfKeys: e.halfCheckedKeys,
      },
    });
  };

  /*点击角色名称所在行查看角色所属权限*/
  const CheckRoleFunction = function(item, index) {
    console.log('查看roles---', item.id);
    dispatch({
      type: 'StaffManageModel/showRoleFuncs',
      payload: {
        id: item.id,
        index,
      },
    });
  };

  /*角色名称下点击新建按钮*/
  const CreateRole = function() {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        createingRoleVisible: true,
      },
    });
  };

  /*角色名称下点击复制按钮*/
  const CopyRoleItem = function(id, name) {
    if (name.length > 9) {
      message.warn('当前角色名过长，不允许复制');
    } else {
      dispatch({
        type: 'StaffManageModel/CopyRole',
        payload: {
          id: id,
          index: allRoleList.length,
        },
      });
    }
  };

  /*点击角色名称下的删除按钮*/
  const DeleteRoleItem = function(id) {
    dispatch({
      type: 'StaffManageModel/DeleteRole',
      payload: {
        id,
      },
    });
  };

  /*取消新建角色名称*/
  const CancelCreate = function() {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        createingRoleVisible: false,
      },
    });
  };

  /*新建角色名称提交*/
  const CreateSubmit = function() {
    if (
      createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, '').length > 0 &&
      createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, '').length < 13
    ) {
      dispatch({
        type: 'StaffManageModel/CreateRole',
        payload: {
          name: createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, ''),
          index: allRoleList.length,
        },
      });
    } else {
      message.warn('请检查角色名是否为空或者过长(不超过12位)');
    }
  };

  /*新增角色或重命名已有角色输入框改变时回调*/
  const CreateOrRenameOnChange = function(e) {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        createNameOrRenameContent: e.target.value,
      },
    });
  };

  /*已有角色名称点击重命名*/
  const RenameRoleName = function(item, index) {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        roleListItemIndex: index,
        createNameOrRenameContent: item.name,
      },
    });
  };

  /*已有角色名称取消重命名*/
  const CancelRename = function() {
    dispatch({
      type: 'StaffManageModel/updateState',
      payload: {
        roleListItemIndex: '',
        createNameOrRenameContent: '',
      },
    });
  };

  /*已有角色名称重命名提交*/
  const RenameSubmit = function(item, index) {
    if (
      createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, '').length > 0 &&
      createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, '').length < 16
    ) {
      dispatch({
        type: 'StaffManageModel/RenameRole',
        payload: {
          id: item.id,
          name: createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, ''),
          index,
        },
      });
    } else {
      message.warn('请检查角色名是否填写或者过长(不超过15位)');
    }
  };

  /*权限保存*/
  const SaveRoleFunction = function() {
    if (roleProperty.roleType != 'admin') {
      if (createingRoleVisible == false) {
        console.log('allFunctionList保存校验', roleFunctionArray);
        // allFunctionList
        if (roleFunctionArray.length == 0) {
          return message.warn('至少选择一个角色权限');
        }
        dispatch({
          type: 'StaffManageModel/SaveRoleFunction',
          payload: {
            name: roleProperty.name,
            id: roleProperty.id,
            index: wetherRoleItemChooseIndex,
          },
        });
      } else {
        message.warn('请角色操作完毕后再修改权限');
      }
    } else {
      message.error('系统默认角色不能被修改');
    }
  };

  const roleManageListProps = {
    allRoleList, //页面左边角色列表内容
    allRoleListLoading, //页面左边角色列表是否加载中
    allFunctionList, //页面右边功能列表内容
    secondFunctionArray, //页面右边默认打开的二级菜单的菜单列表数组
    roleFunctionArray, //每个角色所拥有的权限ID数组(选中)
    allFunctionListLoading, //页面右边功能列表是否加载中
    wetherRoleItemChooseIndex, //角色被选中查看的索引
    clickedName, //被选中角色名字(用于显示于权限右边)

    FunctionListOnExpend, //右边功能列表节点展开事件
    FunctionListOnCheck, //右边功能列表节点选中checkbox事件

    CheckRoleFunction, //点击角色名称所在行查看角色所属权限
    RenameRoleName, //已有角色名称点击重命名
    roleListItemIndex, //角色列表项重命名项索引(遍历时产生,打开重命名输入框)
    CancelRename, //取消重命名角色名称
    RenameSubmit, //重命名角色名称提交

    CreateOrRenameOnChange, //新增角色或者重命名已有角色输入框改变时回调

    createingRoleVisible, //是否在新建角色名称时(判断是否动态添加一个输入框)
    CreateRole, //点击角色名称下的新增按钮
    CopyRoleItem, //点击角色名称下的复制按钮
    DeleteRoleItem, //点击角色名称下的删除按钮
    CancelCreate, //取消新建角色名称
    CreateSubmit, //新建角色名称提交
    SaveRoleFunction, //权限保存
  };

  /*员工权限*/
  const staff =
    window._init_data.opts.indexOf('17600') != -1 ? (
      <TabPane key="staff"
        tab="员工管理"
      >
        <StaffManageComponent {...StaffManageComponentProps} />
        <StaffCreate refresh={refresh} />
        <ResetPassword {...ResetPasswordProps} />
      </TabPane>
    ) : null;

  /*角色权限*/
  const role =
    window._init_data.opts.indexOf('17700') != -1 ? (
      <TabPane key="role"
        tab="角色管理"
      >
        <RoleManageList {...roleManageListProps} />
      </TabPane>
    ) : null;

  return (
    <div
      className="content_tabs role_tabs_auto"
      style={{ height: '100%', overflow: 'hidden', }}
    >
      <Tabs onChange={changeTab}
        type="card"
      >
        {staff}
        {role}
      </Tabs>
    </div>
  );
}

function mapStateToProps({ StaffManageModel, }) {
  return { StaffManageModel, };
}

export default connect(mapStateToProps)(StaffManage);
