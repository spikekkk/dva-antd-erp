/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';

function orderDetail({ dispatch, memberDetailModel, }) {
  const {
    /*表格项*/
    orderData,
    auditLoading,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
  } = memberDetailModel;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'memberDetailModel/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'memberDetailModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*表格属性*/
  const TicketComponentProps = {
    table: {
      loading: auditLoading,
      dataSource: orderData,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'id',
      columns: [
        {
          dataIndex: 'createTime',
          key: 'createTime',
          title: '订单编号',
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
          dataIndex: 'id',
          key: 'id',
          title: '下单时间',
          width: '90px',
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
          dataIndex: 'ticketName',
          key: 'ticketName',
          title: '支付时间',
          width: '90px',
          render: (text, record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'qrImg',
          key: 'qrImg',
          title: '商品名称',
          width: '96px',
          render: (text, record) => <div>{text}</div>,
        },
        {
          dataIndex: 'price',
          key: 'price',
          title: '商品推荐人',
          width: '90px',
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
          dataIndex: 'settlePrice',
          key: 'settlePrice',
          title: '数量',
          width: '90px',
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
          dataIndex: 'discountPrice',
          key: 'discountPrice',
          title: '实付',
          width: '90px',
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
          dataIndex: 'stockType',
          key: 'stockType',
          title: '订单状态',
          width: '90px',
          render: (text, record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'shopNam4e',
          key: 'shopNam4e',
          title: '订单类型',
          width: '90px',
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
          dataIndex: 'shopName2',
          key: 'shopName2',
          title: '所属游乐园',
          width: '90px',
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
          title: '商品状态',
          width: '90px',
          render: (text, _record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
      ],
    },
    pagination: {
      width: '100%',
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
    </div>
  );
}

function mapStateToProps({ memberDetailModel, }) {
  return { memberDetailModel, };
}

export default connect(mapStateToProps)(orderDetail);
