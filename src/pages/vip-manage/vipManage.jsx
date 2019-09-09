import React from 'react'
import { connect, } from 'dva';
import { Popover, Icon, Input, Button, Modal, Tabs, List } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import VipManageComponents from '../../components/vip-manage/vipManageComponents';
const { TabPane } = Tabs;

function vipManage({ dispatch, vipManageModel }) {
    const {
        changeVisible,
        lookVisible,
        remarkVisible,
        edit,

        /*搜索*/
        searchContent, //搜索内容

        /*表格项*/
        loading,
        dataSource,
        newColumns,
        resultCount,
        pageIndex,
        pageSize,
    } = vipManageModel

    /*改变分页*/
    function pageOnChange(pageIndex, pageSize) {
        dispatch({
            type: 'vipManageModel/pageChange',
            payload: {
                pageIndex,
                pageSize,
            },
        });
    }

    /*搜索*/
    function searchFunction(values) {
        const searchValue = {
        ...values,
        payStartTime: !!values.payTime
            ? values.payTime[0].format('YYYY-MM-DD 00:00:00')
            : undefined,
        payEndTime: !!values.payTime
            ? values.payTime[1].format('YYYY-MM-DD 23:59:59')
            : undefined,

        appointStartDay: !!values.appointTime
            ? values.appointTime[0].format('YYYY-MM-DD')
            : undefined,
        appointEndDay: !!values.appointTime
            ? values.appointTime[1].format('YYYY-MM-DD')
            : undefined,
        };
        delete searchValue.payTime;
        delete searchValue.appointTime;
        dispatch({
        type: 'vipManageModel/queryCustomerList',
        payload: {
            searchContent: searchValue,
            pageIndex: 0,
            pageSize,
        },
        });
    }

    const tableColumns = [
        {
            dataIndex: 'nickname',
            key: 'nickname',
            title: '用户昵称',
            width: '168px',
            render: (text, _record) => (
                <div>{text}</div>
            ),
        },
        {
            dataIndex: 'mobile',
            key: 'mobile',
            title: '用户手机号',
            width: '168px',
            render: (text, _record) => (
                <div>{text}</div>
            ),
        },
        {
            dataIndex: 'currentLevel',
            key: 'currentLevel',
            title: '用户状态',
            width: '168px',
            render: (text, _record) => (
                <div>
                { text == 0 ?
                    '游客' : (
                        text == 1 ? 
                            '普通会员' : (
                                text == 2 ? 
                                    '掌柜' : (
                                        text == 3 ?
                                            '主管' : (
                                                text == 4 ?
                                                    '经理' : ''
                                            )
                                    )
                            )
                    )
                }
                </div>
            ),
        },
        {
            dataIndex: 'registerTime',
            key: 'registerTime',
            title: '注册时间',
            width: '168px',
            render: (text, _record) => (
                <div>{text}</div>
            ),
        },
        {
            dataIndex: 'cardItems',
            key: 'cardItems',
            title: '相关会员卡信息',
            width: '168px',
            render: (text, _record) => (
                <div onClick={showModalFn} style={{textAlign:'left',textDecoration:'underline',cursor:'pointer'}}>持有:{text.length > 0 ? text.map(item=>{
                    return (<span>{item.cardName} </span>)
                }) : '-'}</div>
            ),
        },
        {
            dataIndex: 'totalCount',
            key: 'totalCount',
            title: '预约核销次数',
            width: '168px',
            render: (text, _record) => (
                <div style={{textDecoration:'underline',cursor:'pointer'}}>{text}</div>
            ),
        },
    ]

    /*表格属性*/
    const TicketComponentProps = {
        search: {
            // onSearch: searchFunction,
            // onClear: searchFunction,
            fields: [
                { key: 'mobile', type: 'input', placeholder: '用户手机号', },
                {
                    key: 'register',
                    type: 'rangePicker',
                    width: '290px',
                    showTime: false,
                    format: 'YYYY-MM-DD',
                    startPlaceholder: '注册起始时间',
                    endPlaceholder: '注册结束时间',
                },
                // {
                //     key: 'appointTime',
                //     type: 'rangePicker',
                //     width: '290px',
                //     showTime: false,
                //     format: 'YYYY-MM-DD',
                //     startPlaceholder: '最近上线时间',
                //     endPlaceholder: '最近上线时间',
                // },
            ],
        },
        table: {
            yScroll: '680px',
            loading: loading,
            dataSource: dataSource,
            newColumns: newColumns,
            // haveSet: true,
            // firstTable: firstTable,
            // defaultCheckedValue: defaultCheckedValue,
            // changeColumns: changeColumns,
            // saveColumns: saveColumns,
            rowKey: 'custId',
            columns: tableColumns,
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

    function showModalFn() {
        dispatch({
            type: 'vipManageModel/updateState',
            payload: {
                changeVisible: true
            }
        })
    }

    function cancelModalFn() {
        dispatch({
            type: 'vipManageModel/updateState',
            payload: {
                changeVisible: false
            }
        })
    }

    function showEditFn() {
        dispatch({
            type: 'vipManageModel/updateState',
            payload: {
                edit: true
            }
        })
    }

    function hideEditFn() {
        dispatch({
            type: 'vipManageModel/updateState',
            payload: {
                edit: false
            }
        })
    }

    function showLookModalFn() {
        dispatch({
            type: 'vipManageModel/updateState',
            payload: {
                lookVisible: true
            }
        })
    }

    function cancelLookModalFn() {
        dispatch({
            type: 'vipManageModel/updateState',
            payload: {
                lookVisible: false
            }
        })
    }

    const vipManageProps = {
        changeVisible,
        edit,
        cancelModalFn,
        showEditFn,
        hideEditFn
    }

    return (
        <div>
            <TicketComponent {...TicketComponentProps} />
            {/* <Button onClick={showModalFn}>点击</Button>
            <Button onClick={showLookModalFn}>点击2</Button> */}
            <VipManageComponents {...vipManageProps} />
            <Modal
                visible={remarkVisible}
                title={'请备注修改原因（必填）'}
            >
                <Input.TextArea
                    autosize={true}
                />
            </Modal>
            <Modal
                title={'预约核销总数据：10次'}
                visible={lookVisible}
                onCancel={cancelLookModalFn}
            >
                <Tabs
                    defaultActiveKey="1"
                >
                    <TabPane tab="亲子卡" key="1">
                        <h3>亲子卡5次</h3>
                        <List>
                            <List.Item>
                                1312313131
                            </List.Item>
                            <List.Item>
                                1312313131
                            </List.Item>
                        </List>
                    </TabPane>
                    <TabPane tab="成人卡" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="亲子卡" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </Modal>
        </div>
    )
}

function mapStateToProps({ vipManageModel, }) {
    return { vipManageModel, };
}

export default connect(mapStateToProps)(vipManage);