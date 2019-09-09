import React from 'react';
import { Table, Form, Select, DatePicker, } from 'antd';
import { NullData, ProgressBar, } from '../NewComponent';

function managerListTable({
  xScroll,
  yScroll,
  isInDetail,
  height,
  isWidth,
  loading,
  dataSource,
  columns,
  emptyText,
  rowKey,
  rowSelection,
  newColumns,
  progressContent,
  ProgressBarHeight,
  NullDataHeight,
  singleselect,
  onRowClick,
}) {
  /*确认需要展示的列表项*/
  let finalColumns = [];
  if (!!newColumns && newColumns.length > 0) {
    finalColumns = newColumns;
  } else {
    finalColumns = columns;
  }

  const tableHeight = document.body.clientHeight;
  let scrollHeight = '';
  /*获取高度值*/
  if (!!height) {
    scrollHeight = tableHeight - height;
  } else {
    scrollHeight = tableHeight - 241;
  }

  const ant_layout_content = document.getElementById('common_content_left');
  const contentWidth = !!ant_layout_content && ant_layout_content.clientWidth;

  if (!!isInDetail || !!isWidth) {
    if (xScroll < 900) {
      xScroll = undefined;
    }
  } else {
    if (contentWidth > xScroll) {
      xScroll = undefined;
    }
  }
  const ant_table_scroll = document.getElementsByClassName('ant-table-scroll');
  if (!!ant_table_scroll[0]) {
    ant_table_scroll[0].className = '';
  }

  return (
    <div className="zj_new_component_by_yhwu_table">
      {!!singleselect ? (
        <Table
          bordered
          className="chooseStuTable"
          columns={finalColumns}
          dataSource={!!loading ? [] : dataSource}
          locale={{
            emptyText: !!loading ? (
              <ProgressBar
                content={progressContent || '加载中'}
                height={ProgressBarHeight || 300}
              />
            ) : (
              <NullData
                content={emptyText || '暂时没有数据'}
                height={NullDataHeight || 300}
              />
            ),
          }}
          onRowClick={onRowClick}
          pagination={false}
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection}
          scroll={{ y: yScroll || scrollHeight, x: !!xScroll && xScroll, }}
        />
      ) : (
        <Table
          bordered
          className="chooseStuTable"
          columns={finalColumns}
          dataSource={!!loading ? [] : dataSource}
          locale={{
            emptyText: !!loading ? (
              <ProgressBar
                content={progressContent || '加载中'}
                height={ProgressBarHeight || 300}
              />
            ) : (
              <NullData
                content={emptyText || '暂时没有数据'}
                height={NullDataHeight || 300}
              />
            ),
          }}
          pagination={false}
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection}
          scroll={{ y: yScroll || scrollHeight, x: !!xScroll && xScroll, }}
        />
      )}
    </div>
  );
}

export default managerListTable;
