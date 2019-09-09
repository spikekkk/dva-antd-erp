import React from 'react';
import {Checkbox,InputNumber, DatePicker,Form } from 'antd';
import styles from './cardInfo.less';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
function CardInfo({
    cardId,
    endTime,
    existWhitelist,
    expireTime,
    idCard,
    name,
    obtainTime,
    remainTimes,
    startTime,
    vipSkuId,
    vipSpuId,
    vipSpuName,
    vipTopType,
    vipType,
    //~~~~~~~~~~~~~~~~~~~~`
    ind,
    custId,
    inputNumberChangeFn,
}){
    const formItemLayout = {
        labelCol: { span: 6, },
        wrapperCol: { span: 18, },
    };
    

    //设置日期选择范围
    function handleDate(time){
        if(!time){
			return false
		}else{
			return time < moment().add(-1, 'd') || time > moment(expireTime)
		}
    }

    return (
        <div className={styles.box}>
            <div className={styles.lineTop}>
                <Checkbox value={custId + ',' +cardId}></Checkbox>
                <div style={{paddingLeft:20,borderLeft:'1px dashed rgba(217,217,217,1)',width:350}}>
                    <p>{vipSpuName}（{obtainTime}:{expireTime}）</p>
                    <p>{vipSpuName}绑定者：{name}</p>
                    <p style={{marginBottom:0}}>身份证：{idCard}</p>
                </div>
            </div>
            <div className={styles.lineBottom}>
                <FormItem {...formItemLayout} label='设置预约次数' required>
                    {getFieldDecorator({cardId},{
                        initialValue:expireTime,
                    })(
                        <InputNumber onChange={inputNumberChangeFn} min={1} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label='设置可用时间'>
                    <RangePicker defaultValue={[ startTime ? moment(startTime) : null, endTime ? moment(endTime): null]}  disabledDate={handleDate} />
                </FormItem>
            </div>
        </div>
    )
}

export default CardInfo;