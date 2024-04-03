import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Logo from '../../assets/logo.png';
import { Modal, Button, Form, Input, Radio, Typography, Checkbox, Tooltip, Alert, message  } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosWithSimpleCredentials } from '../../configs/axios';
const { Title } = Typography;
export default function FogotPasswordModal({ visible, close, nav, verify }) {

    const [messageApi, contextHolder] = message.useMessage()
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
  });

  function handleForogt()
  {
    setIsLoading(true);
    axiosWithSimpleCredentials.get('/email/reset-password?emailaddr=' + form.email)
    .then(res => {
        messageApi.open({ type: 'success', content: 'Check email to reset password.'})
    })
    .catch(err => {
        if(err.response.data.code === "UNKNOWN_USER"){
            messageApi.open({ type: 'error', content: 'Email not associated to an account.'})
        }
    }).finally(() => {
        setIsLoading(false)
    })
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
      <Title level={4} className='!mb-4 !mt-4'>Forgot Password</Title>
      {verify && <Alert message="Email verified" type="success" showIcon className='!mb-2' />}
      <label>Email</label>
      <Form.Item
        name="email"
        className='!mb-4'
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
      <Form.Item className='!mb-0'>      
        <Button loading={isLoading} onClick={handleForogt}>{isLoading ? 'Sending email...' : 'Reset Password'}</Button>

      </Form.Item>
      <div>      
        Back to<Button type='link' className="!p-0 !pl-1" onClick={() => nav("login")}>Log In.</Button>
      </div>
      </Form>

    </Modal>
  );
}