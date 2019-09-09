/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
/* treeSelect课件分类下拉列表查询
 * @author 赵健
 */

import React from 'react';
import { TreeSelect, } from 'antd';
import Media from 'react-media';
import styles from './TreeSelectCourseware.less';
const TreeNode = TreeSelect.TreeNode;

class TreeSelectCourseware extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseware: undefined, //显示值
      loading: false, //是否加载中
      listContent: [],
      allow_clear: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps && nextProps.value ? nextProps.value : undefined;
    this.setState({ courseware: value, });
  }

  componentDidMount() {
    const me = this;
    serviceRequest(
      `${BASE_URL}/crm/hq/coursewareCategory/catTree`,
      {},
      function(ret) {
        me.setState({ listContent: ret.results, });
      }
    );
  }

  onChange(value) {
    this.setState({ courseware: value, });
    this.props.onChange && this.props.onChange(value);
  }

  onSelect(value, node, extra) {
    this.setState({ courseware: value, });
    this.props.onSelect && this.props.onSelect(value, node.props.title);
  }

  formatData(data) {
    const courseware = this.state.courseware;
    return (
      data &&
      data.map((item, index) => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              disabled={
                !item.choosable ||
                courseware == item.id ||
                this.props.value == item.id
              }
              key={item.id}
              title={item.name}
              value={item.id}
            >
              {this.formatData(item.children)}
            </TreeNode>
          );
        } else {
          return (
            <TreeNode
              disabled={
                !item.choosable ||
                courseware == item.id ||
                this.props.value == item.id
              }
              key={item.id}
              title={item.name}
              value={item.id}
            />
          );
        }
      })
    );
  }

  render() {
    const { listContent, courseware, allow_clear, } = this.state;
    const renderListContent = this.formatData(listContent);
    return (
      <Media query="(max-width: 1350px)">
        {matches =>
          matches ? (
            <TreeSelect
              allowClear={allow_clear}
              disabled={this.props.disabled || false}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', }}
              getPopupContainer={
                this.props.getPopupContainer || document.getElementById('body')
              }
              notFoundContent="没有分类"
              onChange={value => this.onChange(value)}
              onSelect={(value, node, extra) =>
                this.onSelect(value, node, extra)
              }
              placeholder="请选择课件分类"
              searchPlaceholder="查询课件分类"
              showSearch
              style={{ width: this.props.width || 200, }}
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              value={courseware || this.props.value || undefined}
            >
              <TreeNode
                disabled
                key="all_courseware"
                title="所有分类"
                value="all_courseware"
              >
                {renderListContent}
              </TreeNode>
            </TreeSelect>
          ) : (
            <TreeSelect
              allowClear={allow_clear}
              disabled={this.props.disabled || false}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', }}
              getPopupContainer={
                this.props.getPopupContainer || document.getElementById('body')
              }
              notFoundContent="没有分类"
              onChange={value => this.onChange(value)}
              onSelect={(value, node, extra) =>
                this.onSelect(value, node, extra)
              }
              placeholder="请选择课件分类"
              searchPlaceholder="查询课件分类"
              showSearch
              style={{ width: this.props.width || 300, }}
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              value={courseware || this.props.value || undefined}
            >
              <TreeNode
                disabled
                key="all_courseware"
                title="所有分类"
                value="all_courseware"
              >
                {renderListContent}
              </TreeNode>
            </TreeSelect>
          )
        }
      </Media>
    );
  }
}

export default TreeSelectCourseware;
