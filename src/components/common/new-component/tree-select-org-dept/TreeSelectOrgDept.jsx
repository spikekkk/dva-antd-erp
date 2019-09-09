/* treeSelect课件分类下拉列表查询
 * @author 赵健
 */

import React from 'react';
import { TreeSelect , Icon } from 'antd';
import Media from 'react-media';
import styles from './TreeSelectOrgDept.less';
const TreeNode = TreeSelect.TreeNode;

class TreeSelectOrgDept extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            orgDept : undefined,                //显示值
            loading : false,                    //是否加载中
            listContent : [],
            allow_clear : false,
        }
    }

    componentWillReceiveProps(nextProps) {
        let value = nextProps && nextProps.value ? nextProps.value : undefined;
        this.setState({ orgDept : value });
    }

    componentDidMount(){
        let me = this;
        serviceRequest(`${BASE_URL}/crm/hq/org/orgDeptTreeQuery`, {},
            function(ret) {
                me.setState({ listContent : ret.results })
            }
        );
    }

    onChange(value){
        this.setState({ orgDept : value });
        this.props.onChange && this.props.onChange(value)
    }

    onSelect(value, node, extra){
        this.setState({ orgDept : value });
        this.props.onSelect && this.props.onSelect(value,node.props.title)
    }

    formatData(data){
        let orgDept = this.state.orgDept;
        return(
            data && data.map((item,index) => {
                if(item.children && item.children.length > 0) {
                    return (
                        <TreeNode key = { item.tenant_id + '-' + item.key } initTitle = { item.label } title = {
                                item.type == 'org' ? <div className = { styles.item }><Icon type = 'xiaoquguanli' className={styles.icon}/><span>{ item.label }</span></div> : item.label } value = { item.tenant_id + '-' + item.key } disabled = { !(item.type == 'org') || orgDept == (item.tenant_id + '-' + item.key) }>
                            { this.formatData(item.children) }
                        </TreeNode>
                    );
                }else{
                    return <TreeNode key = { item.tenant_id + '-' + item.key } initTitle = { item.label } title = {
                                item.type == 'org' ? <div className = { styles.item }><Icon type = 'xiaoquguanli' className={styles.icon}/><span>{ item.label }</span></div> : item.label } value = { item.tenant_id + '-' + item.key } disabled = { !(item.type == 'org') || orgDept == (item.tenant_id + '-' + item.key) }/>;
                }
            })
        )
    }

    render(){
        let { listContent , orgDept , allow_clear } = this.state;
        let renderListContent = this.formatData(listContent);
        return(
            <Media query="(max-width: 1350px)">
                { matches => matches ?
                    (<TreeSelect
                        showSearch
                        treeDefaultExpandAll
                        style = {{ width: this.props.width || 200 }}
                        dropdownStyle = {{ maxHeight: 400, overflow: 'auto' }}
                        value = { orgDept || this.props.value || undefined }
                        placeholder = "请选择校区"
                        allowClear = { this.props.allowClear || allow_clear }
                        onChange = {(value) => this.onChange(value)}
                        onSelect = {(value, node, extra) => this.onSelect(value, node, extra)}
                        disabled = { this.props.disabled || false }
                        searchPlaceholder = "查询校区"
                        treeNodeFilterProp = 'initTitle'
                        notFoundContent = '没有校区'
                        getPopupContainer = { this.props.getPopupContainer || document.getElementById('body') }
                      >
                          <TreeNode value = "all_orgDept" title = "所有校区" key = "all_orgDept" disabled>
                              { renderListContent }
                          </TreeNode>
                    </TreeSelect>):
                    (<TreeSelect
                        showSearch
                        treeDefaultExpandAll
                        style = {{ width: this.props.width || 300 }}
                        dropdownStyle = {{ maxHeight: 400, overflow: 'auto' }}
                        value = { orgDept || this.props.value || undefined }
                        placeholder = "请选择校区"
                        allowClear = { this.props.allowClear || allow_clear }
                        onChange = {(value) => this.onChange(value)}
                        onSelect = {(value, node, extra) => this.onSelect(value, node, extra)}
                        disabled = { this.props.disabled || false }
                        searchPlaceholder = "查询校区"
                        treeNodeFilterProp = 'initTitle'
                        notFoundContent = '没有校区'
                        getPopupContainer = { this.props.getPopupContainer || document.getElementById('body') }
                      >
                          <TreeNode value = "all_orgDept" title = "所有校区" key = "all_orgDept" disabled>
                              { renderListContent }
                          </TreeNode>
                    </TreeSelect>)
                }
            </Media>
        )
    }
}

export default TreeSelectOrgDept;
