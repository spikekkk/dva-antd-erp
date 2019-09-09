import React from 'react';
import { Table,Button } from 'antd';
import { NewModal, } from '../../common/new-component/NewComponent'
import ManagerList from '../../common/new-component/manager-list/ManagerList'
function LookWhiteListComponent({
    lookWhiteListDrawerVisible,
    lookWhiteListDrawerTitle,
    //表格相关配置
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    //方法
    cancelLookWhiteListDrawerFn,
    removeWhiteListFn,
    pageOnChange,
}){

  /*表格属性*/
  const TicketComponentProps = {
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      rowKey: 'whitelistId',
      columns: [
            {
                title: '对应手机号',
                dataIndex: 'mobile',
                key: 'mobile',
                width:192,
                render: (text, record) => (
                    <div>
                        {text}
                    </div>
                ),
            },
            {
                title: '白名单信息',
                dataIndex: 'vipSpuName',
                key: 'vipSpuName',
                render: (text, record) => (
                    <div style={{padding:10}}>
                        <h3 style={{textAlign:'left'}}>{record.vipSpuName}</h3>
                        <p style={{textAlign:'left'}}>(持卡人：{record.cardHolderName}，身份证：{record.cardHolderIdCard}，{record.vipExpireTime}到期)</p>
                    </div>
                ),
            },
            {
                title: '成为白名单时间',
                dataIndex: 'vipObtainTime',
                key: 'vipObtainTime',
                width:192,
                render: (text, record) => (
                    <div>
                        {text}
                    </div>
                ),
            },
            {
                title: '次数',
                dataIndex: 'remainTimes',
                key: 'remainTimes',
                width:96,
                render: (text, record) => (
                    <div>
                        {text}
                    </div>
                ),
            },
            {
                title: '可用时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width:192,
                render: (text, record) => (
                    <p>{text} - {record.endTime}</p>
                ),
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record) => (
                    <Button type='primary' onClick={removeWhiteListFn.bind(this,record.whitelistId)}>移除白名单</Button>
                ),
            }
        ],
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
  };


    return (
        <NewModal
            visible={lookWhiteListDrawerVisible}
            children={<ManagerList {...TicketComponentProps} />}
            closable={true}
            title={lookWhiteListDrawerTitle}
            onCancel={cancelLookWhiteListDrawerFn}
            width={'80%'}
        />
    )
}

export default LookWhiteListComponent;