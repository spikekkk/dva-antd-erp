/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Icon, Input, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';

function memberCardOrders({ dispatch, memberCardOrdersModel, }) {
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
  } = memberCardOrdersModel;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'memberCardOrdersModel/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'memberCardOrdersModel/pageChange',
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
      actStartTime: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      actEndTime: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };

    delete searchValue.appointTime;
    dispatch({
      type: 'memberCardOrdersModel/queryPlatCustomerCard',
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
      type: 'memberCardOrdersModel/updateState',
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
        // {
        //   key: 'orderStatus',
        //   type: 'select',
        //   placeholder: '会员卡状态',
        //   options: [
        //     { label: '待支付', key: '0', },
        //     { label: '待预约', key: '1', },

        //     { label: '待出票', key: '2', },
        //     { label: '待核销', key: '3', },
        //     { label: '已完成', key: '4', },
        //     { label: '已过期', key: '5', },
        //     { label: '退款中', key: '6', },
        //     { label: '已退款', key: '7', },
        //     { label: '已取消', key: '8', },
        //     { label: '已关闭', key: '9', },
        //   ],
        // },
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '购买/激活开始时间',
          endPlaceholder: '购买/激活结束时间',
        },
        { key: 'cardName', type: 'input', placeholder: '会员卡名称', },
        {
          key: 'changeType',
          type: 'select',
          placeholder: '成为会员方式',
          options: [
            { label: '平台购买', key: '1', },
            { label: '平台激活', key: '2', },
          ],
        },
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
          dataIndex: 'cardName',
          key: 'cardName',
          title: '会员卡名称',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        {
          dataIndex: 'custName',
          key: 'custName',
          title: '用户姓名',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        {
          dataIndex: 'cardNumber',
          key: 'cardNumber',
          title: '会员卡号',
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
          dataIndex: 'channelNo;',
          key: 'channelNo;',
          title: '渠道号',
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
          dataIndex: 'mobile',
          key: 'mobile',
          title: '用户电话',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },

        {
          dataIndex: 'idCard',
          key: 'idCard',
          title: '用户身份证',
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
          dataIndex: 'changeType',
          key: 'changeType',
          title: '成为会员方式',
          width: '96px',
          render: text => (
            <Popover
              content={text == '1' ? '平台购买' : '平台激活'}
              placement="top"
              trigger="hover"
            >
              {text == '1' ? '平台购买' : '平台激活'}
            </Popover>
          ),
        },
        {
          dataIndex: 'actTime',
          key: 'actTime',
          title: '购买/激活会员卡时间',
          width: '96px',
          render: text => <div>{text}</div>,
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

function mapStateToProps({ memberCardOrdersModel, }) {
  return { memberCardOrdersModel, };
}

export default connect(mapStateToProps)(memberCardOrders);
