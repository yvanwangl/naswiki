import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import LoginStore from '../LoginStore';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Icon, Input, Button, Modal } from 'antd';
const FormItem = Form.Item;
import './index.css';

export interface LoginProps {
    login: LoginStore;
}

export interface LoginState {
    openDialog: boolean;
}

@inject('login')
@observer
class Registor extends React.Component<LoginProps & FormComponentProps & RouteComponentProps<any>, LoginState> {

    constructor(props: LoginProps & FormComponentProps & RouteComponentProps<any>) {
        super(props);
        this.state = {
            openDialog: false
        };
    }

    handleSubmit = (e: any) => {
        let { form, login: { doLogin }, history } = this.props;
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                values.type = 'signup';
                doLogin(values).then(() => {
                    Modal.success({
                        title: '注册成功',
                        content: '恭喜你，注册成功，请前往登录 😊'
                    });
                    history.push('/login');
                });
            }
        });
    }

    checkConfirmPassword = (rule: any, value: string, callback: Function) => {
        const { form } = this.props;
        const password = form.getFieldValue('password');
        if (value !== password) {
            return callback('确认密码与密码不一致');
        }
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='Login-container'>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码'
                                },
                                {
                                    min: 6,
                                    message: '密码不能少于 6 位'
                                },
                                {
                                    max: 10,
                                    message: '密码不能多于 10 位'
                                }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('confirmpassword', {
                            rules: [
                                {
                                    required: true,
                                    message: '请重新输入密码'
                                },
                                {
                                    validator: this.checkConfirmPassword
                                }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="确认密码"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <a href="/login" className='LinkButton'> 登录 </a>
                        <Button type="primary" htmlType="submit" className="Login-form-button">
                            注册
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }

}

export default withRouter(Form.create()(Registor));