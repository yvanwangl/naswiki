import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import UploadDocsStore from '../UploadDocsStore';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

export interface DocsNameProps {
    uploadDocs: UploadDocsStore
};

@inject('uploadDocs')
@observer
class DocsNameModal extends React.Component<DocsNameProps & FormComponentProps> {
    state = { visible: false }
    showModal = () => {
        const { uploadDocs } = this.props;
        uploadDocs.showModal();
    }
    hideModal = () => {
        const { uploadDocs } = this.props;
        uploadDocs.hideModal();
    }
    handleSubmit = () => { 
        let { form, uploadDocs } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                uploadDocs.doAddDocsName(values).then((result)=> form.resetFields());
            }
        });
    };
    render() {
        let { form: { getFieldDecorator }, uploadDocs: { visible } } = this.props;
        return (
            <Modal
                title="添加文档名称"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hideModal}
                okText="确认"
                cancelText="取消"
            >
                <Form onSubmit={this.handleSubmit} className="uploadDocs-form">
                    <FormItem
                        {...formItemLayout}
                        label="文档名称"
                    >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入文档版名称' }],
                        })(
                            <Input placeholder="文档名称"
                            />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(DocsNameModal) as any;
