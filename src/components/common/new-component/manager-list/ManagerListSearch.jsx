/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React from 'react';
import Media from 'react-media';
// import locale from 'antd/lib/date-picker/locale/zh_CN';
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
  Popconfirm,
  Radio,
  Badge,
  Upload,
  Cascader,
} from 'antd';
import TreeSelectCourseware from '../tree-select-courseware/TreeSelectCourseware';
import TreeSelectStructure from '../tree-select-structure/TreeSelectStructure';
import TreeSelectOrgDept from '../tree-select-org-dept/TreeSelectOrgDept';
// import SubordinateFilter from '../../../../pages/common/subordinate-filter/SubordinateFilter';
import styles from './ManagerListSearch.less';
// import UploadStudent from '../../../../pages/common/uploadStudent/UploadStudentPage';
import position from '../../../../utils/area.js';
// const addressPosition = position.map(item => {
//   item.children.map(itemInner => {
//     if (itemInner.children) itemInner.children.length = 0;
//     return itemInner;
//   });
//   return item;
// });
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { keys, values, entries, } = Object;

function ManagerListSearch({
  tableHeight,
  search,
  leftBars,
  rightBars,
  form: {
    getFieldDecorator,
    getFieldValue,
    getFieldsValue,
    setFieldsValue,
    validateFields,
    resetFields,
    validateFieldsAndScroll,
  },
}) {
  const { onSearch, onClear, fields, wetherChear, } = search || [];
  const { superSearch, isSuperSearch, } = rightBars || [];

  const leftBarComponents = [];
  const rightBarComponents = [];
  //let groups=[];
  const searchComponents = [];

  function onSearchClick() {
    const values = getFieldsValue();
    const query = {};
    for (const [key, value,] of entries(values)) {
      if (value != undefined && value != '') {
        query[key] = value;
      }
    }
    onSearch && onSearch(query, reset);
  }

  if (wetherChear) {
    resetFields();
  }

  function reset() {
    resetFields();
  }

  function onClearClick() {
    resetFields();
    onClear && onClear({});
  }

  function superSearchClick() {
    superSearch && superSearch();
  }
  // function cascaderOnchange(v) {
  //   if (v.length > 1) {
  //     console.log('终止选择');
  //   }
  // }
  !!fields &&
    fields.map((item, index) => {
      const type = item.type;
      const key = item.key;
      const placeholder = item.placeholder || '';
      const startPlaceholder = item.startPlaceholder || '';
      const endPlaceholder = item.endPlaceholder || '';
      const options = item.options;
      const opt_key = item.opt_key || 'key';
      const opt_label = item.opt_label || 'label';
      const initialValue = item.initialValue || undefined;
      const disabled = item.disabled || false;
      if (type == 'input') {
        searchComponents.push(
          <FormItem key={'form_item_' + key}>
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(
              <Input
                placeholder={placeholder}
                size="default"
                style={{ width: '140px', }}
              />
            )}
          </FormItem>
        );
      } else if (type == 'before') {
        searchComponents.push(
          <FormItem className="input_addon_before"
            key={'form_item_' + key}
          >
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(
              <Input
                placeholder={placeholder}
                prefix={item.addonBefore}
                size="default"
                style={{ width: '340px', }}
              />
            )}
          </FormItem>
        );
      } else if (type == 'select') {
        searchComponents.push(
          <FormItem key={'form_item_' + key}>
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(
              <Select
                allowClear
                optionFilterProp="children"
                placeholder={placeholder}
                showSearch
                size="default"
                style={{ width: '140px', }}
              >
                {!!options &&
                  options.map(function(item, index) {
                    return (
                      <Option
                        key={'select_opt_' + index}
                        value={item[opt_key] + ''}
                      >
                        {item[opt_label] + ''}
                      </Option>
                    );
                  })}
              </Select>
            )}
          </FormItem>
        );
      } else if (type == 'rangePicker') {
        searchComponents.push(
          <FormItem key={'form_item' + key}>
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(
              <RangePicker
                format={item.format || 'YYYY-MM-DD HH:mm'}
                placeholder={[startPlaceholder, endPlaceholder,]}
                showTime={item.showTime == false ? false : true}
                size="default"
                style={{ width: item.width || 140, }}
              />
            )}
          </FormItem>
        );
      } else if (type == 'courseware') {
        searchComponents.push(
          <FormItem key={'form_item_' + key}>
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(<TreeSelectCourseware />)}
          </FormItem>
        );
      } else if (type == 'structure') {
        searchComponents.push(
          <FormItem key={'form_item_' + key}>
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(<TreeSelectStructure />)}
          </FormItem>
        );
      } else if (type == 'dept_org') {
        searchComponents.push(
          <FormItem key={'form_item_' + key}>
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(<TreeSelectOrgDept />)}
          </FormItem>
        );
      } else if (type == 'cascender') {
        searchComponents.push(
          <FormItem key={'form_item_' + key}>
            {getFieldDecorator(key, {
              initialValue: initialValue,
            })(
              <Cascader
                changeOnSelect
                options={position}
                placeholder={placeholder}
                style={{ width: '100%', }}
              />
            )}
          </FormItem>
        );
      }
    });

  const UploadStudentProp = {};
  if (!!rightBars && !!rightBars.Changecolor) {
    UploadStudentProp.Changecolor = rightBars.Changecolor;
  }

  !!rightBars &&
    !!rightBars.btns &&
    rightBars.btns.map(function(item, index) {
      if (item.type && item.type == 'leadsrecord') {
        if (item.isChecked) {
          rightBarComponents.push(
            <Button
              className={styles.right_btn_leadsrecorditemChecked}
              icon={item.icon}
              key={'common_button_' + index + 'Checked'}
              onClick={item.handle}
              size="default"
            >
              {item.label || ''}
            </Button>
          );
        } else {
          rightBarComponents.push(
            <Button
              className={styles.right_btn_leadsrecorditem}
              icon={item.icon}
              key={'common_button_' + index}
              onClick={item.handle}
              size="default"
            >
              {item.label || ''}
            </Button>
          );
        }
      } else if (item.type && item.type == 'sturecord') {
        if (item.isPickOn) {
          rightBarComponents.push(
            <Button
              className={styles.right_btn_sturecorditemPickOn}
              icon={item.icon}
              key={'common_button_' + index + 'PickOn'}
              onClick={item.handle}
              size="default"
            >
              {item.label || ''}
            </Button>
          );
        } else {
          rightBarComponents.push(
            <Button
              className={styles.right_btn_sturecorditem}
              icon={item.icon}
              key={'common_button_' + index}
              onClick={item.handle}
              size="default"
            >
              {item.label || ''}
            </Button>
          );
        }
      } else if (item.type == 'import') {
        const rightBtn = !!tableHeight
          ? { margin: '0 10px 0 0', }
          : { float: 'right', };
        rightBarComponents.push(
          <Upload
            className={item.className}
            {...item.uploadProps}
            key={'common_uploadButton_' + index}
            style={rightBtn}
          >
            <Button icon={item.icon}
              size="default"
            >
              {item.label || ''}
            </Button>
          </Upload>
        );
      } else {
        if (item.className) {
          const rightBtn = !!tableHeight
            ? { margin: '0 10px 0 0', }
            : { float: 'right', };
          rightBarComponents.push(
            <Button
              className={item.className}
              icon={item.icon}
              key={'common_button_' + index}
              onClick={item.handle}
              size="default"
              style={rightBtn}
            >
              {item.label || ''}
            </Button>
          );
        } else {
          const rightBtn = !!tableHeight
            ? { margin: '0 10px 0 0', }
            : { float: 'right', };
          rightBarComponents.push(
            <Button
              className={styles.right_btn_item}
              icon={item.icon}
              key={'common_button_' + index}
              onClick={item.handle}
              size="default"
              style={rightBtn}
            >
              {item.label || ''}
            </Button>
          );
        }
      }
    });

  !!leftBars &&
    !!leftBars.btns &&
    !!leftBars.btns.map(function(item, index) {
      if (item.confirm) {
        leftBarComponents.push(
          <div
            className={styles.handle_btn_item}
            key={'handle_btn_item_' + index}
          >
            <Popconfirm
              cancelText="取消"
              okText="确定"
              onConfirm={item.handle}
              placement="top"
              title={'确定要' + item.label + '吗?'}
            >
              <a className={styles.handle_text_btn}
                href="javascript:void(0);"
              >
                {item.label}
              </a>
            </Popconfirm>
          </div>
        );
      } else {
        leftBarComponents.push(
          <div
            className={styles.handle_btn_item}
            key={'handle_btn_item_' + index}
          >
            <a
              className={styles.handle_text_btn}
              href="javascript:void(0);"
              onClick={item.handle}
            >
              {item.label}
            </a>
          </div>
        );
      }
    });

  return (
    <div className="manager_list_search_box">
      <div
        className={
          !!leftBars && leftBars.labelNum
            ? styles.batch_operation
            : styles.batch_operation_hidden
        }
      >
        {!!leftBars && !!leftBars.label && (
          <span className={styles.has_selected}>
            {leftBars.label + '(' + leftBars.labelNum + ')'}
          </span>
        )}
        {leftBarComponents}
      </div>
      <Form className={styles.search_item}
        layout="inline"
      >
        {/* {!!search && !!search.subordinate && (
          <div className="search_item_subordinate">
            <SubordinateFilter onChange={search.subordinateChange} />
          </div>
        )} */}
        {searchComponents}

        <div className={styles.right_operation}>
          {/* {!!rightBars && !!rightBars.isShowUpload && (
            <UploadStudent {...UploadStudentProp} />
          )} */}
          {/*rightBarComponents*/}

          {!!rightBars && !!rightBars.isSuperSearch && (
            <Button
              className={styles.super_search}
              onClick={superSearchClick}
              size="default"
              style={{ marginLeft: '20px', }}
              type="primary"
            >
              {!!rightBars.superSearchVisible ? '关闭' : '高级搜索'}
            </Button>
          )}
        </div>
        <div
          className={
            !tableHeight || (!!leftBars && leftBars.labelNum)
              ? 'btn_group'
              : 'btn_group_media'
          }
          style={!!search && !!search.style ? search.style : {}}
        >
          <Button
            className="btn_group_search"
            onClick={onSearchClick}
            size="default"
            type="primary"
          >
            <div className="search_icon" />
          </Button>
          <Button
            className="btn_group_clear"
            onClick={onClearClick}
            size="default"
          >
            <div className="reset_icon" />
          </Button>
        </div>
      </Form>
      {/* {!!search && !!search.onSearch && !!search.onClear && (
        <div
          className={
            !tableHeight || (!!leftBars && leftBars.labelNum)
              ? 'btn_group'
              : 'btn_group_media'
          }
          style={!!search && !!search.style ? search.style : {}}
        >
          <Button
            className="btn_group_search"
            onClick={onSearchClick}
            size="default"
            type="primary"
          >
            <div className="search_icon" />
          </Button>
          <Button
            className="btn_group_clear"
            onClick={onClearClick}
            size="default"
          >
            <div className="reset_icon" />
          </Button>
        </div>
      )} */}
      {rightBarComponents}
    </div>
  );
}

export default Form.create({})(ManagerListSearch);
