import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Logo from '../../assets/logo.png';
import { Modal, Button, Form, Input, Radio, Typography, Checkbox, Tooltip, notification, message  } from 'antd';
import { axiosWithoutCredentials } from '../../configs/axios';
const { Title } = Typography;
export default function RegisterModal({ visible, close, nav, verify }) {

  const [messageApi, contextHolder] = message.useMessage()
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password2: "",
    agreetoterms: false,
    notifications: false
  });

  function handleRegister()
  {
    setIsLoading(true);

    var payload = {
      Email: form.email,
      FirstName: form.firstname,
      LastName: form.lastname,
      Password: form.password,
      ReceiveOffers: form.notifications
    }
    axiosWithoutCredentials.post('/auth/register', payload)
    .then(res => {
      messageApi.open({ type: 'success', content: 'Verification Email sent.'});
      nav("login");
      verify();
    })
    .catch((err) => {
      if(err.response.data.code === "EMAIL_EXISTS"){
        messageApi.open({ type: 'error', content: 'Account already exists with that email.'})
      }else if(err.response.data.code === "NODEMAILER_ERR"){
        messageApi.open({ type: 'error', content: 'Verification email could not be sent. Please try again later.'})
      }
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <Modal
    open={visible}
    onCancel={close}
    footer={null}
    >
      {contextHolder}
      <Form layout='vertical'>    

      <img src={Logo} alt=""/>
      <Title level={4} className='!mb-8 !mt-4'>Register</Title>
      <label>Full Name<span className='text-red-500'>*</span></label>
      <Form.Item
      className='!mb-2'
    >
      <Form.Item
        name="First Name"
        className='!mb-0'
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50% - 8px)',
        }}
      >
        <Input value={form.firstname} onChange={e => setForm({...form, firstname: e.target.value})} placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="Last Name"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50% - 8px)',
          margin: '0 8px',
        }}
      >
        <Input value={form.lastname} onChange={e => setForm({...form, lastname: e.target.value})} placeholder="Last Name" />
      </Form.Item>
    </Form.Item>
      <label>Email<span className='text-red-500'>*</span></label>
      <Form.Item
        name="email"
        className='!mb-2'
        hasFeedback
        rules={[
          {
            type: 'email',
            message: 'Invalid email address',
          },
          {
            required: true,
            message: 'Missing email address',
          }
        ]}
      >
        <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      </Form.Item>
      <label>Password<span className='text-red-500'>*</span></label>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Missing password!',
          },
          {
            validator: (rule, value, callback) => {
              if (value && value && value.length < 8) {
                return Promise.reject(new Error('8 characters minimum.'));
              }
              return Promise.resolve();
            }
          },
          {
            validator: (rule, value, callback) => {
              if (value && value === value.toLowerCase()) {
                return Promise.reject(new Error('Requires at least one capital letter.'));
              }
              return Promise.resolve();
            }
          },
          {
            validator: (rule, value, callback) => {
              if (value && !(/[0-9]/.test(value))) {
                return Promise.reject(new Error('Requires at least one number.'));
              }
              return Promise.resolve();
            }
          }
        ]}
        hasFeedback
        className='!mb-2'
      >
        <Input.Password value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
      </Form.Item>
      <label>Confirm Password<span className='text-red-500'>*</span></label>
      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        className='!mb-2'
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || form.password === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Checkbox checked={form.agreetoterms} onChange={e => setForm({...form, agreetoterms: e.target.checked})}>I have read and understood the <Button className='!p-0 !h-0' type='link' href="">Terms of Service</Button> & <Button className='!p-0 !h-0' type='link' href="">Privacy Policy</Button>.<span className='text-red-500'>*</span></Checkbox>
      <Checkbox checked={form.notifications} onChange={e => setForm({...form, notifications: e.target.checked})}>I want to receive updates and offers from FamilyLynk.</Checkbox>
      <div className='mt-4'>      
        <Button loading={isLoading} onClick={handleRegister}>{isLoading ? 'Creating your account...' : 'Register'}</Button>
      </div>
      <div className='mt-4'>      
        Already have an account?<Button type='link' className="!p-0 !pl-1" onClick={() => nav("login")}>Log In.</Button>
      </div>
      </Form>

    </Modal>
  );
}