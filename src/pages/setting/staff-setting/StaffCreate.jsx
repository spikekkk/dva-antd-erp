import React from 'react';
import { connect, } from 'dva';
import StaffCreateComponent from '../../../components/setting/staff-manage/StaffCreateComponent';
import SelectPark from '../../../components/setting/staff-manage/SelectPark';

function StaffCreate({ dispatch, StaffCreateModel, refresh, }) {
  const {
    checkedall,
    createVisible,
    createLoading,
    parkVisible, //显示
    parkList, //游乐园列表
    searchparkList,
    mgrShops, //当前游乐园
    choose_mgrShops,
    record_mgrShops,//记录
    modalType, //弹窗类型
    userInfo, //员工信息
    roleList, //所有角色
  } = StaffCreateModel;

  //搜索管辖游乐园
  function searchParkFn(val){
    let new_choose_mgrShops=[];
    !!val && val.map(item=>{
      if(record_mgrShops.length > 0){
        record_mgrShops.map(ret=>{
          if(item.value == ret){
            new_choose_mgrShops.push(ret)
          }
        })
      }
    })
    dispatch({
      type: 'StaffCreateModel/updateState',
      payload: {
        searchparkList: val,
        choose_mgrShops:new_choose_mgrShops,
        checkedall:new_choose_mgrShops.length == val.length,
      },
    });
  }

  /*取消*/
  function cancelCreate() {
    dispatch({
      type: 'StaffCreateModel/updateState',
      payload: {
        createVisible: false,
      },
    });
  }

  /*确定*/
  function confirmCreate(values) {
    if (modalType == '1') {
      dispatch({
        type: 'StaffCreateModel/createShopUser',
        payload: {
          values,
          refresh,
        },
      });
    } else if (modalType == '2') {
      dispatch({
        type: 'StaffCreateModel/updateShopUser',
        payload: {
          values,
          refresh,
        },
      });
    }
  }

  /*显示管辖游乐园*/
  function showParkList() {
    dispatch({
      type: 'StaffCreateModel/showParkList',
      payload: {
        pageIndex: 0,
        pageSize: 100,
      },
    });
  }

  /*取消选择管辖游乐园*/
  function cancelPark() {
    dispatch({
      type: 'StaffCreateModel/updateState',
      payload: {
        parkVisible: false,
      },
    });
  }

  //每次点击都要保存
  function checkboxChangeFn(value){

    let newval=new Set(value)

    let newmy= new Set(choose_mgrShops)

    if(value.length < choose_mgrShops.length){

      let dfrcset = [...new Set([...newmy].filter(x => !newval.has(x)))];

      // console.log('取消',dfrcset);

      record_mgrShops.splice(record_mgrShops.findIndex(ret => ret == dfrcset[0]), 1)

    }else{

      let dfrcset = [...new Set([...newval].filter(x => !newmy.has(x)))];

      // console.log('勾上',dfrcset);

      record_mgrShops.push(dfrcset[0])

    }
    dispatch({
      type: 'StaffCreateModel/updateState',
      payload: {
        choose_mgrShops:value,
        record_mgrShops:Array.from(new Set(record_mgrShops)),
        checkedall:searchparkList.length == value.length
      },
    });
  }

  /*确定选择管辖游乐园*/
  function confirmPark(values) {
    dispatch({
      type: 'StaffCreateModel/updateState',
      payload: {
        mgrShops: Array.from(new Set(record_mgrShops)),
        choose_mgrShops:Array.from(new Set(record_mgrShops)),
        parkVisible: false,
      },
    });
  }
  /* 全选按钮 */
  function onCheckAllChange(e){
    if(e.target.checked){
      let data=record_mgrShops;
      let showdata=[];
      searchparkList.forEach(e=>{
        data.push(e.value)
        showdata.push(e.value)
      })
      dispatch({
        type: 'StaffCreateModel/updateState',
        payload: {
          choose_mgrShops: showdata,
          record_mgrShops: Array.from(new Set(data)),
          checkedall:true,
        },
      });
    }else{
      // console.log('record_mgrShops',record_mgrShops)
      searchparkList.map(item=>{
        record_mgrShops.splice(record_mgrShops.findIndex(ret => ret == item.value), 1)
      })
      dispatch({
        type: 'StaffCreateModel/updateState',
        payload: {
          choose_mgrShops: [],
          checkedall:false,
          record_mgrShops,
        },
      });
    }
  }

  const handleCheck = (rule, value, callback) =>　{
    console.log(record_mgrShops.length)
    if (record_mgrShops.length == 0) {
      callback('请选择管辖游乐园');
    }
    callback();    // callback方法必须要有，否则会报错
  };

  /*新增属性*/
  const StaffCreateComponentProps = {
    createVisible,
    createLoading,
    mgrShops, //当前游乐园
    choose_mgrShops,
    record_mgrShops,
    modalType, //弹窗类型
    userInfo, //员工信息
    roleList, //所有角色

    //方法
    cancelCreate, //取消
    confirmCreate, //确定
    showParkList, //显示管辖游乐园
  };

  /*管辖游乐园*/
  const SelectParkProps = {
    checkedall,
    parkVisible, //显示
    parkList, //游乐园列表
    searchparkList,
    mgrShops, //当前管辖游乐园
    choose_mgrShops,
    onCheckAllChange,
    checkboxChangeFn,
    handleCheck,
    //方法
    cancelPark, //取消
    confirmPark, //确定
    searchParkFn,
  };

  return (
    <div>
      {!!createVisible ? (
        <StaffCreateComponent {...StaffCreateComponentProps} />
      ) : null}
      {!!parkVisible ? <SelectPark {...SelectParkProps} /> : null}
    </div>
  );
}

function mapStateToProps({ StaffCreateModel, }) {
  return { StaffCreateModel, };
}

export default connect(mapStateToProps)(StaffCreate);
