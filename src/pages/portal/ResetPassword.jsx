import { Form, Input, Button, Checkbox, Typography, Layout, Divider, Avatar, Descriptions, Image, List, Alert, Spin, Result, Progress } from "antd";
const { Title, Paragraph } = Typography;
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { getPortal } from "../../redux/features/portal.slice";
import { useEffect, useRef, useState } from "react";
import { axiosWithoutCredentials, axiosWithSimpleCredentials } from "../../configs/axios";
import { Link, useNavigate } from "react-router-dom";
export default function ResetPassword()
{
    const queryParams = new URLSearchParams(window.location.search);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const portal = useSelector(getPortal);
    const [canSubmit, setCanSubmit] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        value: 0,
        color: 'red',
        extra: 'Passwords must be at least 8 characters, including a capital letter and number'
    });
    const [password2Error, setPassword2Error] = useState();

    const [loading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(false);
    const [validLink, setValidLink] = useState(null);
    const navigate = useNavigate();

    function handleReset()
    {
        setIsLoading(true);
        var payload = {
            token: queryParams.get('token'),
            password: confirmPassword
        }
        axiosWithSimpleCredentials.post('/auth/portal/reset', payload)
        .then(res => {
            setResponse({
                display: true,
                type: 'success',
                message: 'Password successfully reset.'
              })
        })
        .catch(err => {
            setResponse({
                display: true,
                type: 'error',
                message: 'Internal Server Error.'
              })
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        //verify link
        var payload = {
          Token: queryParams.get('token')
        }

        axiosWithoutCredentials.post('/auth/resetpage', payload)
        .then(res => {
          setValidLink(true);
        })
        .catch(err => {
          setValidLink(false);
        })

    }, [])

    useEffect(() => {
        let strength = {value: 0, color: 'red', extra: 'Passwords must be at least 8 characters, including capital letters and numbers'};

        if(newPassword.length > 0){
            strength = { value: 25, color: 'red', extra: 'Strength: Weak'}
        }

        if (/\d/.test(newPassword) && /[A-Z]/.test(newPassword)) {

            if (newPassword.length >= 8) {
                strength = { value: 50, color: 'gold', extra: 'Strength: Good'}
            }

            if (newPassword.length > 10) {
                strength = { value: 75, color: 'green', extra: 'Strength: Great'}
            }

            if (newPassword.length > 12) {
                strength = { value: 100, color: 'blue', extra: 'Strength: Secure'}
            }

        }

        setPasswordStrength(strength)
    }, [newPassword])

    useEffect(() => {
            if(confirmPassword.length > 0 && newPassword !== confirmPassword){
                setPassword2Error('Passwords do not match')
            }else{
                setPassword2Error(null);
            }
            setCanSubmit(newPassword === confirmPassword && passwordStrength.value >= 50);
    }, [newPassword, confirmPassword])
    return (
        <>
        {validLink !== null ?
            <>
            {validLink ? 
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
                        {response.display && <Alert type={response.type}  message={response.message} />}
                        <Form
                        hideRequiredMark
                        name="normal_login"
                        className=""
                        layout="vertical"
                        initialValues={{
                            remember: true,
                        }}
                        >
                        {response.type === 'success' ?
                        <Result
                            status="success"
                            title="Successfully changed password!"
                            extra={[
                            <Button type="primary" key="console" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            ]}
                        />
                        :
                        <>
                        <Form.Item 
                            hasFeedback
                            validateStatus={passwordStrength.value < 50 && newPassword.length > 0 ? 'error': null}
                            className="!mb-2"
                            name="new_password"
                            label="New password"
                            extra={passwordStrength.extra}
                        >
                            <Input type="password" onChange={e => setNewPassword(e.target.value)} value={newPassword}/>
                            <Progress className="!mt-0" percent={passwordStrength.value} strokeColor={passwordStrength.color} showInfo={false}/>
                        </Form.Item>
                        <Form.Item
                            style={{ marginBottom: '12px' }}
                            name="confirm_password"
                            label="Confirm password"
                            validateStatus={password2Error && 'error'}
                            hasFeedback
                            help={password2Error}
                        >
                            <Input type="password" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}/>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '8px' }}>
                            <Button onClick={handleReset} disabled={!canSubmit} loading={loading} htmlType="submit" className="login-form-button">
                            Reset Password
                            </Button>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '12px' }}>
                            <Link to="/login" className="login-form-forgot float-right">
                            Login
                            </Link>
                        </Form.Item>
                        </>
                        }
                        
                        </Form>
                    </div>
                    <div className="w-full text-center mt-2">
                        <Paragraph>Copyright © FamilyLynk</Paragraph>
                    </div>
                </div>
            </div>
            :
            <Result
                status="error"
                title="Link invalid."
                subTitle="Your link has expired or is invalid."
                extra={[
                <Button type="primary" key="console" onClick={() => navigate('/forgot')}>
                    Try Again
                </Button>,
                <Button key="buy" onClick={() => navigate('/')}>Home</Button>,
                ]}
            />
            }
            </>
        :
        <Spin/>
        }
        </>
    )
}