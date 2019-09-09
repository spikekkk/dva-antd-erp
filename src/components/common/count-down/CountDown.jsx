/*
 *  inilContent string 按钮默认文案
 *  time number 按钮加载时间
 *  temporaryTime number 临时时间
 *  buttonDisabled boolean 按钮加载与禁用
 *  setInterval function 计时方法
 */
import React from 'react';
import { Button } from 'antd';
import moment from 'moment';
import styles from './CountDown.less';

class CountDown extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            initContent : this.props.initContent || '点击免费获取验证码',  //按钮默认文案
            time : !isNaN(parseInt(this.props.time)) ? parseInt(this.props.time) : 5,                  //按钮加载时间
            temporaryTime : !isNaN(parseInt(this.props.time)) ? parseInt(this.props.time) : 5,         //临时时间
            buttonLoading : false,                                      //按钮加载与禁用
            setInterval : undefined,
        }
    }

    componentWillReceiveProps(nextProps){
        if(!!nextProps){
            if(!!nextProps.time){
                this.setState({
                    time : nextProps.exportPath
                });
            }
            if(!!nextProps.initContent){
                this.setState({
                    initContent : nextProps.initContent
                });
            }
        }
    }
    
    componentWillUnmount(){
        clearInterval(this.state.setInterval);
    }
    
    changeTemporaryTime(){     
        this.setState({ temporaryTime : this.state.temporaryTime - 1 })    
    }
    
    changeButtonLoading(){
        clearInterval(this.state.setInterval);
        this.setState({ 
            temporaryTime : this.state.time,
            buttonLoading : false 
        })    
    }
    
    openCountDown(){
        this.setState({ 
            buttonLoading : true,
            setInterval : setInterval(() => this.changeTemporaryTime(),1000)
        });     
        setTimeout(() => this.changeButtonLoading(),this.state.time*1000);      
        this.props.onClick && this.props.onClick();
    }
    
    render(){
        return (
            <Button type = 'primary' disabled = { this.state.buttonLoading } loading = { this.state.buttonLoading } onClick = {() => this.openCountDown()}>
                { !this.state.buttonLoading ?
                    this.state.initContent
                    : 
                    this.state.temporaryTime + 's后可重新获取'
                }        
            </Button>
        );
    }
}
export default CountDown;
