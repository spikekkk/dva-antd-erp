/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Icon, Input, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';

function shopAppointOrders({ dispatch, shopAppointOrdersModel, }) {
  const {
    /*搜索*/
    loading,

    /*表格项*/
    dataSource,

    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
  } = shopAppointOrdersModel;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'shopAppointOrdersModel/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'shopAppointOrdersModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    console.log('搜索的日期----------', values);
    const searchValue = {
      ...values,
      appointStartDate: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDate: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };

    delete searchValue.appointTime;
    dispatch({
      type: 'shopAppointOrdersModel/queryShopAppointOrder',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'shopAppointOrdersModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        {
          key: 'orderStatus',
          type: 'select',
          placeholder: '订单状态',
          options: [
            { label: '待支付', key: '0', },
            { label: '申请中', key: '1', },

            { label: '待出票', key: '2', },
            { label: '待核销', key: '3', },
            { label: '已完成', key: '4', },
            { label: '已过期', key: '5', },
            // { label: '退款中', key: '6', },
            // { label: '已退款', key: '7', },
            { label: '已取消', key: '8', },
            { label: '已关闭', key: '9', },
          ],
        },
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '预约开始时间',
          endPlaceholder: '预约结束时间',
        },
        { key: 'custName', type: 'input', placeholder: '预约人姓名', },

        { key: 'mobile', type: 'input', placeholder: '手机号', },
      ],
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'orderId',
      columns: [
        {
          dataIndex: 'orderId',
          key: 'orderId',
          title: '订单编号',
          width: '96px',
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
          dataIndex: 'payTime',
          key: 'payTime',
          title: '支付时间',
          width: '96px',
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
          dataIndex: 'appointDate',
          key: 'appointDate',
          title: '预约日期',
          width: '96px',
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
          dataIndex: 'custName',
          key: 'custName',
          title: '预约人姓名',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        {
          dataIndex: 'mobile',
          key: 'mobile',
          title: '手机号',
          width: '96px',
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
          dataIndex: 'goodsName',
          key: 'goodsName',
          title: '商品名称',
          width: '96px',
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
          dataIndex: 'shopName',
          key: 'shopName',
          title: '所属门店',
          width: '96px',
          render: text => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'orderStatus',
          key: 'orderStatus',
          title: '订单状态',
          width: '96px',
          render: text => (
            <Popover
              content={
                text == 0
                  ? '待支付'
                  : text == 1
                    ? '申请中'
                    : text == 2
                      ? '已预约'
                      : text == 3
                        ? '待核销'
                        : text == 4
                          ? '已完成'
                          : text == 5
                            ? '已过期'
                            : text == 8
                              ? '已取消'
                              : text == 9
                                ? '已关闭'
                                : ''
              }
              placement="top"
              trigger="hover"
            >
              {text == 0
                ? '待支付'
                : text == 1
                  ? '申请中'
                  : text == 2
                    ? '已预约'
                    : text == 3
                      ? '待核销'
                      : text == 4
                        ? '已完成'
                        : text == 5
                          ? '已过期'
                          : text == 8
                            ? '已取消'
                            : text == 9
                              ? '已关闭'
                              : ''}
            </Popover>
          ),
        },
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
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <TicketComponent {...TicketComponentProps} />
      {/* <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title={alertModalTitle}
        visible={alertModalVisible}
      /> */}
    </div>
  );
}

function mapStateToProps({ shopAppointOrdersModel, }) {
  return { shopAppointOrdersModel, };
}

export default connect(mapStateToProps)(shopAppointOrders);
