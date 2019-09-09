/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Icon, Input, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {
  StatusFlag,
  AlertModal,
} from '../../components/common/new-component/NewComponent';

function ThresholdControl({ dispatch, ThresholdControlModel, }) {
  const {
    /*搜索*/
    loading,
    alertModalTitle,
    alertModalVisible, //同意弹窗
    remarksValue, //拒绝弹窗理由
    memberCardList,
    /*表格项*/
    dataSource,
    auditLoading,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
  } = ThresholdControlModel;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'ThresholdControlModel/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'ThresholdControlModel/pageChange',
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
      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };

    delete searchValue.appointTime;
    dispatch({
      type: 'ThresholdControlModel/queryPlatOrderList',
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
      type: 'ThresholdControlModel/updateState',
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
          key: 'spuId',
          type: 'select',
          placeholder: '选择卡类型',
          opt_key: 'id',
          opt_label: 'name',
          options: memberCardList,
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
        {
          key: 'threshold',
          type: 'select',
          placeholder: '选择阈值',
          options: [{ label: '是', key: true, }, { label: '否', key: false, },],
        },
      ],
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'id',
      columns: [
        {
          dataIndex: 'spuName',
          key: 'spuName',
          title: '卡类型',
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
          dataIndex: 'appointDay',
          key: 'appointDay',
          title: '预约日期',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        {
          dataIndex: 'appointStock',
          key: 'appointStock',
          title: '库存限制',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },

        {
          dataIndex: 'appointAmount',
          key: 'appointAmount',
          title: '金额限制',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        {
          dataIndex: 'noLimitCount',
          key: 'noLimitCount',
          title: '不限额商品总计',
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
          dataIndex: 'noLimitPrice',
          key: 'noLimitPrice',
          title: '不限额商品总价格',
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
          dataIndex: 'stock',
          key: 'stock',
          title: '已预约库存',
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
          dataIndex: 'amount',
          key: 'amount',
          title: '已预约金额',
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
          dataIndex: 'threshold',
          key: 'threshold',
          title: '达到阈值',
          width: '96px',
          render: text => (
            <div>
              {text === 'false' ? (
                <StatusFlag type="green">否</StatusFlag>
              ) : (
                <StatusFlag type="red">是</StatusFlag>
              )}
            </div>
          ),
        },
      ],
    },
    // pagination: {
    //   total: resultCount,
    //   pageIndex: pageIndex,
    //   pageSize: pageSize,
    //   showTotal: total => `共 ${total} 条`,
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   onShowSizeChange: pageOnChange,
    //   onChange: pageOnChange,
    // },
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

function mapStateToProps({ ThresholdControlModel, }) {
  return { ThresholdControlModel, };
}

export default connect(mapStateToProps)(ThresholdControl);
