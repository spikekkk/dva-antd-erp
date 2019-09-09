import React from 'react'
import { Modal, Upload, Form, Icon, message } from 'antd'
const FormItem = Form.Item;
import { transformPic, } from '../../../utils/uploadUtils';

function NewArrivalComponent({
    newArrivalVisible,
    newArrivalImage,
    newArrivalImageVisible,
    //方法
    hideNewArrivalModalFn,
    newArrivalPreview,
    newArrivalCancel,
    setNewPlatGoods,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
        getFieldValue,
        setFieldsValue,
        resetFields,
    },
}) {

    const formItemLayout = {
        labelCol: { span: 6, },
        wrapperCol: { span: 18, },
    };

    const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="upload_text">选择图片</div>
        </div>
    );

    /*封面图*/
    const normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    /*上传状态改变*/
    const uploadStatus = info => {
        if (
            info.file.status != 'uploading' &&
            info.file.response &&
            info.file.response.errorCode != 9000
        ) {
            return message.error(info.file.response.errorMessage || '上传失败');
        }
        if (info.file.status === 'done') {
            message.success('上传成功');
        } else if (info.file.status === 'error') {
            message.error('上传失败');
        }
    };

    /*图片大小限制*/
    function imgMaxSize(file, size, title) {
        const fileSize = file.size;
        if (fileSize > 1048576 * size) {
            message.error(title + '大小不能超过' + size + 'M');
            return false;
        }
    }

    //判断
    const goodsP= () => {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            setNewPlatGoods(transformPic(values.card))
        })
    }

    return (
        <Modal
            afterClose={resetFields}
            title={'上新操作'}
            visible={newArrivalVisible}
            onCancel={hideNewArrivalModalFn}
            onOk={goodsP}
        >
            <Form>
                <FormItem
                    {...formItemLayout}
                    help="推荐尺寸750*666, 支持png, jpeg, gif格式的图片, 不大于5M"
                    label="新品展示图"
                    required
                >
                    {getFieldDecorator('card', {
                        valuePropName: 'fileList',
                        action: `${BASE_URL}/manage/uploadController/upload`,
                        normalize: normFile,
                        rules: [
                            { type: 'array', required: true, message: '卡面图', },
                        ],
                    })(
                        <Upload
                            action={BASE_URL + '/manage/uploadController/upload'}
                            beforeUpload={(file, fileList) =>
                                imgMaxSize(file, 5, '新品展示图')
                            }
                            listType="picture-card"
                            onChange={uploadStatus}
                            onPreview={newArrivalPreview}
                        >
                            {getFieldValue('card') && getFieldValue('card').length >= 1
                                ? null
                                : uploadButton}
                        </Upload>
                    )}
                </FormItem>
                <Modal
                    footer={null}
                    onCancel={newArrivalCancel}
                    visible={newArrivalImageVisible}
                    wrapClassName="upload_modal"
                >
                    <img alt="新品展示图"
                        src={newArrivalImage}
                        style={{ width: '100%', }}
                    />
                </Modal>
            </Form>
        </Modal>
    )
}

export default Form.create({})(NewArrivalComponent);