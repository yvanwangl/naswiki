import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import LoginStore from '../LoginStore';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;
import './index.css';
const { registor } = require('../../../system.config');

export interface LoginProps {
    login: LoginStore;
}

export interface LoginState {
    openDialog: boolean;
}

@inject('login')
@observer
class Login extends React.Component<LoginProps & FormComponentProps & RouteComponentProps<any>, LoginState> {

    constructor(props: LoginProps & FormComponentProps & RouteComponentProps<any>) {
        super(props);
        this.state = {
            openDialog: false
        };
    }

    handleSubmit = (e: any) => {
        let { form, login: { doLogin }, history, location } = this.props;
        let { from } = location.state || { from: { pathname: '/' } };
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                values.type = 'signin';
                doLogin(values).then(() => history.push(from));
            }
        });
    }

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
                            rules: [{ required: true, message: '请输入密码' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {registor && <a href="/registor" className='LinkButton'> 注册 </a>}
                        <Button type="primary" htmlType="submit" className="Login-form-button">
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }

}

export default withRouter(Form.create()(Login));