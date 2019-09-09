/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/*
 * 公共的管理列表界面渲染组件
 * @author yhwu
 *
 * search:                              检索栏相关配置
 *      onSearch            function    点击检索时事件     必填
 *      onClear             function    点击检索时事件     必填
 *      wetherChear         boolean     是否清空搜索内容
 *      subordinate         boolean     是否需要按下属过滤   默认false
 *      subordinateChange   function     下属变更时事件
 *      fields:             array       检索栏字段
 *          key               string      后台传数据时的key
 *          type              string      组件类型            input/select/rangePicker/orgSelect **如果type值为orgSelect, options为 object, 参数为TenantOrgFilter组件所需的参数
 *          label             string      label
 *          placeholder       string      提醒的文本
 * 			colon             bollean     label后面是否显示冒号
 *          initialValue      string || array || object ...    默认值，根据类型选择
 *			startPlaceholder  string      日期类型开始提示文本 type=rangePicker 时有效
 *			endPlaceholder    string      日期类型结束提示文本 type=rangePicker 时有效
 *          options           array       下拉框的内容 type=select时有效  [{key,label}]
 *          opt_key           string      下拉框 选项的key       默认 key
 *          opt_label         string      下拉框 选项的label字段  默认 label

 * table:                               表格列表相关配置
 *      xScroll           number        出现横向滚动条的最小宽度
 *      yScroll           number        出现纵向向滚动条的最小宽度
 *      height            number        出现纵向滚动条
 *      isHasBtn          boolean       如果详情tab页下有按钮需传入
 *		isInDetail        boolean       如果详情则需传入
 *      isTab                           如果tab则需传入
 *      newColumns          array       表格项是否显示项
 *      haveSet             boolean     是否显示有设置
 *      changeColumns		func        改变表格显示项
 *      saveColumns     func        保存表格显示项目
 * defaultCheckedValue   []          默认选择的checked项目
 *      loading             boolean     列表是否在加载中    默认值: false
 *      columns             array       列展示规则
 *      dataSource          array       列表数据
 *      emptyText           string      列表为空时显示文字  默认值: '暂时没有数据'
 *      progressContent     string      加载进度条中的文字内容
 *      rowKey              string      列表id项
 *      rowSelection        object      行选择配置项
 *              type        string      选择类型  多选/单选    checkbox or radio
 *              selectedRowKeys array   选中的行
 *              onChange    function    行选择变化时
 *              onSelectAll function    选择全部行时

 * leftBars: 左侧操作按钮
 *      label               string      按钮区标题
 *      btns:               array        按钮配置
 *          label           string      按钮显示文字
 *          handle          function    按钮触发事件
 *          confirm         boolean     是否需要确认

 * rightBars: 右侧操作按钮
 *      isShowUpload        bool        引入导入学员
 *      btns:               array       按钮配置
 *          label           string      按钮显示文字
 *          icon            string      按钮显示图标
 * 			disabled		bool		是否不可点击
 *          handle          function    按钮触发事件
 *          confirm         boolean     是否需要确认
 *          className       className   添加特殊btn样式
 *		isSuperSearch       bool        是否有高级搜索按钮
 *      superSearch         func        高级搜索点击事件
 *      superSearchVisible  bool        高级搜索是否显示      状态与高级搜索组件的searchVisible保持一致

 *	pagination: 分页参数
 *              width       number      分页器宽度
 *              total       number      数据总条数
 *              current     number      当前页码(从0开始)
 *              pageSize    number      每页显示条数
 *              showTotal   function    用于显示数据总量和当前数据顺序 Function(total, range) 可选
 *              showSizeChanger   boolean    是否可以改变 pageSize
 *              onShowSizeChange  function    pageSize 变化的回调      Function(current, size)
 *              showQuickJumper   boolean    是否可以快速跳转至某页

 */
import React from 'react';
import {
  Table,
  Icon,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Pagination,
  Menu,
  Dropdown,
} from 'antd';
import ManagerListSearch from './ManagerListSearch';
import ManaferListTable from './ManagerListTable';
import SetItems from './SetItems';
import styles from './ManagerList.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const MenuItem = Menu.Item;

function ManagerList({
  tableHeight,
  search,
  leftBars,
  rightBars,
  table,
  pagination,
  incomeBars,
}) {
  const { columns, newColumns, changeColumns, } = table || {};

  function changeTableItems(params) {
    const newColumns = [];
    !!columns &&
      columns.map(function(item, index) {
        if (!!params && params.indexOf(item.key) != -1) {
          newColumns.push(item);
        }
      });
    newColumns.unshift(columns[0]);
    let i = 0; //判断是否存在没有宽度的列
    !!newColumns &&
      newColumns.map(function(item, index) {
        if (!!item.width) {
          i++;
        }
      });
    if (newColumns.length == i) {
      newColumns.push({
        dataIndex: 'adjust_key',
        key: 'adjust_key',
      });
    }
    changeColumns(newColumns);
  }

  /*搜索属性*/
  const managerListSearchProps = {
    search,
    leftBars,
    rightBars,
    tableHeight,
  };

  /*表格属性*/
  const managerListTableProps = {
    ...table,
  };

  let boxWidth =
    !!pagination && !!pagination.width
      ? pagination.width
      : 'calc( 100% - 170px )';
  if (!!table) {
    if (table.isInDetail) {
      boxWidth = 'calc( 100% - 20px )';
    } else if (table.isTab) {
      boxWidth = '100%';
    }
  }

  return (
    <div className="list_tab_height"
      style={{ height: '100%', }}
    >
      <div className="manager_list_wrap"
        id="manager_list_wrap"
      >
        {(!!search || !!leftBars || !!rightBars) && (
          <div
            className={
              !tableHeight || (!!leftBars && leftBars.labelNum)
                ? styles.manager_list_search
                : styles.manage_list_search_media
            }
          >
            {(!!search || !!leftBars || !!rightBars) && (
              <ManagerListSearch {...managerListSearchProps} />
            )}
          </div>
        )}
        {!!incomeBars && (
          <div className={styles.manager_income_number}>
            <p>
              收入 :{' '}
              <span className={styles.incomeNum}>
                {incomeBars.totalIncomeNum}
              </span>
              元
            </p>
            <p>
              数量 : <span>{incomeBars.incomeCount}</span>笔
            </p>
          </div>
        )}
        <div
          className="manager_list_wrap_table"
          style={{
            position: 'relative',
            height: tableHeight || 'calc( 100% - 42px )',
          }}
        >
          {!!table && <ManaferListTable {...managerListTableProps} />}
        </div>
      </div>
      {!!pagination && (
        <div
          className="manager_list_pagination_box"
          style={{
            bottom: !!table && table.isInDetail ? '49px' : '',
            margin: !!table && table.isInDetail && !table.isTab ? '0 10px' : '',
            width: boxWidth,
          }}
        >
          <div className="manager_list_pagination">
            <Pagination
              {...pagination}
              current={parseInt(pagination.pageIndex) + 1}
              pageSizeOptions={['20', '50', '100', '500', '1000',]}
              size="small"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerList;
