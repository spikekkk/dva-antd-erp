/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Popover, } from 'antd';
import { BlockTitle, } from '../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './RoleManage.less';
const TreeNode = Tree.TreeNode;

/*角色管理*/
function RoleManageList({
  allRoleList, //页面左边所有角色列表内容
  allRoleListLoading, //页面左边所有角色列表内容是否加载中
  allFunctionList, //页面右边功能列表内容
  secondFunctionArray, //页面右边默认打开的二级菜单的菜单列表数组
  roleFunctionArray, //每个角色所拥有的权限ID数组
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
}) {
  /*左边角色列表数据*/
  let childrenRoleList = [];
  if (allRoleList && allRoleList.length > 0) {
    childrenRoleList = allRoleList.map((item, index) => {
      //判断是否管理员(if中是是管理员的条件)
      if ('admin' == item.roleType) {
        //判断是否被选中查看
        return (
          <div
            className={
              wetherRoleItemChooseIndex == index
                ? styles.roleNameCheck
                : styles.roleNameUnCheck
            }
            key={item.id}
            onClick={() => CheckRoleFunction(item, index)}
          >
            <span style={{ marginLeft: '5px', }}>{item.name}(系统管理员)</span>
            <a
              onClick={() => CopyRoleItem(item.id, item.name)}
              style={{ float: 'right', fontSize: '12px', }}
            >
              复制
            </a>
          </div>
        );
      } else {
        //判断是否被点击重命名(if中是未被查看的条件)
        if (roleListItemIndex == '' || roleListItemIndex != index) {
          //判断是否被选中查看
          if (wetherRoleItemChooseIndex == index) {
            return (
              <div
                className={styles.roleNameCheck}
                key={item.id}
                onClick={() => CheckRoleFunction(item, index)}
              >
                <span style={{ marginLeft: '5px', }}>{item.name}</span>
                <Popconfirm
                  cancelText="否"
                  okText="是"
                  onConfirm={() => DeleteRoleItem(item.id)}
                  placement="top"
                  title={
                    <span>
                      删除将导致该角色不可用，确定要删除
                      <strong style={{ color: 'red', }}>{item.name}</strong>吗？
                    </span>
                  }
                >
                  <a
                    style={{
                      float: 'right',
                      marginLeft: '10px',
                      color: '#27AEDF',
                      fontSize: '12px',
                    }}
                  >
                    删除
                  </a>
                </Popconfirm>
                <a
                  className={styles.copy_or_rename}
                  onClick={() => CopyRoleItem(item.id, item.name)}
                >
                  复制
                </a>
                <a
                  className={styles.copy_or_rename}
                  onClick={() => RenameRoleName(item, index)}
                >
                  重命名
                </a>
              </div>
            );
          } else {
            return (
              <div
                className={styles.roleNameUnCheck}
                key={item.id}
                onClick={() => CheckRoleFunction(item, index)}
              >
                <span style={{ marginLeft: '5px', }}>{item.name}</span>
                <Popconfirm
                  cancelText="否"
                  okText="是"
                  onConfirm={() => DeleteRoleItem(item.id)}
                  placement="top"
                  title={
                    <span>
                      删除将导致该角色不可用，确定要删除
                      <strong style={{ color: 'red', }}>{item.name}</strong>吗？
                    </span>
                  }
                >
                  <a
                    style={{
                      float: 'right',
                      marginLeft: '10px',
                      fontSize: '12px',
                    }}
                  >
                    删除
                  </a>
                </Popconfirm>
                <a
                  className={styles.copy_or_rename}
                  onClick={() => CopyRoleItem(item.id, item.name)}
                >
                  复制
                </a>
                <a
                  className={styles.copy_or_rename}
                  onClick={() => RenameRoleName(item, index)}
                >
                  重命名
                </a>
              </div>
            );
          }
        } else {
          return (
            <div key={item.id}>
              <QueueAnim
                className="common-search-queue"
                ease={['easeOutQuart', 'easeInOutQuart',]}
                type={['left', 'left',]}
              >
                <div
                  key="role_rename"
                  style={{
                    height: '40px',
                    lineHeight: '40px',
                    borderBottom: '1px solid #f8f8f8',
                    paddingLeft: 14,
                  }}
                >
                  <Input
                    defaultValue={item.name}
                    onChange={CreateOrRenameOnChange}
                    placeholder={item.name}
                    style={{ width: '175px', top: '-1px', fontSize: '14px', }}
                    type="text"
                  />
                  <a
                    onClick={() => CancelRename()}
                    style={{
                      float: 'right',
                      marginLeft: '10px',
                      fontSize: '12px',
                      marginRight: '10px',
                    }}
                  >
                    取消
                  </a>
                  <a
                    className={styles.copy_or_rename}
                    onClick={() => RenameSubmit(item, index)}
                  >
                    确定
                  </a>
                </div>
              </QueueAnim>
            </div>
          );
        }
      }
    });
  }

  /*右边权限列表数据*/
  const loopAllFunctionList = data =>
    data.map(item => {
      if (!!item.menus || !!item.opts) {
        if (item.mainMenu == true) {
          return (
            <TreeNode
              hasChildren="1"
              key={item.id}
              title={
                <span
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    lineHeight: '12px',
                  }}
                >
                  {item.name}
                </span>
              }
            >
              {loopAllFunctionList(item.menus)}
            </TreeNode>
          );
        } else {
          return (
            <TreeNode
              hasChildren="1"
              key={item.id}
              title={
                <span
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    lineHeight: '12px',
                  }}
                >
                  {item.name}
                </span>
              }
            >
              {loopAllFunctionList(item.opts)}
            </TreeNode>
          );
        }
      } else if (!!item.key_word && item.key_word == '1') {
        return (
          <TreeNode
            isTrue="1"
            key={item.id}
            title={
              <span style={{ fontSize: '12px', color: '#666', }}>
                {item.name}
              </span>
            }
          />
        );
      } else {
        return (
          <TreeNode
            key={item.id}
            title={
              <span style={{ fontSize: '12px', color: '#666', }}>
                {item.name}
              </span>
            }
          />
        );
      }
    });

  return (
    <div className={styles.all}>
      <div className={styles.left_area}>
        <div className={styles.block_title}>角色名称</div>
        <div className={styles.content}>
          <Spin spinning={allRoleListLoading}
            title="Loading"
          >
            {childrenRoleList || []}
            <QueueAnim
              className="common-search-queue"
              ease={['easeOutQuart', 'easeInOutQuart',]}
              type={['top', 'top',]}
            >
              {createingRoleVisible
                ? [
                  <div className={styles.createNewRole}
                    key="create_new_role"
                  >
                    <Input
                      autoFocus
                      onChange={CreateOrRenameOnChange}
                      placeholder="请输入新增角色名称"
                      style={{ width: '200px', fontSize: '14px', }}
                      type="text"
                    />
                    <div style={{ fontSize: '12px', }}>
                      <a onClick={() => CreateSubmit()}>确定</a>
                      <a
                        onClick={() => CancelCreate()}
                        style={{ margin: '0 10px 0 10px', }}
                      >
                          取消
                      </a>
                    </div>
                  </div>,
                ]
                : null}
            </QueueAnim>
          </Spin>
        </div>
        <Button
          disabled={!!createingRoleVisible ? true : false}
          onClick={CreateRole}
          style={{ float: 'right', }}
          type="primary"
        >
          新增
        </Button>
      </div>
      <div className={styles.right_area}>
        <div className={styles.block_title}>
          权限范围
          {clickedName != '' ? (
            <span className={styles.showRoleFunction}>
              (<span style={{ margin: '0 4px', }}>{clickedName}</span>)
            </span>
          ) : (
            ''
          )}
        </div>
        <div className={styles.contentRight}>
          <Spin spinning={allFunctionListLoading}
            title="Loading"
          >
            <Tree
              checkable
              checkedKeys={roleFunctionArray}
              expandedKeys={secondFunctionArray}
              onCheck={FunctionListOnCheck}
              onExpand={FunctionListOnExpend}
            >
              {loopAllFunctionList(allFunctionList) || []}
            </Tree>
          </Spin>
        </div>
        <Button
          onClick={SaveRoleFunction}
          style={{ float: 'right', }}
          type="primary"
        >
          保存
        </Button>
      </div>
    </div>
  );
}

export default RoleManageList;
