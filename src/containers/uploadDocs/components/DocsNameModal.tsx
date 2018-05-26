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
    hideModal = () => {
        const { uploadDocs } = this.props;
        uploadDocs.hideModal();
    }
    handleSubmit = () => { 
        let { form, uploadDocs } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                values['addType'] = uploadDocs.addType;
                uploadDocs.doAddName(values).then((result)=> form.resetFields());
            }
        });
    };
    render() {
        let { form: { getFieldDecorator }, uploadDocs: { visible, addType } } = this.props;
        let modalTitle = '添加文档名称';
        let formLabel = '文档名称';
        let formRequireMsg = '请输入文档版名称';
        if(addType === 'docsType'){
            modalTitle = '添加文档类型';
            formLabel = '文档类型';
            formRequireMsg = '请输入文档类型';
        }
        return (
            <Modal
                title={modalTitle}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hideModal}
                okText="确认"
                cancelText="取消"
            >
                <Form onSubmit={this.handleSubmit} className="uploadDocs-form">
                    <FormItem
                        {...formItemLayout}
                        label={formLabel}
                    >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: formRequireMsg }],
                        })(
                            <Input placeholder={formLabel}
                            />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(DocsNameModal) as any;
