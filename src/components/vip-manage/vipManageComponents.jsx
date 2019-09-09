import React from 'react'
import { connect, } from 'dva';
import { Modal, Input, Button, Card, List, Form } from 'antd';
import styles from './vipManageComponents.less'
const FormItem = Form.Item;

function VipManageComponent({
    changeVisible,
    edit,
    cancelModalFn,
    showEditFn,
    hideEditFn
}) {
    const formItemLayout = {
        labelCol: { span: 6, },
        wrapperCol: { span: 18, },
    };

    return (
        <Modal
            visible={changeVisible}
            title={'相关会员卡信息'}
            footer={null}
            destroyOnClose={true}
            onCancel={cancelModalFn}
            width={'70%'}
        >
            <div style={{overflow:'hidden',zoom:1}}>
                <Card
                    title={'亲子卡'}
                    extra={'(2019.01.01-2019.01.01)'}
                    size='small'
                    className={styles.cardbox}
                    bodyStyle={{ padding: '10px 24px' }}
                >
                    {edit ? (<Form>
                        <p>绑定人信息</p>
                        <FormItem {...formItemLayout}
                            label={'姓名'}
                        >
                            <Input placeholder={'姓名'} />
                        </FormItem>
                        <FormItem {...formItemLayout}
                            label={'身份证'}
                        >
                            <Input placeholder={'身份证'} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' style={{ float: 'right' }}>确定</Button>
                            <Button onClick={hideEditFn} style={{ float: 'right', marginRight: '10px' }}>取消</Button>
                        </FormItem>
                    </Form>) : (<div>
                        <p>绑定人信息</p>
                        <p>姓名：土豆</p>
                        <p>身份证：33032299898899</p>
                        <div style={{ height: 30 }}>
                            <Button
                            onClick={showEditFn}
                            type="primary"
                            style={{ float: 'right' }}
                            >修改</Button>
                        </div>
                    </div>)}
                </Card>
                <Card
                    title={'亲自卡'}
                    extra={'(2019.01.01-2019.01.01)'}
                    size='small'
                    className={styles.cardbox}
                    bodyStyle={{ padding: '10px 24px' }}
                >
                    <p>xxx</p>
                    <p>xxx</p>
                    <p>xxx</p>
                    <div style={{ height: 30 }}>
                        <p style={{ float: 'right' }}>提交修改审核中，不可修改</p>
                    </div>
                </Card>
            </div>
            <div style={{ height: 20, margin: '10px 0', position: 'relative', width: '100%', background: '#ccc' }}></div>
            <div>
                <h3>修改记录</h3>
                <List>
                    <List.Item>
                        <List.Item.Meta
                            title={(
                                <p>2019.01.01 00:00 <span>亲子卡</span>绑定人信息修改<span>成功</span>（由XXXXXXXXXXXXXXXXX）</p>
                            )}
                            description={(
                                <span>备注信息xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
                            )}
                        />
                        <div>content</div>
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title={(
                                <p>2019.01.01 00:00 <span>亲子卡</span>绑定人信息修改<span>成功</span>（由XXXXXXXXXXXXXXXXX）</p>
                            )}
                            description={(
                                <span>备注信息xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
                            )}
                        />
                        <div>content</div>
                    </List.Item>
                </List>
            </div>
        </Modal>
    )
}

export default Form.create({})(VipManageComponent);