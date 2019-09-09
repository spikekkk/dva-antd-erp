/* treeSelect课件分类下拉列表查询
 * @author 赵健
 */

import React from 'react';
import { TreeSelect, } from 'antd';
import Media from 'react-media';
import styles from './TreeSelectStructure.less';
const TreeNode = TreeSelect.TreeNode;

class TreeSelectStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: undefined, //显示值
      loading: false, //是否加载中
      listContent: [],
      allow_clear: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps && nextProps.value ? nextProps.value : undefined;
    this.setState({ structure: value, });
  }

  componentDidMount() {
    const me = this;
    serviceRequest(`${BASE_URL}/crm/hq/dept/departTreeQuery`, {}, function(
      ret
    ) {
      me.setState({ listContent: ret.results, });
    });
  }

  onChange(value) {
    this.setState({ structure: value, });
    this.props.onChange && this.props.onChange(value);
  }

  onSelect(value, node, extra) {
    this.setState({ structure: value, });
    this.props.onSelect && this.props.onSelect(value, node.props.title);
  }

  formatData(data) {
    const structure = this.state.structure;
    return (
      data &&
      data.map((item, index) => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              disabled={structure == item.id || this.props.value == item.id}
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
              disabled={structure == item.id || this.props.value == item.id}
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
    const { listContent, structure, allow_clear, } = this.state;
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
              notFoundContent="没有部门"
              onChange={value => this.onChange(value)}
              onSelect={(value, node, extra) =>
                this.onSelect(value, node, extra)
              }
              placeholder="请选择部门"
              searchPlaceholder="查询部门"
              showSearch
              style={{ width: this.props.width || 200, }}
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              value={structure || this.props.value || undefined}
            >
              <TreeNode
                disabled
                key="all_structure"
                title="所有部门"
                value="all_structure"
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
              notFoundContent="没有部门"
              onChange={value => this.onChange(value)}
              onSelect={(value, node, extra) =>
                this.onSelect(value, node, extra)
              }
              placeholder="请选择部门"
              searchPlaceholder="查询部门"
              showSearch
              style={{ width: this.props.width || 300, }}
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              value={structure || this.props.value || undefined}
            >
              <TreeNode
                disabled
                key="all_structure"
                title="所有部门"
                value="all_structure"
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

export default TreeSelectStructure;
