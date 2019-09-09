import React from 'react';
import { Modal, Button, Input, Form, message } from 'antd';
const { Search } = Input;
const FormItem = Form.Item;
/* 添加白名单 */
function AddWhiteListComponent({
    addWhiteListModalTitle,
    addWhiteListModalVisible,
    //方法
    cancelAddWhiteListModalFn,
    setSearchPhoneNumFn,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
        getFieldValue,
        setFieldsValue,
        resetFields,
    },
}){

    const searchPhoneNumFn = () => {
        validateFieldsAndScroll((err,values) =>{
            const PhonePattern=/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;

            if (!!err) {
                return;
              }
            
            if(!PhonePattern.test(values.searchPhoneNum)){
                message.error('请输入正确的手机号')
                return
            }

            //输入正确的手机号后进行相关操作
            setSearchPhoneNumFn(values.searchPhoneNum)
            // setTimeout(()=>{
            //     cancelAddWhiteListModalFn()
            // },null)
        })
    }

    return (
        <Modal
            afterClose={resetFields}
            title={addWhiteListModalTitle}
            visible={addWhiteListModalVisible}
            onCancel={cancelAddWhiteListModalFn}
            footer={[
                <Button 
                    key="cancelAddWhiteListModal"
                    onClick={cancelAddWhiteListModalFn}
                >
                取消
                </Button>,
                <Button
                    key="confirmAdd"
                    onClick={searchPhoneNumFn}
                    style={{ marginLeft: 20, }}
                    type="primary"
                >
                确定
                </Button>,
            ]}
        >
            <Form>
                <FormItem>
                    {getFieldDecorator('searchPhoneNum',{
                        rules: [
                            { required: true, message: '请输入手机号', },
                        ],
                    })(<Search
                        placeholder="请输入手机号"
                        onSearch={searchPhoneNumFn}
                    />)}
                </FormItem>
            </Form>
        </Modal>
    )
}

export default Form.create({})(AddWhiteListComponent)