import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import UploadDocsStore from '../UploadDocsStore';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Input, Upload, Button, Icon, Modal } from 'antd';
import DocsNameModal from './DocsNameModal';
import Header from '../../../components/Header';
const { httpServer } = require('../../../system.config');
import './index.css';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const buttonItemLayout = {
    wrapperCol: { span: 16, offset: 8 },
};

export interface UploadDocsProps {
    uploadDocs: UploadDocsStore;
}

export interface UploadDocsState {
    openDialog: boolean;
}

@inject('uploadDocs')
@observer
class UploadDocs extends React.Component<UploadDocsProps & FormComponentProps & RouteComponentProps<any>, UploadDocsState> {

    constructor(props: UploadDocsProps & FormComponentProps & RouteComponentProps<any>) {
        super(props);
    }

    handleSubmit = (e: any) => {
        let { form, uploadDocs: { doSubmitDocsInfo }, history } = this.props;
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                doSubmitDocsInfo(values).then((result) => {
                    if (result.success) {
                        Modal.success({
                            title: '上传成功',
                            content: '恭喜小主，上传成功啦 😊'
                        });
                        form.resetFields();
                        history.push('/');
                    } else {
                        Modal.error({
                            title: '上传失败',
                            content: result.errorCode
                        });
                    }
                },
                    () => {
                        Modal.error({
                            title: '上传失败',
                            content: '由于外力影响，上传失败啦 😢'
                        });
                    });
            }
        });
    }

    handleCancel = () => {
        let { history } = this.props;
        history.push('/');
    };

    handleAddName = (addType: string) => {
        const { uploadDocs } = this.props;
        uploadDocs.showModal(addType);
    };

    normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    handleUploadChange = (info: any) => {
        let { form } = this.props;
        if (info.file.status === 'done') {
            form.setFieldsValue({
                docsLink: info.file.response.data.docsLink
            });
        } else if (info.file.status === 'error') {

        }
    };

    componentWillUpdate(nextProps: UploadDocsProps & FormComponentProps) {
        const { form: { setFieldsValue }, uploadDocs: { newDocsNameId, newDocsTypeId, resetNewDocsId } } = nextProps;
        if (newDocsNameId) {
            setFieldsValue({
                docsNameId: newDocsNameId
            });
            resetNewDocsId('newDocsNameId');
        }
        if (newDocsTypeId) {
            setFieldsValue({
                docsTypeId: newDocsTypeId
            });
            resetNewDocsId('newDocsTypeId');
        }
    }

    // componentDidMount() {
    //     const { uploadDocs: { fetchDocsNameList, fetchDocsTypeList } } = this.props;
    //     fetchDocsNameList();
    //     fetchDocsTypeList();
    // }

    modalCreator = () => <DocsNameModal />

    render() {
        const { form: { getFieldDecorator } } = this.props;
        return (
            <div className='UploadDocs-container'>
                <Header headerSmall={true} />
                <div className='UploadDocs-title'>
                    <h2>上传文档</h2>
                </div>
                <Form onSubmit={this.handleSubmit} className="uploadDocs-form">
                    <FormItem
                        {...formItemLayout}
                        label="文档名称"
                    >
                        {getFieldDecorator('docsName', {
                            rules: [
                                {
                                    required: true, message: '请输入文档名称'
                                },
                                {
                                    max: 50,
                                    message: '文档名称不能多于 50 字'
                                }
                            ],
                        })(
                            <Input
                                placeholder="文档名称"
                            />
                        )}
                    </FormItem>
                    {/* <FormItem
                        style={{ textAlign: 'right' }}
                    >
                        <Button onClick={()=> this.handleAddName('docsName')}>
                            + 文档名称
                        </Button>
                    </FormItem> */}
                    <FormItem
                        {...formItemLayout}
                        label="文档类型"
                    >
                        {getFieldDecorator('docsType', {
                            rules: [
                                { required: true, message: '请输入文档类型' },
                                {
                                    max: 50,
                                    message: '文档类型不能多于 50 字'
                                }],
                        })(
                            <Input
                                placeholder="文档类型"
                            />
                        )}
                    </FormItem>
                    {/* <FormItem
                        style={{ textAlign: 'right' }}
                    >
                        <Button onClick={()=> this.handleAddName('docsType')}>
                            + 文档类型
                        </Button>
                    </FormItem> */}
                    <FormItem
                        {...formItemLayout}
                        label="文档简介"
                    >
                        {getFieldDecorator('docsIntro', {
                            rules: [
                                {
                                    required: true, message: '请输入文档简介'
                                },
                                {
                                    max: 200,
                                    message: '文档简介不能多于 200 字'
                                }
                            ],
                        })(
                            <TextArea
                                placeholder="文档简介"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="日期"
                    >
                        {getFieldDecorator('createInstance', {
                            initialValue: moment(new Date()).format('YYYY-MM-DD HH:mm:SS'),
                            rules: [{ required: true, message: '请输入日期' }],
                        })(
                            <Input
                                disabled
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传附件"
                    >
                        {getFieldDecorator('upload', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [{ required: true, message: '请上传附件' }],
                        })(
                            <Upload
                                name="logo"
                                action={`${httpServer}/api/upload`}
                                style={{ float: 'left' }}
                                withCredentials={true}
                                onChange={this.handleUploadChange}
                            >
                                <Button>
                                    <Icon type="upload" /> 上传附件 😊
                                </Button>
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('docsLink')(
                            <Input
                                type='hidden'
                            />
                        )}
                    </FormItem>

                    <FormItem
                        {...buttonItemLayout}
                    >
                        <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
                            提交
                        </Button>
                        <Button onClick={this.handleCancel}>
                            取消
                        </Button>
                    </FormItem>
                </Form>
                {this.modalCreator()}
            </div>
        );
    }

}

export default withRouter(Form.create()(UploadDocs));