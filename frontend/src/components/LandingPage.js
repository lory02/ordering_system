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
      isWrong: false
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const {history} = this.props
      if (!err) {
        axios.post('/login',values)
        .then(res=>{
          if (res.data.code === 1) {
            history.push(`/restaurant/${res.data.userId}/homepage`)
          } else {
            this.setState(() => {
              return {isWrong: true};
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
        <p style={{visibility: this.state.isWrong ? 'visible': 'hidden'}}> * 您输入的帐号或密码有误</p>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入您的用户名!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住我</Checkbox>)}
          <Button type="primary" htmlType="submit" className="login-form-button">
            登 录
          </Button>
          <Link to="/register">立即注册!</Link>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm