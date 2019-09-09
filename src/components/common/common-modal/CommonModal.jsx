/*
 *author zhaojian
 *children 表单内容(默认[])
 *title 表单标题(默认'表单标题')
 *maskClosable 点击蒙层是否关闭(默认false)
 *visible boolean modal是否显示
 *onOk function 点击确认事件
 *onCancel function 点击取消事件
 *onButtonLoading 确认按钮加载状态
 *footerEnsure 确认按钮内的文字
 *footerCancel 取消按钮内的文字
 *isScrollBar 组件内是否出现滚动条
 */
import React from 'react';
import { Modal , Button , Form } from 'antd';
import styles from './CommonModal.less';

class CommonModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            children : this.props.children || undefined,       
            title : this.props.title || '表单标题',         
            maskClosable : this.props.maskClosable || false, 
            visible : this.props.maskClosable || false,      
            closable : this.props.maskClosable || true,       
            width : this.props.width || 500,            
            onButtonLoading : this.props.onButtonLoading || false,  
            footerEnsure : this.props.footerEnsure || '确认', 
            footerCancel : this.props.footerCancel || '取消', 
            isScrollBar : false,
        }
    }

    componentWillReceiveProps(nextProps){
        console.info(nextProps)
        if(!!nextProps){
//            if(!!nextProps.visible){
//                this.setState({
//                    visible : nextProps.visible
//                });
//            }
        }
        this.setState({
            visible : nextProps.visible
        });
    }
    
    componentDidMount(){
        //初始化阻止提交
//        this.props.form.validateFields();
//        this.props.form.validateFieldsAndScroll();
    }   
    
    componentDidUpdate(){
        if(document.getElementById('zj_global_common_modal')){
            let div = document.getElementById('zj_global_common_modal');
            if(this.state.isScrollBar == false && div.scrollHeight > div.clientHeight){
                this.setState({
                    isScrollBar : true   
                })   
            }
        }  
    }
     
    componentWillUnmount(){

    }
    
    onOk(e){
        e.preventDefault();
        this.props.onOk && this.props.onOk();      
    }
    
    onCancel(){
        this.props.onCancel && this.props.onCancel();   
    }
    
    afterClose(){
        this.props.afterClose && this.props.afterClose();
    }
    
    render(){    
        
        return (
            <Modal 
                className = 'zj_global_common_modal'
                title = { this.state.title }
                maskClosable = { this.state.maskClosable }
                visible = { this.state.visible }
                closable = { this.state.closable }
                width = { this.state.width }
                onOk = { (e) => this.onOk(e) }
                onCancel = { () => this.onCancel() }
                afterClose = { () => this.afterClose() }
                footer = {[
                    <Button key="onCancel" type="ghost" size='default' onClick={ () => this.onCancel() } style={{ minWidth : 80 }}>
                        { this.state.footerCancel || '取消' }
                    </Button>,
                    <Button
                        key="onOk" type="primary" onClick={ (e) => this.onOk(e) } size='default'
                        disabled={ this.state.onButtonLoading || false }
                        loading={ this.state.onButtonLoading || false }
                        style={{ minWidth : 80 , marginLeft : 20  }}>
                        { this.state.footerEnsure || '确定' }
                    </Button>
                ]}
            >
                <div id = 'zj_global_common_modal' className={ this.state.isScrollBar ? styles.zj_global_common_modal_inner_scroll : styles.zj_global_common_modal_inner }>                 
                    { this.state.children || [] }                  
                </div>
            </Modal>
        );
    }
}
export default CommonModal;
