import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Form, Icon, Input, notification} from 'antd';

import {ACCESS_TOKEN} from '../../../constants/index';
import './Login.css';
import {login} from '../../../utility/APIUtilities';
import Message from "../../../common/Message";

const FormItem = Form.Item;

export default class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm);

        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>

                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin}/>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((exception, values) => {
            if (!exception) {
                const loginRequest = Object.assign({}, values);

                login(loginRequest)
                    .then(response => {
                        localStorage.setItem(ACCESS_TOKEN, response.accessToken);

                        this.props.onLogin();
                    }).catch(error => {
                    if (error.status === 401) {
                        notification.error({
                            message: 'Training Partner',
                            description: Message.ERROR_LOGIN_CREDENTIALS
                        });
                    } else {
                        notification.error({
                            message: 'Training Partner',
                            description: error.message || Message.ERROR_UNDEFINED
                        });
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: Message.errorInput('username')}],
                    })(
                        <Input
                            prefix={<Icon type="user"/>}
                            size="large"
                            name="username"
                            placeholder="Username"
                            autoComplete="username"
                        />
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: Message.errorInput('password')}],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            size="large"
                            name="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                        />
                    )}
                </FormItem>

                <FormItem>
                    <Button type="primary"
                            htmlType="submit"
                            size="large"
                            className="login-form-button"
                    >
                        Login
                    </Button>
                    Or <Link to="/signup">sign up!</Link>
                </FormItem>
            </Form>
        );
    }
}