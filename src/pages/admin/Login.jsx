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
import { getPortal } from '../../redux/features/portal.slice';
import FamilyLynk from '../../assets/svg/Logo';
import { axiosWithSimpleCredentials } from '../../configs/axios';
import { Alert } from '@mui/joy';

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
  const [loginRes, setLoginRes] = React.useState(null);

  function handleLogin()
  {
    setLoading(true);

    var payload = {
      Email: email,
      Password: password,
      PersistLogin: persistLogin
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
            setLoginRes(err.response.data)
        })
        .finally(() => setLoading(false))
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
                  {loginRes?.code === "INV_LOGIN" && <Alert color='danger'>Invalid username or password.</Alert>}
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