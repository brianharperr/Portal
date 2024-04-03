import React, { useState } from 'react';
import Logo from '../../assets/logo.png';
import { Modal, Button, Form, Input, Radio, Typography, Checkbox, Tooltip, Alert  } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosWithSimpleCredentials, axiosWithoutCredentials } from '../../configs/axios';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;
export default function LoginModal({ visible, close, nav, verify }) {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberme: ""
  });

  const [response, setResponse] = useState({
    display: false,
    type: null,
    message: null
  });

  function handleLogin()
  {
    setIsLoading(true);

    var payload = {
      Email: form.email,
      Password: form.password,
      PersistLogin: form.rememberme
    }
    axiosWithSimpleCredentials.post('/auth/login', payload)
        .then((res) => {
            sessionStorage.setItem('first_time', res.data.first_time);
            sessionStorage.setItem('access_token', res.data.access_token);
            sessionStorage.setItem('refresh_token', res.data.refresh_token);
            sessionStorage.setItem('logged_in', res.data.logged_in);
            localStorage.setItem('name', res.data.name);
            window.location.href = "/";
        })
        .catch((err) => {
            if(err.response?.data?.code === "NO_USER_FOUND" || err.response?.data?.code === "PASS_COMPARE_FAILED" || err.response?.data?.code === "INV_LOGIN"){
              setResponse({
                display: true,
                type: 'error',
                message: 'Email or password is invalid.'
              })
            }else{
              setResponse({
                display: true,
                type: 'error',
                message: 'Internal Server Error. Please try again later.'
              })
            }
        })
        .finally(() => setIsLoading(false))
  }

  return (
    <Modal
    open={visible}
    onCancel={close}
    footer={null}
    >
      <Form layout='vertical' onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleLogin()
        }
      }}>    
      <img src={Logo} alt=""/>
      
      <Title level={4} className='!mb-2 !mt-4'>Log In</Title>
      {verify && <Alert message="Please verify your email before logging in." type="success" showIcon className='!mb-2 '/>}
      {response.display && <Alert message={response.message} type={response.type} showIcon className='!mb-2' />}
      <label>Email</label>
      <Form.Item
        name="email"
        className='!mb-2'
        rules={[
          {
            type: 'email',
            message: 'Invalid email address',
          },
          {
            required: true,
            message: 'Missing email address',
          },
        ]}
      >
        <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      </Form.Item>
      <label>Password</label>
      <Form.Item
        name="password"
        prefix={<LockOutlined className="site-form-item-icon" />}
        rules={[
          {
            required: true,
            message: 'Missing password!',
          },
        ]}
        className='!mb-2'
      >
        <Input.Password value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
      </Form.Item>
      <Form.Item className='!mb-2'>
      <Tooltip placement='top' trigger={'hover'} title="Stay logged in on this browser.">
      <Checkbox checked={form.rememberme} onChange={e => setForm({...form, rememberme: e.target.checked})}>Remember me</Checkbox>
      </Tooltip>
        <Button type='link' className='float-right !p-0' onClick={() => nav('forgot')}>Forgot password?</Button>
      </Form.Item>
      <Form.Item className=''>      
        <Button loading={isLoading} onClick={handleLogin}>{isLoading ? 'Authorizing...' : 'Log In'}</Button>
        <span className='ml-2'>Or <Button className='p-0' type='link' onClick={() => nav('register')}>register now!</Button></span>
      </Form.Item>

      </Form>

    </Modal>
  );
}