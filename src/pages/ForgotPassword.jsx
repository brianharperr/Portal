import { Form, Input, Button, Checkbox, Typography, Layout, Divider, Avatar, Descriptions, Image, List, Alert } from "antd";
const { Title, Paragraph } = Typography;
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { getPortal } from "../redux/features/portal.slice";
import { useEffect, useRef, useState } from "react";
import { axiosWithoutCredentials, axiosWithSimpleCredentials } from "../configs/axios";
import { Link } from "react-router-dom";
export default function ForgotPassword()
{
    const portal = useSelector(getPortal);
    const [loading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(false);

    function handleLogin(value)
    {
        setIsLoading(true);
        var payload = {
            PortalID: portal.ID,
            Email: value.email
        }
        axiosWithoutCredentials.post('/auth/forgot', payload)
        .then(res => {
            setResponse({
                display: true,
                type: 'success',
                message: 'Check your inbox to reset your password.'
              })
        })
        .catch(err => {
            setResponse({
                display: true,
                type: 'error',
                message: 'Email is invalid.'
              })
        })
        .finally(() => {
            setIsLoading(false);
        });
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
                            title={<Title className="!mb-0 !mt-0" level={3}>Reset Password</Title>}
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
                        }
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '8px' }}>
                        <Button loading={loading} htmlType="submit" className="login-form-button">
                        Reset Password
                        </Button>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '12px' }}>
                        <Link to="/login" className="login-form-forgot float-right">
                        Login
                        </Link>
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