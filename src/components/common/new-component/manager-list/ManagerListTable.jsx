import React from 'react';
import {
  Table,
  Form,
  Select,
  DatePicker,
  Button,
  Dropdown,
  Menu,
  Icon,
  Checkbox,
} from 'antd';
import { NullData, ProgressBar, } from '../NewComponent';

function managerListTable({
  xScroll,
  yScroll,
  isInDetail,
  isTab,
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
  changeColumns,
  defaultCheckedValue,
  haveSet,
  firstTable, //第一次请求
  saveColumns, //保存
}) {
  /*确认需要展示的列表项*/
  // console.log('newColumns-----table------', newColumns);
  let finalColumns = [];
  const chexkGroup = [];
  const newDefaultCheckedValue = [];
  if (!!newColumns && newColumns.length > 0) {
    finalColumns = newColumns;
  } else {
    finalColumns = columns;

    // saveColumns(chexkGroup);
  }
  columns.forEach(e => {
    const data = { label: e.title, value: e.key, };
    chexkGroup.push(data);
  });

  newColumns.forEach(e => {
    if (!defaultCheckedValue) {
      newDefaultCheckedValue.push(e.key);
    }
  });

  if (!!firstTable && defaultCheckedValue) {
    setTimeout(() => {
      changeColumns();
    }, 600);
  }

  const menu = (
    <Menu>
      <Checkbox.Group
        defaultValue={
          defaultCheckedValue ? defaultCheckedValue : newDefaultCheckedValue
        }
        onChange={changeColumns}
        options={chexkGroup}
      />

      <Menu.Item style={{ textAlign: 'center', }}>
        <Button onClick={saveColumns}
          size="small"
          type="primary"
        >
          确定
        </Button>
      </Menu.Item>
    </Menu>
  );

  const tableHeight = document.body.clientHeight;
  let scrollHeight = '';
  /*获取高度值*/
  if (!!height) {
    scrollHeight = tableHeight - height;
  } else {
    scrollHeight = !!isInDetail
      ? tableHeight - 327
      : !!isTab
        ? tableHeight - 251
        : tableHeight - 210;
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
      <Table
        columns={finalColumns}
        dataSource={!!loading ? [] : dataSource}
        locale={{
          emptyText: !!loading ? (
            <ProgressBar
              content={progressContent || '加载中'}
              height={ProgressBarHeight || 400}
            />
          ) : (
            <NullData
              content={emptyText || '暂时没有数据'}
              height={NullDataHeight || 400}
            />
          ),
        }}
        pagination={false}
        rowKey={rowKey || 'id' }
        rowSelection={rowSelection}
        scroll={{
          y: yScroll || scrollHeight,
          x: !!xScroll ? xScroll : contentWidth - 24,
        }}
      />
      {haveSet ? (
        <Dropdown
          overlay={menu}
          overlayClassName="checkGrounp-Items"
          trigger={['click',]}
        >
          <div className="set_icon">
            <Icon className="setting_icon"
              type="setting"
            />
          </div>
        </Dropdown>
      ) : (
        ''
      )}
    </div>
  );
}

export default managerListTable;
