import { useEffect, useState } from "react";
import { axiosWithoutCredentials } from "../../configs/axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, Result, Layout, Typography, Spin  } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
const { Footer, Content, Header } = Layout;
const { Title } = Typography;
import ValidationService from "../../services/Validation";

export default function PasswordReset()
{
    const [queryParameters] = useSearchParams();
    const token = queryParameters.get('token');
    const navigate = useNavigate();
    const [validLink, setValidLink] = useState();
    const [isValidating, setIsValidating] = useState(true);
    const [response, setResponse] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [submittable, setSubmittable] = useState(false);

    const [form] = Form.useForm();
    const password = Form.useWatch('password', form);
    const confirm = Form.useWatch('confirm', form);

    function handlePasswordReset()
    {
        
        setIsLoading(true);
        var payload = {
            Password: password,
            Token: token
        }

        axiosWithoutCredentials.post('/auth/reset', payload)
        .then((res) => {
            setResponse('success')
        })
        .catch((err) => {
            setResponse('error')
        })
        .finally(() => setIsLoading(false))
    }

    function render()
    {
        if(isValidating){
            return (
                <div className="flex w-full">
                <LoadingOutlined className="mx-auto" style={{ fontSize: 48 }} spin />
                </div>
            )
        }else{
            if(validLink){
                if(response === undefined){
                    return (
                    <div className="container max-w-[600px] mx-auto mt-20">
                    <Form layout="vertical" form={form} name="validateOnly" autoComplete="off" className="mt-12">
                    <Title level={4}>Reset Password</Title>
                    <Form.Item
            name="password"
            label="Password"
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
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
            {
                required: true,
                message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
                },
            }),
            ]}
        >
            <Input.Password visibilityToggle={false} />
        </Form.Item>

                        <Form.Item>
                            <Button disabled={!submittable} loading={isLoading} onClick={handlePasswordReset}>{isLoading ? 'Resetting password...' : 'Reset password'}</Button>
                            <Button type="link" onClick={() => navigate('/login')}>Back to Login</Button>
                        </Form.Item>
                    </Form>
                    </div>
                    )
                }else{
                    if(response === 'success'){
                        return (
                            <Result
                                status="success"
                                title="Successfully Changed Password!"
                                subTitle="You can now login."
                                extra={[
                                <Button onClick={() => navigate('/login')} key="console">
                                    Login
                                </Button>,
                                ]}
                            />
                        )
                    }else if(response === 'error'){
                        return (
                        <Result
                            status="error"
                            title="Internal Server Error."
                            subTitle="Please try again later."
                            className="mt-12"
                            extra={[
                                <Button onClick={() => navigate('/login')} key="console">
                                    Login
                                </Button>,
                            ]}
                        />
                        )
                    }
                }
            }else{
                return (
                    <Result
                    status="error"
                    title="Link has expired or does not exist."
                    className="mt-12"
                    />
                )
            }
        }
    }
    useEffect(() => {

        axiosWithoutCredentials.get('/auth/reset-password?token=' + token)
        .then(res => {
            setValidLink(true);
        })
        .finally(() => setIsValidating(false))

    }, [token])

    useEffect(() => {
        if(ValidationService.password(password) && confirm && password === confirm){
            setSubmittable(true);
        }else{
            setSubmittable(false);
        }
    }, [password, confirm]);

    return(
        <>
        <Layout className="h-screen">
            <Header className="!bg-[#f5f5f5]">
                    <a href="/"><img className="mt-4 mx-auto" src="https://familylynk.s3.us-east-2.amazonaws.com/meta/logo_150x58.svg" alt="FamilyLynk"/></a>
            </Header>
            <Content>
            {render()}
            </Content>
            <Footer
            style={{
                textAlign: 'center',
            }}
            >
            FamilyLynk ©2023
            </Footer>
        </Layout>
        </>
    )
}