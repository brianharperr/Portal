import { Form, Input, Button, Checkbox, Typography, Layout, Divider, Avatar, Descriptions, Image, List, Alert } from "antd";
const { Title, Paragraph } = Typography;
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { getPortal } from "../redux/features/portal.slice";
import { useRef, useState } from "react";
import { axiosWithSimpleCredentials } from "../configs/axios";
import { Link } from "react-router-dom";
export default function Login()
{
    const [form] = Form.useForm();
    const portal = useSelector(getPortal);
    const [loading, setIsLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const needReCaptcha =  failedAttempts > 2;
    const recaptchaRef = useRef(null);
    const [response, setResponse] = useState(false);

    function handleLogin(value)
    {
        setIsLoading(true);
        if(needReCaptcha){
            var token = recaptchaRef.current.getValue();
            if(token){
                axiosWithoutCredentials.get('/auth/verify-captcha?token=' + token)
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
            }
            recaptchaRef.current.reset();
        }else{
            var payload = {
                PortalID: portal.ID,
                Email: value.email,
                Password: value.password,
                RememberMe: value.remember
            }
            axiosWithSimpleCredentials.post('/auth/portallogin', payload)
            .then(res => {
                if(!payload.RememberMe){
                    sessionStorage.setItem('p_access_token', res.data.access_token);
                    sessionStorage.setItem('p_refresh_token', res.data.refresh_token);
                    sessionStorage.setItem('p_logged_in', res.data.logged_in);
                }else{
                    sessionStorage.clear();
                }
                window.location.href = "/"
            })
            .catch(err => {
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
                setFailedAttempts(failedAttempts + 1);
                throw err;
            })
            .finally(() => setIsLoading(false));
        }
    }

    return (
        <div className="w-full h-screen bg-gray-100">
            <div className="mx-auto max-w-[480px] pt-48">
                <div className="p-6 shadow-lg bg-white rounded-xl border">
                    <div className="!w-full mx-auto">
                    <List itemLayout="horizontal">
                        <List.Item>
                            <List.Item.Meta
                            avatar={<Avatar style={{ background: '#eee'}} size={54} src={portal?.LogoSource}/>}
                            title={<Title className="!mb-0" level={3}>Log In</Title>}
                            description={portal?.Name}
                            />
                        </List.Item>
                    </List>
                    </div>
                    <Form
                    hideRequiredMark
                    name="normal_login"
                    className=""
                    layout="vertical"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={handleLogin}
                    >
                    {response.display && <Alert message={response.message} type={response.type} showIcon className='!mb-2' />}
                    <Form.Item
                        style={{ marginBottom: '12px' }}
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your email',
                            },
                            {
                                required: true,
                                type: "email",
                                message: "Not a valid email.",
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: '6px' }}
                        name="password"
                        label="Password"
                        rules={[
                        {
                            required: true,
                            message: 'Please enter your password',
                        },
                        ]}
                    >
                        <Input
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '12px' }}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Link to="/forgot" className="login-form-forgot float-right">
                        Forgot password
                        </Link>
                    </Form.Item>
                    {needReCaptcha ?
                    <Form.Item>
                    <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}/>
                    </Form.Item>
                    :
                    null}
                    <Form.Item style={{ marginBottom: '8px' }}>
                        <Button loading={loading} htmlType="submit" className="login-form-button">
                        Log in
                        </Button>
                    </Form.Item>
                    </Form>
                </div>
                <div className="w-full text-center mt-2">
                    <Paragraph>Copyright © FamilyLynk</Paragraph>
                </div>
            </div>
        </div>
    )
}