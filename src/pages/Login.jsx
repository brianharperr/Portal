// import { Form, Input, Button, Checkbox, Typography, Layout, Divider, Avatar, Descriptions, Image, List, Alert } from "antd";
// const { Title, Paragraph } = Typography;
// import { LockOutlined, MailOutlined } from '@ant-design/icons';
// import { useSelector } from "react-redux";
// import ReCAPTCHA from "react-google-recaptcha";
// import { getPortal } from "../redux/features/portal.slice";
// import { useRef, useState } from "react";
// import { axiosWithSimpleCredentials } from "../configs/axios";
// import { Link } from "react-router-dom";
// export default function Login()
// {
//     const [form] = Form.useForm();
//     const portal = useSelector(getPortal);
//     const [loading, setIsLoading] = useState(false);
//     const [failedAttempts, setFailedAttempts] = useState(0);
//     const needReCaptcha =  failedAttempts > 2;
//     const recaptchaRef = useRef(null);
//     const [response, setResponse] = useState(false);

    // function handleLogin(value)
    // {
    //     setIsLoading(true);
    //     if(needReCaptcha){
    //         var token = recaptchaRef.current.getValue();
    //         if(token){
    //             axiosWithoutCredentials.get('/auth/verify-captcha?token=' + token)
    //             .then(res => {
    //                 console.log(res)
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //             })
    //         }
    //         recaptchaRef.current.reset();
    //     }else{
    //         var payload = {
    //             PortalID: portal.ID,
    //             Email: value.email,
    //             Password: value.password,
    //             RememberMe: value.remember
    //         }
    //         axiosWithSimpleCredentials.post('/auth/portallogin', payload)
    //         .then(res => {
    //             if(!payload.RememberMe){
    //                 sessionStorage.setItem('p_access_token', res.data.access_token);
    //                 sessionStorage.setItem('p_refresh_token', res.data.refresh_token);
    //                 sessionStorage.setItem('p_logged_in', res.data.logged_in);
    //             }else{
    //                 sessionStorage.clear();
    //             }
    //             window.location.href = "/"
    //         })
    //         .catch(err => {
    //             if(err.response.data.code === "NO_USER_FOUND" || err.response.data.code === "PASS_COMPARE_FAILED" || err.response.data.code === "INV_LOGIN"){
    //                 setResponse({
    //                   display: true,
    //                   type: 'error',
    //                   message: 'Email or password is invalid.'
    //                 })
    //               }else{
    //                 setResponse({
    //                   display: true,
    //                   type: 'error',
    //                   message: 'Internal Server Error. Please try again later.'
    //                 })
    //             }
    //             setFailedAttempts(failedAttempts + 1);
    //             throw err;
    //         })
    //         .finally(() => setIsLoading(false));
    //     }
    // }

//     return (
//         <div className="w-full h-screen bg-gray-100">
//             <div className="mx-auto max-w-[400px] pt-48">
//                 <div className="p-6 shadow-lg bg-white rounded-xl border">
//                     <div className="!w-full mx-auto">
//                     <List itemLayout="horizontal">
//                         <List.Item>
//                             <List.Item.Meta
//                             avatar={<Avatar style={{ background: '#eee'}} size={54} src={portal?.LogoSource}/>}
//                             title={<Title className="!mb-0" level={3}>Log In</Title>}
//                             description={portal?.Name}
//                             />
//                         </List.Item>
//                     </List>
//                     </div>
//                     <Form
//                     hideRequiredMark
//                     name="normal_login"
//                     className=""
//                     layout="vertical"
//                     initialValues={{
//                         remember: true,
//                     }}
//                     onFinish={handleLogin}
//                     >
//                     {response.display && <Alert message={response.message} type={response.type} showIcon className='!mb-2' />}
//                     <Form.Item
//                         style={{ marginBottom: '12px' }}
//                         name="email"
//                         label="Email"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Please enter your email',
//                             },
//                             {
//                                 required: true,
//                                 type: "email",
//                                 message: "Not a valid email.",
//                             },
//                         ]}
//                     >
//                         <Input placeholder="Email" />
//                     </Form.Item>
//                     <Form.Item
//                         style={{ marginBottom: '6px' }}
//                         name="password"
//                         label="Password"
//                         rules={[
//                         {
//                             required: true,
//                             message: 'Please enter your password',
//                         },
//                         ]}
//                     >
//                         <Input
//                         type="password"
//                         placeholder="Password"
//                         />
//                     </Form.Item>
//                     <Form.Item style={{ marginBottom: '12px' }}>
//                         <Form.Item name="remember" valuePropName="checked" noStyle>
//                         <Checkbox>Remember me</Checkbox>
//                         </Form.Item>

//                         <Link to="/forgot" className="login-form-forgot float-right">
//                         Forgot password
//                         </Link>
//                     </Form.Item>
//                     {needReCaptcha ?
//                     <Form.Item>
//                     <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}/>
//                     </Form.Item>
//                     :
//                     null}
//                     <Form.Item style={{ marginBottom: '8px' }}>
//                         <Button loading={loading} htmlType="submit" className="login-form-button">
//                         Log in
//                         </Button>
//                     </Form.Item>
//                     </Form>
//                 </div>
//                 <div className="w-full text-center mt-2">
//                     <Paragraph className="text-xs">Copyright © FamilyLynk</Paragraph>
//                 </div>
//             </div>
//         </div>
//     )
// }

import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { useSelector } from 'react-redux';
import { getPortal } from '../redux/features/portal.slice';
import FamilyLynk from '../assets/svg/Logo';
import { axiosWithSimpleCredentials } from '../configs/axios';

function ColorSchemeToggle(props) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="neutral" disabled />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      aria-label="toggle light/dark mode"
      {...other}
      onClick={(event) => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
        onClick?.(event);
      }}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function Login() {

  const portal = useSelector(getPortal);
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [persistLogin, setPersistLogin] = React.useState(false);

  function handleLogin()
  {
        if(portal){
          setLoading(true);
          var payload = {
              PortalID: portal.ID,
              Email: email,
              Password: password,
              RememberMe: persistLogin
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
              throw err;
          })
          .finally(() => setLoading(false));
        }
  }

  return (
    <CssVarsProvider defaultMode="light" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
            '--Cover-width': '50vw', // must be `vw` only
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width:
              'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
            maxWidth: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: 'flex',
              alignItems: 'left',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => window.location.href = "https://familylynk.com"} variant="soft" color="primary" size="sm">
                <FamilyLynk/>
              </IconButton>
              <Typography level="title-lg">{portal?.Name}</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack gap={4}>
              <Stack gap={1}>
                <Typography component="h1" level="h3">
                  Log in
                </Typography>
                {/* <Typography level="body-sm">
                  New to company?{' '}
                  <Link href="#replace-with-a-link" level="title-sm">
                    Sign up!
                  </Link>
                </Typography> */}
              </Stack>
            </Stack>
            <Stack gap={4}>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleLogin()
                }}
              >
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input 
                  type="email" 
                  name="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      maxLength: 128
                    },
                  }}
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input 
                  type="password" 
                  name="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  slotProps={{
                    input: {
                      maxLength: 128
                    },
                  }}
                  />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox size="sm" label="Remember me" name="persistent" onChange={e => setPersistLogin(e.target.checked)} />
                    <Link level="title-sm" href="#replace-with-a-link">
                      Forgot your password?
                    </Link>
                  </Box>
                  <Button loading={loading} type="submit" fullWidth>
                    Log in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © FamilyLynk {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}