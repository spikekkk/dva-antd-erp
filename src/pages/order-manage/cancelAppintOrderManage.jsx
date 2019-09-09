/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Modal, message,Button } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {
  StatusFlag,
  AlertModal,
} from '../../components/common/new-component/NewComponent';

function CancelAppointOrder({ dispatch, cancelAppointOrderModel, }) {
  const {
    /*搜索*/
    loading,
    alertModalTitle,
    alertModalVisible, //同意弹窗
    defaultCheckedValue, //已选择按钮
    /*表格项*/
    dataSource,
    newColumns,
    resultCount,
    firstTable,
    pageIndex,
    pageSize,
  } = cancelAppointOrderModel;

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'cancelAppointOrderModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'cancelAppointOrderModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
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
      type: 'cancelAppointOrderModel/queryPlatAppointOrderList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /*弹窗确认*/
  function confirmAlert() {
    dispatch({
      type: 'cancelAppointOrderModel/handleSe',
      payload: {
        alertModalVisible: false,
      },
    });
    setTimeout(()=>{
      dispatch({
        type: 'indexLayout/countOrder',
      });
    },500)
    
  }

  //处理
  function handleFn(val){
    dispatch({
      type: 'cancelAppointOrderModel/updateState',
      payload: {
        alertModalVisible: true,
        orderBaseInfo: val,
      },
    });
  }

  const tableColumns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '订单编号',
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
      dataIndex: 'goodsType',
      key: 'goodsType',
      title: '类型标签',
      width: '96px',
      render: (text, record) => (
        <span>
          {text == 101
            ? '门票'
            : text == 102
              ? '消费卡'
              : text == 103
                ? '课程'
                : text == 901
                  ? '会员卡'
                  : text == 902
                    ? '消费卡'
                    : ''}
        </span>
      ),
    },
    {
      dataIndex: 'saleMode',
      key: 'saleMode',
      title: '售卖情况',
      width: '96px',
      render: text => (
        <span>{text == '4' ? '运营操作' : text == '5' ? '自核销' : ''}</span>
      ),
    },
    {
      dataIndex: 'appointApplyTime',
      key: 'appointApplyTime',
      title: '申请时间',
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
      dataIndex: 'payTime',
      key: 'payTime',
      title: '支付时间',
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
      dataIndex: 'appointDay',
      key: 'appointDay',
      title: '预约日期',
      width: '96px',
      render: (text, record) => <span>{text}</span>,
    },

    {
      dataIndex: 'custName',
      key: 'custName',
      title: '姓名',
      width: '120px',
      render: text => <a>{text}</a>,
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '预约人手机号',
      width: '116px',
      render: text => <span> {text}</span>,
    },
    {
      dataIndex: 'appointName',
      key: 'appointName',
      title: '持卡人姓名',
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
      dataIndex: 'idCard',
      key: 'idCard',
      title: '持卡人身份证号码',
      width: '146px',
      render: text => (
        // <Popover content={text}
        //   placement="top"
        //   trigger="hover"
        // >
        <span style={{ fontWeight: '600', }}>{text} </span>
        // </Popover>
      ),
    },

    {
      dataIndex: 'goodsName',
      key: 'goodsName',
      title: '商品名称',
      width: '300px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a>{text}</a>
        </Popover>
      ),
    },
    {
      dataIndex: 'shopName',
      key: 'shopName',
      title: '所属乐园',
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
    {
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      title: '押金金额（原价）',
      width: '96px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text || '0'}
        </Popover>
      ),
    },
    {
      dataIndex: 'appointStatus',
      key: 'appointStatus',
      title: '订单状态',
      width: '148px',
      render: text => (
        <div>出票后取消</div>
        // <Popover
        //   content={
        //     <span>
        //       {text == 0 ? (
        //         <span>待支付 </span>
        //       ) : text == 1 ? (
        //         <span>申请中</span>
        //       ) : text == 2 ? (
        //         <span>已预约(待出票) </span>
        //       ) : text == 3 ? (
        //         <span>待核销(已出票)</span>
        //       ) : text == 4 ? (
        //         <span>已完成 </span>
        //       ) : text == 5 ? (
        //         <span>已过期(无法取消)</span>
        //       ) : text == 8 ? (
        //         <span>已取消(用户取消) </span>
        //       ) : text == 9 ? (
        //         <span>已关闭(未支付自动取消) </span>
        //       ) : (
        //         ''
        //       )}
        //     </span>
        //   }
        //   placement="top"
        //   trigger="hover"
        // >
        //   <span>
        //     {text == 0 ? (
        //       <span>待支付 </span>
        //     ) : text == 1 ? (
        //       <span>申请中</span>
        //     ) : text == 2 ? (
        //       <span>已预约(待出票) </span>
        //     ) : text == 3 ? (
        //       <span>待核销(已出票)</span>
        //     ) : text == 4 ? (
        //       <span>已完成 </span>
        //     ) : text == 5 ? (
        //       <span>已过期(无法取消)</span>
        //     ) : text == 8 ? (
        //       <span>已取消(用户取消) </span>
        //     ) : text == 9 ? (
        //       <span>已关闭(未支付自动取消) </span>
        //     ) : (
        //       ''
        //     )}
        //   </span>
        // </Popover>
      ),
    },
    {
      dataIndex:'handledCancelAfterDraw',
      key:'handledCancelAfterDraw',
      title:'处理情况',
      width:'100px',
      render: text => (
        <span>{text == 1 ? '已处理' : '未处理'}</span>
      )
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '操作',
      width: '126px',
      render: (text, record) => (
        <div>
          {record.handledCancelAfterDraw != 1 ? <Button onClick={handleFn.bind(this,record)} type='primary'>处理</Button>:'-'}
        </div>
      ),
    },
  ];

  /*关闭操作按钮*/
  function cancelAlert() {
    dispatch({
      type: 'cancelAppointOrderModel/updateState',
      payload: {
        alertModalVisible: false,
      },
    });
  }

  /*改变表格显示项*/
  function changeColumns(checkedValues) {
    const data = [];

    let checkedArr = null;
    if (checkedValues) {
      checkedArr = checkedValues;
    } else {
      checkedArr = defaultCheckedValue;
    }
    tableColumns.forEach((r, index) => {
      checkedArr.forEach(rs => {
        if (r.key == rs) {
          data.push(r);
        }
      });
    });
    dispatch({
      type: 'cancelAppointOrderModel/updateState',
      payload: {
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
      },
    });
  }
  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: 'calcelAppointOrderModel/tableColumnSave',
      payload: {},
    });
  }

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        {
          key: 'goodsType',
          type: 'select',
          placeholder: '类型标签',
          options: [
            { label: '门票', key: '101', },
            { label: '消费卡', key: '102', },
            { label: '课程', key: '103', },
          ],
        },
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '预约开始时间',
          endPlaceholder: '结束时间',
        },
        {
          key: 'saleMode',
          type: 'select',
          placeholder: '售卖模式',
          options: [
            { label: '运营操作', key: '4', },
            { label: '自核销', key: '5', },
          ],
        },
        { key: 'mobile', type: 'input', placeholder: '预约人手机号', },
        { key: 'skuName', type: 'input', placeholder: '商品名称', },
        {
          key: 'shopId',
          type: 'select',
          placeholder: '所属乐园/门店',
          options: window._init_data.options,
        },
        {
          key: 'handleState',
          type: 'select',
          placeholder: '处理情况',
          options: [
            { label: '待处理', key: '0', },
            { label: '已处理', key: '1', },
          ],
        },
      ],
    },
    table: {
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      haveSet: true,
      firstTable: firstTable,
      defaultCheckedValue: defaultCheckedValue,
      changeColumns: changeColumns,
      saveColumns: saveColumns,
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
  const alertModalContent = (
    <h3>
      请确定已处理过该订单
    </h3>
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
        // visible={true}
      />
    </div>
  );
}

function mapStateToProps({ cancelAppointOrderModel, }) {
  return { cancelAppointOrderModel, };
}

export default connect(mapStateToProps)(CancelAppointOrder);
