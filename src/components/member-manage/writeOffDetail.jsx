/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';

function writeOffDetail({ dispatch, memberDetailModel, }) {
  const {
    /*表格项*/
    writeOffData,
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
      dataSource: writeOffData,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'id',
      columns: [
        {
          dataIndex: 'createTime',
          key: 'createTime',
          title: '核销时间',
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
          title: '票种',
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
          title: '票码',
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
          title: '会员卡',
          width: '96px',
          render: (text, record) => <div>{text}</div>,
        },
        {
          dataIndex: 'price',
          key: 'price',
          title: '类型',
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
          title: '所属门店',
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

export default connect(mapStateToProps)(writeOffDetail);
