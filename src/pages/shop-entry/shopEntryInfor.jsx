/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Modal, message, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {
  StatusFlag,
  AlertModal,
} from '../../components/common/new-component/NewComponent';

function shopEntryInfo({ dispatch, shopEntryInforModel, }) {
  const {
    /*搜索*/

    loading,
    alertModalTitle,
    alertModalVisible, //同意弹窗
    remarksValue, //拒绝弹窗理由

    /*表格项*/
    dataSource,

    newColumns,
    resultCount,

    pageIndex,
    pageSize,
  } = shopEntryInforModel;

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'shopEntryInforModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'shopEntryInforModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }
  /* 下载模板 */
  function downloadTemplate() {
    dispatch({
      type: 'shopEntryInforModel/downloadTemplate',
      payload: {
        templateType: '2',
      },
    });
  }
  /*审核弹窗确认*/
  function confirmAlert() {
    dispatch({
      type: 'shopEntryInforModel/businessStatus',
      payload: {
        alertModalVisible: false,
      },
    });
  }
  /*关闭操作按钮*/
  function cancelAlert() {
    dispatch({
      type: 'shopEntryInforModel/updateState',
      payload: {
        remarksValue,
        alertModalVisible: false,
      },
    });
  }
  /*获取输入的理由*/
  function getTextValue(e) {
    dispatch({
      type: 'shopEntryInforModel/updateState',
      payload: {
        remarksValue: e.target.value,
      },
    });
  }

  /*操作按钮*/
  function handleOperationStatus(val, type) {
    console.log('取消操作', val);
    dispatch({
      type: 'shopEntryInforModel/updateState',
      payload: {
        alertModalVisible: true,
        orderBaseInfo: val,
        remarksValue: val.remark,
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
    };

    dispatch({
      type: 'shopEntryInforModel/businessList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  const tableColumns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '编号',
      width: '168px',
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
      dataIndex: 'name',
      key: 'name',
      title: '姓名',
      width: '96px',
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
      dataIndex: 'mobile',
      key: 'mobile',
      title: '手机号',
      width: '96px',
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
      dataIndex: 'businessName',
      key: 'businessName',
      title: '商家名称',
      width: '96px',
      render: (text, record) => <span>{text}</span>,
    },

    {
      dataIndex: 'businessNum',
      key: 'businessNum',
      title: '数量',
      width: '120px',
      render: text => <a>{text}</a>,
    },
    {
      dataIndex: 'province',
      key: 'province',
      title: '城市区域',
      width: '116px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text + record.city + record.district}
        </Popover>
      ),
    },
    {
      dataIndex: 'address',
      key: 'address',
      title: '详细地址',
      width: '146px',
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
      dataIndex: 'status',
      key: 'status',
      title: '操作',
      width: '126px',
      render: (text, record) =>
        text == 1 ? (
          '已处理'
        ) : (
          <a onClick={() => handleOperationStatus(record, 2)}>待处理</a>
        ),
    },
    {
      dataIndex: 'remark',
      key: 'remark',

      title: '说明',
      width: '116px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
  ];
  const btns = [
    {
      label: '导出',
      handle: downloadTemplate.bind(this),
    },
  ];
  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'name', type: 'input', placeholder: '姓名', },
        { key: 'mobile', type: 'input', placeholder: '手机号', },
        { key: 'businessName', type: 'input', placeholder: '商家名称', },
        {
          key: 'status',
          type: 'select',
          placeholder: '操作',
          options: [
            { label: '未处理', key: '0', },
            { label: '已处理', key: '1', },
          ],
        },
      ],
    },
    rightBars: {
      btns: btns,
      isSuperSearch: false,
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      rowKey: 'id',
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
  const { TextArea, } = Input;
  const alertModalContent = (
    <div>
      <TextArea
        onChange={getTextValue}
        placeholder="请输入处理备注"
        rows={4}
        value={remarksValue}
      />
    </div>
  );
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <TicketComponent {...TicketComponentProps} />
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title={alertModalTitle}
        visible={alertModalVisible}
      />
    </div>
  );
}

function mapStateToProps({ shopEntryInforModel, }) {
  return { shopEntryInforModel, };
}

export default connect(mapStateToProps)(shopEntryInfo);
