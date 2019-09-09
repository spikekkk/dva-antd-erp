/*
** 高级搜索组件
** @author yhwu
**
 *      searchVisible       boolean     检索栏是否显示     默认值: false
 *      onSearch            function    点击检索时事件     必填
 *      onClear             function    点击检索时事件     必填
 *      wetherChear         boolean     是否清空检索内容
 *      closeSearch         function    点击右上角X关闭
 *      fields:             array       检索栏字段
 *          key               string      后台传数据时的key
 *          type              string      组件类型            input/select/rangePicker/orgSelect **如果type值为orgSelect, options为 object, 参数为TenantOrgFilter组件所需的参数
 *          如果type 为 orgSelect, options 中必须传        *** getPopupContainer : () => document.getElementById( 'super_search_wrap' )
 *          label             string      label
 *          placeholder       string      提醒的文本
 * 			colon             bollean     label后面是否显示冒号
 *          initialValue      string || array || object ...    默认值，根据类型选择
 *			startPlaceholder  string      日期类型开始提示文本 type=rangePicker 时有效
 *			endPlaceholder    string      日期类型结束提示文本 type=rangePicker 时有效
 *          options           array       下拉框的内容 type=select时有效  [{key,label}]
 *          opt_key           string      下拉框 选项的key       默认 key
 *          opt_label         string      下拉框 选项的label字段  默认 label

*/

import React from 'react';
import { Icon, Form, Input, Select, DatePicker, Button, message, TimePicker } from 'antd';
import TenantOrgSelect from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './SuperSearch.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const { keys, values, entries } = Object;

function SuperSearch({
	searchVisible,
	onSearch,
	onClear,
	closeSearch,
    wetherChear,
	fields,
	form : {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}){

	let formItemLayout = {
		labelCol : { span : 10 },
		wrapperCol : { span : 24 }
	}

	let closeProps = {
		closeSearch,
		searchVisible,
	}

	/*搜索*/
	function onSearchClick(){
		let values = getFieldsValue();
		let query = {};
		for( let [ key, value ] of entries( values ) ){
			if( value != undefined && value != '' ){
				query[ key ] = value;
			}
		}
		onSearch && onSearch( query, resetFields );
	}

    if(wetherChear){
        resetFields();
    }

	/*重置*/
	function onClearClick(){
		resetFields();
		onClear && onClear();
	}

	let formItems = [];
	!!fields && fields.map( function( item, index ){
		let type  = item.type;
		let key   = item.key;
		let label = item.label || '';
		let colon = item.false || false;
		let placeholder = item.placeholder || '';
		let startPlaceholder = item.startPlaceholder || '';
		let endPlaceholder = item.endPlaceholder || '';
		let options = item.options;
		let opt_key = item.opt_key || 'key';
		let opt_label = item.opt_label || 'label';
        let initialValue = item.initialValue || undefined;

		let disabled = item.disabled || false;
		if( type == 'input' ){
			formItems.push(
				<FormItem
					key = { 'form_item_' + key }
					{ ...formItemLayout }
					label = { label }
					colon = { colon }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<Input
							size = 'default'
							disabled = { disabled }
							placeholder = { placeholder }
							style = {{ width : '279px' }}
							/>
					)}
				</FormItem>
			)
		}else if( type == 'select' ){
			formItems.push(
				<FormItem
					key = { 'form_item_' + key }
					{ ...formItemLayout }
					label = { label }
					colon = { colon }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<Select
							size = 'default'
							style = {{ width : '279px' }}
							allowClear = { true }
							showSearch = { true }
							optionFilterProp = 'children'
							disabled = { disabled }
							placeholder = { placeholder }
							getPopupContainer = { () => document.getElementById( 'super_search_wrap' ) }
						>
							{ !!options && options.map( function( item, index ){
								return (
									<Option key = { 'select_opt_' + index } value = { item[ opt_key ] + '' } >{ item[ opt_label ] + '' }</Option>
								)
							})}
						</Select>
					)}
				</FormItem>
			)
		}else if( type == 'rangePicker' ){
			formItems.push(
				<FormItem
					key = { 'form_item' + key }
					{ ...formItemLayout }
					label = { label }
					colon = { colon }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<RangePicker
							style = {{ width : '279px' }}
							showTime
							size = 'default'
							format = { item.dateFormat ||  "YYYY-MM-DD HH:mm"}
							placeholder = {[ startPlaceholder, endPlaceholder ]}
							getCalendarContainer = { () => document.getElementById( 'super_search_wrap' ) }
						/>
					)}
				</FormItem>
			)
		}else if( type == 'timePicker' ){
			formItems.push(
				<FormItem
					key = { 'form_item' + key }
					{ ...formItemLayout }
					label = { label }
					colon = { colon }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<TimePicker
							style = {{ width : '279px' }}
							showTime
							size = 'default'
							format = "HH:mm"
							placeholder = { placeholder }
							getPopupContainer = { () => document.getElementById( 'super_search_wrap' ) }
						/>
					)}
				</FormItem>
			)
		}else if( type == 'orgSelect' ){
			formItems.push(
				<FormItem
					key = { 'form_item_' + key }
					{ ...formItemLayout }
					label = { label }
					colon = { colon }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<TenantOrgSelect { ...options } width = { 280 }/>
					)}
				</FormItem>
			)
		}
	})
	return (
		<div className = { searchVisible ? 'super_search_box super_search_box_open' : 'super_search_box' } id = 'super_search_box' >
			<div className = { styles.super_search_header } >
				<div className = { styles.header_text } id = 'header_text'>
					高级搜索
				</div>
				<div className = { styles.header_colse }>
					{ !!searchVisible && <SuperSearchClose { ...closeProps } /> }
				</div>
			</div>
			<div id = 'super_search_wrap' className = 'super_search_wrap' >
				<div className = 'super_search_content' id = 'super_search_content'>
					<div className = 'super_search_content_scroll' >
						<Form>
							{ formItems }
						</Form>
					</div>
				</div>
				<div className = 'super_search_footer' >
					<Button type = 'primary' className = { styles.footer_confirm } onClick = { onSearchClick } >
						搜索
					</Button>
					<Button className = { styles.footer_cancel } onClick = { onClearClick } >
						清除
					</Button>
				</div>
			</div>
		</div>
	)
}

class SuperSearchClose extends React.Component {
	constructor(props) {
        super(props);

        // ES6 类中函数必须手动绑定
        this.otherClick = this.otherClick.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
    }

	componentDidMount(){
		let me = this;

		setTimeout( function(){
			window.addEventListener('click', me.otherClick )
		}, 500)

		//阻止点击关闭时间
		document.getElementById('header_text').addEventListener('click',function( e ){
			e.isInComponent = true;
		})

		document.getElementById('super_search_wrap').addEventListener('click',function( e ){
			e.isInComponent = true;
		})
	}

	componentWillUnmount() {
        window.removeEventListener('click', this.otherClick, false);
    }

	//点击其他区域关闭
	otherClick( e ){
		let isInComponent = e && e.isInComponent;
		let { closeSearch, searchVisible } = this.props;
        if( !isInComponent && searchVisible ) {
            closeSearch && closeSearch();
        }
	}

	//点击关闭按钮
	handleOnClose(){
		this.props.onClose && this.props.onClose();
	}

	render(){
		return (
			<Icon onClick = { this.handleOnClose } style = {{ fontSize : '14px' , cursor : 'pointer' , color : '#fff'}} type = { 'close' } />
		)
	}
}
export default Form.create({})(SuperSearch);
