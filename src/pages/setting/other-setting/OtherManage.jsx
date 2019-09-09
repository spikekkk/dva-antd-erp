import React from 'react';
import { connect, } from 'dva';
import { Card, Button, message } from 'antd';
import AddWhiteListComponent from '../../../components/setting/other-manage/addWhiteListComponent'
import SetWhiteListComponent from '../../../components/setting/other-manage/setWhiteListComponent'
import LookWhiteListComponent from '../../../components/setting/other-manage/lookWhiteListComponent'

function OtherManage({dispatch, OtherManageModel}){

    const {
        addWhiteListModalTitle,
        addWhiteListModalVisible,
        setWhiteListModalTitle,
        setWhiteListModalVisible,
        setWhiteListDrawerInfo,
        lookWhiteListDrawerVisible,
        lookWhiteListDrawerTitle,
        cardChoosedId,
        whitelistItems,
        mobile,
        //表格项
        loading,
        dataSource,
        newColumns,
        resultCount,
        pageIndex,
        pageSize,
    } = OtherManageModel

    /*改变分页*/
    function pageOnChange(pageIndex, pageSize) {
        dispatch({
        type: 'OtherManageModel/pageChange',
        payload: {
            pageIndex,
            pageSize,
        },
        });
    }

    function showAddWhiteListModalFn(){
        dispatch({
            type:'OtherManageModel/updateState',
            payload:{
                addWhiteListModalVisible:true
            }
        })
    }

    function cancelAddWhiteListModalFn(){
        dispatch({
            type:'OtherManageModel/updateState',
            payload:{
                addWhiteListModalVisible:false
            }
        })
    }

    function cancelSetWhiteListModalFn(){
        dispatch({
            type:'OtherManageModel/updateState',
            payload:{
                setWhiteListModalVisible:false
            }
        })
    }

    function setSearchPhoneNumFn(val){
        dispatch({
            type:'OtherManageModel/getByMobile',
            payload:{
                mobile:val
            }
        })
    }

    function showLookWhiteListDrawerFn(){
        dispatch({
            type: 'OtherManageModel/queryWhiteList',
            payload: {
                pageIndex: 0,
                pageSize: 20,
            },
        });
        dispatch({
            type:'OtherManageModel/updateState',
            payload:{
                lookWhiteListDrawerVisible:true
            }
        })
    }

    function cancelLookWhiteListDrawerFn(){
        dispatch({
            type:'OtherManageModel/updateState',
            payload:{
                lookWhiteListDrawerVisible:false
            }
        })
    }

    function chooseCardFn(val){
        console.log(val)
        dispatch({
            type:'OtherManageModel/updateState',
            payload:{
                cardChoosedId:val
            }
        })
    }

    function chooseCardSetFn(data){
        dispatch({
            type:'OtherManageModel/update',
            payload:{
                whitelistItems:data
            }
        })
    }

    function removeWhiteListFn(id){
        dispatch({
            type:'OtherManageModel/deleteWhiteList',
            payload:{
                whitelistId:id
            }
        })
    }

    const addWhiteListProps={
        addWhiteListModalTitle,
        addWhiteListModalVisible,
        cancelAddWhiteListModalFn,
        setSearchPhoneNumFn,
    }

    const setWhiteListProps={
        setWhiteListModalTitle,
        setWhiteListModalVisible,
        setWhiteListDrawerInfo,
        whitelistItems,
        mobile,
        cancelSetWhiteListModalFn,
        chooseCardFn,
        chooseCardSetFn,
        cardChoosedId,
    }

    const lookWhiteListProps={
        lookWhiteListDrawerVisible,
        lookWhiteListDrawerTitle,
        cancelLookWhiteListDrawerFn,
        removeWhiteListFn,
        loading,
        dataSource,
        newColumns,
        resultCount,
        pageIndex,
        pageSize,
        pageOnChange,
    }

    return (
        <div>
            <Card title="白名单设置" type='inner' style={{ width: 300 }}>
                <p>
                    <Button onClick={showAddWhiteListModalFn}>添加白名单</Button>
                    <Button onClick={showLookWhiteListDrawerFn} style={{marginLeft:30}}>管理白名单</Button>
                </p>
                {/* <p>现在有白名单用户10个</p> */}
            </Card>
            <AddWhiteListComponent {...addWhiteListProps} />
            <SetWhiteListComponent {...setWhiteListProps} />
            <LookWhiteListComponent {...lookWhiteListProps} />
        </div>
    )
}

function mapStateToProps({OtherManageModel,}){
    return {OtherManageModel,}
}

export default connect(mapStateToProps)(OtherManage)