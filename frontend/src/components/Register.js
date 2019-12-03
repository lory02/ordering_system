import React from 'react';
import axios from '../api'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import '../scss/login.scss'
import {
  Link
} from 'react-router-dom'

class NormalLoginForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isWrong: false,
      msg:''
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      const {history} = this.props
      if (!err) {
        axios.post('/register',values)
        .then(res=>{
          if (res.data.code === 1) {
            history.push('/login')
          } else {
            this.setState(() => {
              return {isWrong: true, msg: res.data.msg};
            });
          }
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='LoginWrapper'>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <h2>餐厅管理系统</h2> 
        <p style={{visibility: this.state.isWrong ? 'visible': 'hidden'}}> * {this.state.msg}</p>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入您的用户名!' }],
          })(
            <Input
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入您的餐厅名!' }],
          })(
            <Input
              type="title"
              placeholder="餐厅名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入您的邮箱!' }],
          })(
            <Input
              type="email"
              placeholder="邮箱"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }],
          })(
            <Input
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            注册
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm