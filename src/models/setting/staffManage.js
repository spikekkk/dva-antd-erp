/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import {
  queryShopUser, //查询员工列表
  reset, //重置密码
  deleteStaff, //删除员工
  searchAllRoleList /*请求左边角色总览列表数据*/,
  searchAllFunction /*请求右边所有功能列表数据*/,
  RenameRole /*左边角色列表重命名角色*/,
  CopyRole /*左边角色列表复制角色*/,
  DeleteRole /*左边角色列表删除角色*/,
  CreateRole /*左边角色列表新增角色*/,
  SaveRoleFunction /*权限保存*/,
} from '../../services/setting/staffManageService';
import { uniqueArr, } from '../../utils/arrayUtils';
import { parse, } from 'qs';
import { message, } from 'antd';

export default {
  namespace: 'StaffManageModel',

  state: {
    /*搜索*/
    searchContent: {}, //搜索内容

    /*表格项*/
    loading: false,
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    selectedRowKeys: [],
    selectedRows: [],
    selectedRecordIds: [],

    /*重置密码*/
    resetVisible: false,
    resetLoading: false,

    /*角色管理*/
    allRoleList: [], //页面左边角色列表内容
    allRoleListLoading: false, //页面左边角色列表是否加载中

    allFunctionList: [], //页面右边功能列表内容
    secondFunctionArray: [], //页面右边默认打开的二级菜单的菜单列表数组
    roleFunctionArray: [], //每个角色所拥有的权限ID数组(选中)
    allFunctionListLoading: false, //页面右边功能列表是否加载中
    wetherRoleItemChooseIndex: '', //角色被选中查看的索引
    clickedName: '', //被选中角色名字(用于显示于权限右边)

    roleProperty: {}, //角色属性 包括id,name等
    roleListItemIndex: '', //角色列表项重命名项索引
    createingRoleVisible: false, //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
    createNameOrRenameContent: '', //角色名称新建或重命名已有角色名称时输入框内的值
    halfKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (
          pathname == '/zyg_set_staff' &&
          sessionStorage.getItem('isLogin') == '1'
        ) {
          if (
            !!window._init_data.opts &&
            window._init_data.opts.indexOf('16200') == -1
          ) {
            dispatch({
              type: 'searchAllRoleList',
            });
          } else {
            dispatch({
              type: 'queryShopUser',
              payload: {
                pageIndex: 0,
                pageSize: 20,
              },
            });
          }
        }
      });
    },
  },

  effects: {
    /********************************员工管理**************************************/
    //查询员工列表
    *queryShopUser({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryShopUser, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: ret.results,
            resultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
            selectedRows: [],
            selectedRowKeys: [],
            selectedRecordIds: [],
            searchContent,
            pageIndex,
            pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },

    //分页
    *pageChange({ payload, }, { select, call, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.StaffManageModel);
      yield put({
        type: 'queryShopUser',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },

    //重置密码
    *reset({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { resetLoading: true, }, });
      const state = yield select(state => state.StaffManageModel);
      const { ret, } = yield call(reset, {
        ids: state.selectedRowKeys.join(','),
      });
      if (ret && ret.errorCode == '9000') {
        message.success('重置密码成功');
        yield put({
          type: 'updateState',
          payload: {
            resetVisible: false,
            resetLoading: false,
          },
        });
        yield put({
          type: 'queryShopUser',
          payload: {
            pageIndex: 0,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '重置密码失败');
      }
    },

    //删除员工
    *deleteStaff({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.StaffManageModel);
      const { ret, } = yield call(deleteStaff, {
        id: state.selectedRowKeys.join(','),
      });
      if (ret && ret.errorCode == '9000') {
        message.success('删除成功');
        yield put({
          type: 'queryShopUser',
          payload: {
            pageIndex: 0,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '重置密码失败');
      }
    },

    /*********************************角色管理************************************/
    /*默认请求左边角色总览列表数据并展示管理员权限*/
    *searchAllRoleList({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLeftRoleListLoading', });
      const { ret, } = yield call(searchAllRoleList);
      if (ret && ret.errorCode === 9000) {
        console.log('获取的所有操作权限------', ret);
        const array = ret.results[0].menus; //默认展示管理员的权限
        const opts = ret.results[0].opts; //默认展示管理员的操作权限
        yield put({
          type: 'updateState',
          payload: {
            allRoleList: ret.results,
            roleProperty: ret.results[0], //选择管理员的角色属性
            wetherRoleItemChooseIndex: 0, //光标跳回管理员
            clickedName: ret.results[0].name, //管理员名称
          },
        });
        yield put({
          type: 'searchAllFunction',
          payload: {
            array: array, //保存默认打勾的菜单ID，等右边渲染完毕之后赋值
            opts: opts, //保存默认打勾的操作权限ID，等右边渲染完毕之后赋值
            roleProperty: ret.results[0],
          },
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeLeftRoleListLoading', });
    },

    /*默认请求右边所有功能列表数据(显示管理员权限)*/
    *searchAllFunction({ payload, }, { call, put, select, }) {
      yield put({ type: 'showRightFunctionListLoading', });
      const { ret, } = yield call(searchAllFunction);
      if (ret && ret.errorCode === 9000) {
        const array = [];
        for (const i in ret.results) {
          array.push(ret.results[i].id + '');
        }
        yield put({
          type: 'updateState',
          payload: {
            allFunctionList: ret.results,
            secondFunctionArray: array, //默认打开二级树结构
          },
        });

        yield put({
          type: 'showRoleFuncs',
          payload: {
            id: payload.roleProperty.id,
            index: 0,
          },
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeRightFunctionListLoading', });
    },

    /*操作之后的查询角色列表*/
    *AfterOperationSearchAllRoleList({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLeftRoleListLoading', });
      const { ret, } = yield call(searchAllRoleList);
      if (ret && ret.errorCode === 9000) {
        yield put({
          type: 'updateState',
          payload: {
            allRoleList: ret.results,
            roleProperty: ret.results[payload.wetherRoleItemChooseIndex],
          },
        });
        /*操作之后请求右边所有功能列表数据(显示当前权限)*/
        yield put({
          type: 'AfterOperationSearchAllFunction',
          payload: {
            ...payload,
            roleProperty: ret.results[payload.wetherRoleItemChooseIndex],
          },
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeLeftRoleListLoading', });
    },

    /*操作之后请求右边所有功能列表数据(显示当前权限)*/
    *AfterOperationSearchAllFunction({ payload, }, { call, put, select, }) {
      yield put({ type: 'showRightFunctionListLoading', });
      const { ret, } = yield call(searchAllFunction);
      if (ret && ret.errorCode === 9000) {
        const array = [];
        for (const i in ret.results) {
          array.push(ret.results[i].id + '');
        }

        yield put({
          type: 'updateState',
          payload: {
            allFunctionList: ret.results,
            secondFunctionArray: array, //默认打开二级树结构
            roleProperty: payload.roleProperty, //赋值当前选项的全部属性
            //roleFunctionArray :  treeFunctionList,                              //将选中项转成数组并赋值
            wetherRoleItemChooseIndex: payload.wetherRoleItemChooseIndex, //光标位置为当前位置
            clickedName: payload.clickedName, //显示在权限右边的角色名称
          },
        });

        yield put({
          type: 'showRoleFuncs',
          payload: {
            id: payload.roleProperty.id,
            index: payload.wetherRoleItemChooseIndex, //光标位置为当前位置
          },
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeRightFunctionListLoading', });
    },

    /*左边角色列表重命名角色*/
    *RenameRole({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLeftRoleListLoading', });
      const { id, name, } = payload;
      const { ret, } = yield call(RenameRole, { id, name, });
      if (ret && ret.errorCode === 9000) {
        message.success(ret.errorMessage);
        yield put({
          type: 'updateState',
          payload: {
            roleListItemIndex: '', //取消重命名输入框显示
            createNameOrRenameContent: '', //清空输入框内容，包括新增输入框和重命名输入框
          },
        });

        //                let menus = (ret.data).menus.concat((ret.data).opts);
        //                if(menus && menus.length > 0){
        //                    yield put({
        //                        type:'AfterOperationSearchAllRoleList',
        //                        payload:{
        //                            roleProperty : ret.data,                                //赋值当前选项的全部属性
        //                            roleFunctionArray : ((ret.data).resIds).split(","),     //将选中项转成数组并赋值
        //                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
        //                            clickedName : payload.name                              //显示在权限右边的角色名称
        //                        }
        //                    });
        //                }else{
        //                    yield put({
        //                        type:'AfterOperationSearchAllRoleList',
        //                        payload:{
        //                            roleProperty : ret.data,                                //赋值当前选项的全部属性
        //                            roleFunctionArray : [],                                 //将选中项转成数组并赋值
        //                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
        //                            clickedName : payload.name                              //显示在权限右边的角色名称
        //                        }
        //                    });
        //                }
        yield put({
          type: 'AfterOperationSearchAllRoleList',
          payload: {
            roleFunctionArray: [], //将选中项转成数组并赋值
            wetherRoleItemChooseIndex: payload.index, //光标位置为当前位置
            clickedName: payload.name, //显示在权限右边的角色名称
          },
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeLeftRoleListLoading', });
    },

    /*左边角色列表复制角色*/
    *CopyRole({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLeftRoleListLoading', });
      const { ret, } = yield call(CopyRole, { id: payload.id, });
      if (ret && ret.errorCode === 9000) {
        message.success('角色复制成功');
        //角色列表检索(跳到复制产生者的权限)
        const resIds =
          !!ret.data.menus && !!ret.data.opts
            ? ret.data.menus.split(',').concat(ret.data.opts.split(','))
            : [];
        if (resIds && resIds.length > 0) {
          yield put({
            type: 'AfterOperationSearchAllRoleList',
            payload: {
              roleProperty: ret.data, //赋值当前选项的全部属性
              roleFunctionArray: resIds, //将新增项转成数组并赋值
              wetherRoleItemChooseIndex: payload.index, //光标位置为当前位置
              clickedName: ret.data.name,
            },
          });
        } else {
          yield put({
            type: 'AfterOperationSearchAllRoleList',
            payload: {
              roleProperty: ret.data, //赋值当前选项的全部属性
              roleFunctionArray: [], //将新增项转成数组并赋值
              wetherRoleItemChooseIndex: payload.index, //光标位置为当前位置
              clickedName: ret.data.name,
            },
          });
        }
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeLeftRoleListLoading', });
    },

    /*左边角色列表删除角色*/
    *DeleteRole({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLeftRoleListLoading', });
      const { ret, } = yield call(DeleteRole, parse(payload));
      if (ret && ret.errorCode === 9000) {
        message.success('角色删除成功');
        //光标跳回管理员那项
        yield put({
          type: 'updateState',
          payload: {
            wetherRoleItemChooseIndex: 0, //光标跳回管理员
          },
        });
        //角色列表检索(跳会管理员权限)
        yield put({
          type: 'searchAllRoleList',
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeLeftRoleListLoading', });
    },

    /*左边角色列表新增角色*/
    *CreateRole({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLeftRoleListLoading', });
      const { ret, } = yield call(CreateRole, parse(payload));
      if (ret && ret.errorCode === 9000) {
        message.success('角色新增成功');
        //关闭新增输入框
        yield put({
          type: 'updateState',
          payload: {
            createingRoleVisible: false,
          },
        });
        //角色列表检索(跳到新增角色的权限)
        yield put({
          type: 'AfterOperationSearchAllRoleList',
          payload: {
            //                        roleProperty : ret.data,                                //赋值当前选项的全部属性
            roleFunctionArray: [], //将新增项转成数组并赋值(新增必然是没有权限)
            wetherRoleItemChooseIndex: payload.index, //光标位置为当前位置
            clickedName: payload.name,
          },
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeLeftRoleListLoading', });
    },

    /*权限保存*/
    *SaveRoleFunction({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLeftRoleListLoading', });

      const StaffManageModel = yield select(state => state.StaffManageModel);

      const { allFunctionList, roleFunctionArray, halfKeys, } = StaffManageModel;
      const menusList = []; //往后台传递的菜单项
      const optsList = []; //操作权限项

      function isCheck(item) {
        //判断当前节点是否选中
        if (
          roleFunctionArray.findIndex(x => {
            return x == item.id;
          }) > -1
        ) {
          menusList.push(item.id);
        }

        //是否有子节点
        if (item.menus && item.menus.length > 0) {
          const children = item.menus;

          children &&
            children.map(function(childItem) {
              if (
                roleFunctionArray.findIndex(x => {
                  return x == childItem.id;
                }) > -1
              ) {
                menusList.push(childItem.id);
              }

              if (childItem.opts && childItem.opts.length > 0) {
                childItem.opts &&
                  childItem.opts.map(opt => {
                    if (
                      roleFunctionArray.findIndex(x => {
                        return x == opt.id;
                      }) > -1
                    ) {
                      optsList.push(opt.id);
                    }
                  });
              }
            });
        }
      }

      allFunctionList &&
        allFunctionList.length > 0 &&
        allFunctionList.map(function(allItem) {
          isCheck(allItem);
        });

      menusList.push(halfKeys);
      const params = {
        menus: menusList.join(','),
        opts: optsList.join(','),
        id: payload.id,
        name: payload.name,
      };

      const { ret, } = yield call(SaveRoleFunction, parse(params));
      if (ret && ret.errorCode === 9000) {
        message.success('角色保存成功');
        yield put({ type: 'updateState', payload: { halfKeys: halfKeys, }, });
        yield put({
          type: 'AfterOperationSearchAllRoleList',
          payload: {
            //                        roleProperty : ret.data,                                //赋值当前选项的全部属性
            //                        roleFunctionArray : ((ret.data).resIds).split(","),     //讲选中项转成数组并赋值
            wetherRoleItemChooseIndex: payload.index, //光标位置为当前位置
            clickedName: payload.name,
          },
        });
      } else if (ret && ret.errorMessage) {
        ret && ret.errorMessage && message.error(ret.errorMessage);
      } else {
        message.error('您的网络状况不佳，请检查您的网络');
      }
      yield put({ type: 'closeLeftRoleListLoading', });
    },

    //        changeCheck({ payload }, { call, put, select }){
    //            let { roleFunctionArray, halfKeys } = payload;
    //            let array = roleFunctionArray.concat(halfKeys);
    //            yield put({
    //                type: 'updateState',
    //                payload: {
    //                    roleFunctionArray: roleFunctionArray
    //                }
    //            })
    //        }
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
    /****角色管理***/
    //左边角色列表加载中
    showLeftRoleListLoading(state, action) {
      return { ...state, ...action.payload, allRoleListLoading: true, };
    },
    //左边角色列表加载消失
    closeLeftRoleListLoading(state, action) {
      return { ...state, ...action.payload, allRoleListLoading: false, };
    },
    //右边功能列表加载中
    showLeftRoleListLoading(state, action) {
      return { ...state, ...action.payload, allFunctionListLoading: true, };
    },
    //右边功能列表加载消失
    closeLeftRoleListLoading(state, action) {
      return { ...state, ...action.payload, allFunctionListLoading: false, };
    },

    //根据角色编号渲染角色拥有的菜单项
    showRoleFuncs(state, action) {
      const { allFunctionList, allRoleList, } = state;
      const { id, index, } = action.payload;

      let roleFunctionArray = [];
      let clickedName = '';
      let roleProperty = {};
      allRoleList &&
        allRoleList.length > 0 &&
        allRoleList.map(function(roleItem) {
          if (roleItem.id == id) {
            // if (roleItem.menus.length > 0 && roleItem.opts.length > 0) {
            //   roleFunctionArray = roleItem.menus.concat(roleItem.opts);
            //   clickedName = roleItem.name;
            //   roleProperty = roleItem;
            // } else {
            //   roleFunctionArray = [];
            //   clickedName = roleItem.name;
            //   roleProperty = roleItem;
            // }
            console.log('roleFunctionArray1111', roleFunctionArray);

            roleFunctionArray = roleItem.menus;

            console.log('roleFunctionArray2222', roleFunctionArray);
            clickedName = roleItem.name;
            roleProperty = roleItem;
          }
        });

      const treeFunctionList = []; //tree勾选的菜单选项

      const isCheck = function(specialMenu) {
        //判断当前节点有没有被选中
        if (
          roleFunctionArray.findIndex(function(x) {
            return x == specialMenu.id;
          }) > -1
        ) {
          if (!!specialMenu.menus) {
            let menusNum = 0; //选中子菜单数量
            const noList = [];

            specialMenu.menus.map(item => {
              if (
                roleFunctionArray.findIndex(function(x) {
                  return x == item.id;
                }) > -1
              ) {
                menusNum += 1;
                treeFunctionList.push(item.id + '');
                // if (!!item.opts) {
                //   let optsNum = 0; //选中操作权限

                //   item.opts.map(opt => {
                //     if (
                //       roleFunctionArray.findIndex(function(x) {
                //         return x == opt.id;
                //       }) > -1
                //     ) {
                //       optsNum += 1;
                //       treeFunctionList.push(opt.id + ''); //选中的操作权限
                //     }
                //   });
                //   const allOpts = optsNum == item.opts.length; //所有操作权限选中
                //   if (allOpts) {
                //     treeFunctionList.push(item.id + '');
                //   } else {
                //     noList.push(specialMenu.id + '');
                //   }
                // }
              }
            });

            const allChecked = menusNum == specialMenu.menus.length; //所有菜单都选中
            const resList = [];
            if (allChecked) {
              treeFunctionList.push(specialMenu.id + '');
              uniqueArr(noList).map(child => {
                const index = treeFunctionList.indexOf(child);
                if (index > -1) {
                  treeFunctionList.splice(index, 1);
                }
              });
            }
          }
        }
      };

      for (const i in allFunctionList) {
        isCheck(allFunctionList[i]);
      }
      console.log('allFunctionList', allFunctionList);
      return {
        ...state,
        roleFunctionArray: treeFunctionList,
        wetherRoleItemChooseIndex: index,
        clickedName,
        roleProperty,
      };
    },
  },
};
