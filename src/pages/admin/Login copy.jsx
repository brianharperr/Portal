import { Layout, Form, Typography, Input, Button, Tooltip, Checkbox } from 'antd'
const { Footer, Content, Header } = Layout;
import { useState } from 'react';
import Logo from '../assets/logo.png';
import { axiosWithSimpleCredentials } from '../../configs/axios';
const { Title } = Typography;
export default function Login()
{
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberme: ""
    })

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
              sessionStorage.setItem('access_token', res.data.access_token);
              sessionStorage.setItem('refresh_token', res.data.refresh_token);
              sessionStorage.setItem('logged_in', res.data.logged_in);
              window.location.href = "/";
              localStorage.setItem('name', res.data.name);
          })
          .catch((err) => {
              if(err.response.data.code === "NO_USER_FOUND" || err.response.data.code === "PASS_COMPARE_FAILED" || err.response.data.code === "INV_LOGIN"){
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
        <>
        <div className='justify-center pt-4 w-full flex'>
            <a href="/"><img src={Logo} alt=""/></a>
        </div>
        <Form layout='vertical' className='max-w-[400px] mx-auto pt-12'>    
            <Title level={4} className='!mb-2 !mt-4'>Log In</Title>
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
            <Tooltip placement='top' title="Stay logged in on this browser.">
            <Checkbox checked={form.rememberme} onChange={e => setForm({...form, rememberme: e.target.checked})}>Remember me</Checkbox>
            </Tooltip>
            <Button type='link' className='float-right !p-0' onClick={() => nav('forgot')}>Forgot password?</Button>
            </Form.Item>
            <Form.Item className=''>      
            <Button loading={isLoading} onClick={handleLogin}>{isLoading ? 'Authorizing...' : 'Log In'}</Button>
            <span className='ml-2'>Or <Button className='p-0' type='link' onClick={() => nav('register')}>register now!</Button></span>
            </Form.Item>
        </Form>
        </>
    )
}