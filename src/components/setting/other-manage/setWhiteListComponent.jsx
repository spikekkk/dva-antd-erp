import React from 'react';
import { Modal, Button, Input, Form, message, Checkbox,InputNumber,DatePicker } from 'antd';
import styles from './setWhiteListComponent.less';
import CardInfo from './cardInfo'
import { NullData, } from '../../../components/common/new-component/NewComponent';
import moment from 'moment';
const { Search } = Input;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
/* 设置白名单 */
function SetWhiteListComponent({
    setWhiteListModalTitle,
    setWhiteListModalVisible,
    setWhiteListDrawerInfo,
    whitelistItems,
    mobile,
    cardChoosedId,
    //方法
    cancelSetWhiteListModalFn,
    chooseCardFn,
    chooseCardSetFn,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
        getFieldValue,
        setFieldsValue,
        resetFields,
        getFieldError,
    },
}) {

    const formItemLayout = {
        labelCol: { span: 6, },
        wrapperCol: { span: 18, },
    };

    function setSure(){
        let data=[];
        let turn = true;
        if(cardChoosedId.length === 0){
            message.error('请选择未预约会员卡')
            return false;
        }else{
            cardChoosedId.map(item=>{
                if(!getFieldValue('num,'+item)){
                    turn =false;
                }else{
                    data.push({
                        custId:item.split(',')[0],
                        cardId:item.split(',')[1],
                        remainTimes:getFieldValue('num,'+item).toString(),
                        startTime:moment(getFieldValue('range,'+item)[0]).format('YYYY-MM-DD'),
                        endTime:moment(getFieldValue('range,'+item)[1]).format('YYYY-MM-DD'),
                    })
                }
            })
            if(turn){
                chooseCardSetFn(data)
            }else{
                message.error('勾选的会员卡必须填写预约次数')
            }
        }
    }

    return (
        <Modal
            destroyOnClose={true}
            afterClose={resetFields}
            title={setWhiteListModalTitle}
            visible={setWhiteListModalVisible}
            onCancel={cancelSetWhiteListModalFn}
            footer={[
                <Button
                    key="cancelSetWhiteListModal"
                    onClick={cancelSetWhiteListModalFn}
                >
                    取消
                </Button>,
                <Button
                    key="confirmAdd"
                    style={{ marginLeft: 20, }}
                    type="primary"
                    onClick={setSure}
                >
                    设置
                </Button>,
            ]}
        >
            <Form>
                <FormItem label={'请输入手机号'} required={false}>
                    {getFieldDecorator('searchPhoneNum', {
                        initialValue: mobile,
                        rules: [
                            { required: true, message: '请输入手机号', },
                        ],
                    })(<Search
                        placeholder="请输入手机号"
                        disabled
                    />)}
                </FormItem>
                <h3 className={styles.totalMargin}>相关信息</h3>
                {setWhiteListDrawerInfo.length == 0 ?
                    (
                        <NullData
                            content={'暂时没有数据'}
                        />
                    ) :
                    (
                        setWhiteListDrawerInfo.map((item, index) => {
                            return (
                                <FormItem key={index}>
                                    <p className={styles.totalMargin}>注册时间：{item.registTime}</p>
                                    <p className={styles.totalMargin}>账号下会员卡：</p>
                                    <CheckboxGroup style={{ width: '100%' }} onChange={chooseCardFn}>
                                        {item.cardItemList.map((res, ind) => {
                                            const {
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
                                            }=res
                                            return (
                                                <div key={ind} className={styles.box}>
                                                    <div className={styles.lineTop}>
                                                        <Checkbox disabled={existWhitelist == 1} value={item.custId + ',' + cardId}></Checkbox>
                                                        <div style={{ paddingLeft: 20, borderLeft: '1px dashed rgba(217,217,217,1)', width: 350 }}>
                                                            <p>{vipSpuName}（{obtainTime}:{expireTime}）</p>
                                                            <p>{vipSpuName}绑定者：{name}</p>
                                                            <p style={{ marginBottom: 0 }}>身份证：{idCard}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.lineBottom}>
                                                        <FormItem {...formItemLayout} label='设置预约次数' required>
                                                            {getFieldDecorator('num,'+item.custId + ',' + cardId, {
                                                                initialValue: remainTimes ? remainTimes : 1,
                                                                rules: [{ required: true, message: '请输入预约次数', },],
                                                            })(
                                                                <InputNumber disabled={existWhitelist == 1} min={1} />
                                                            )}
                                                        </FormItem>
                                                        <FormItem {...formItemLayout} label='设置可用时间'>
                                                            {getFieldDecorator('range,'+item.custId + ',' + cardId, {
                                                                initialValue: [startTime ? moment(startTime) : null, endTime ? moment(endTime) : null],
                                                            })(
                                                                <RangePicker disabled={existWhitelist == 1} disabledDate={(time)=>{
                                                                    if(!time){
                                                                        return false
                                                                    }else{
                                                                        return time < moment().add(-1, 'd') || time > moment(expireTime)
                                                                    }
                                                                }} />
                                                            )}
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </CheckboxGroup>
                                </FormItem>
                            )
                        })
                    )
                }
            </Form>
        </Modal>
    )
}

export default Form.create({})(SetWhiteListComponent)