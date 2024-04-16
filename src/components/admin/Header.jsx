import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BookRoundedIcon from '@mui/icons-material/BookRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import TeamNav from './Navigation';
import Logo from '../../assets/svg/Logo'
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosWithAdminCredentials } from '../../configs/axios';
import { Link, Tab, TabList, Tabs } from '@mui/joy';
import { useSelector } from 'react-redux';
import { getSelectedPortal } from '../../redux/features/admin.portal.slice';

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <Tooltip title="Change theme" variant="outlined">
      <IconButton
        id="toggle-mode"
        size="sm"
        variant="plain"
        color="neutral"
        sx={{ alignSelf: 'center' }}
        onClick={() => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
        }}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default function Header({ portalView }) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPortal = useSelector(getSelectedPortal);
  const urlPath = location.pathname.slice(location.pathname.lastIndexOf("/")+1 , location.pathname.length);

  function logout(){

    axiosWithAdminCredentials('/auth/logout')
    .catch(err => {
        console.log(err);
    })
    .finally(res => {
        sessionStorage.clear('access_token');
        sessionStorage.clear('refresh_token');
        sessionStorage.clear('logged_in');
        localStorage.clear('name');
        window.location.href = "/";
    })
  }

  return (
    <Box
    sx={{
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',

    }}
    >
          <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'space-between',
        marginBottom: 2,
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        <IconButton
          size="md"
          variant="outlined"
          color="neutral"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            borderRadius: '50%',
          }}
          href="/"
          onClick={() => navigate("/")}
        >
          <Logo/>
        </IconButton>
        {portalView ? 
        <Stack flex flexDirection='row' sx={{gap: 1, marginLeft: 1}}>
        <Typography level="body-sm">/</Typography>
        <Typography level="title-md">{selectedPortal?.Name}</Typography>
        </Stack>
        :
        <>
          <Button
            variant="plain"
            color="neutral"
            aria-pressed={location.pathname === '/'}
            component="a"
            href="/"
            size="sm"
            sx={{ alignSelf: 'center' }}
          >
            Overview
          </Button>
          <Button
            variant="plain"
            color="neutral"
            aria-pressed={location.pathname === '/activity'}
            component="a"
            href="/activity"
            size="sm"
            sx={{ alignSelf: 'center' }}
          >
            Activity
          </Button>
          <Button
            variant="plain"
            color="neutral"
            aria-pressed={location.pathname === '/settings'}
            component="a"
            href="/settings"
            size="sm"
            sx={{ alignSelf: 'center' }}
          >
            Settings
          </Button>
        </>
        }
      </Stack>
      <Box sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <IconButton variant="plain" color="neutral" onClick={() => setOpen(true)}>
          <MenuRoundedIcon />
        </IconButton>
        <Drawer
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalClose />
          <DialogTitle>FamilyLynk</DialogTitle>
          <Box sx={{ px: 1 }}>
            <TeamNav />
          </Box>
        </Drawer>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <ColorSchemeToggle />
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
          >
            <Avatar
              src="https://i.pravatar.cc/40?img=2"
              srcSet="https://i.pravatar.cc/80?img=2"
              sx={{ maxWidth: '32px', maxHeight: '32px' }}
            />
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: '99999',
              p: 1,
              gap: 1,
              '--ListItem-radius': 'var(--joy-radius-sm)',
            }}
          >
            <MenuItem>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  src="https://i.pravatar.cc/40?img=2"
                  srcSet="https://i.pravatar.cc/80?img=2"
                  sx={{ borderRadius: '50%' }}
                />
                <Box sx={{ ml: 1.5 }}>
                  <Typography level="title-sm" textColor="text.primary">
                    Rick Sanchez
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    rick@email.com
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <ListDivider />
            <MenuItem onClick={() => navigate('/settings')}>
              <SettingsRoundedIcon />
              Account Settings
            </MenuItem>
            <MenuItem onClick={() => navigate('/support')}>
              <HelpRoundedIcon />
              Help
            </MenuItem>
            <ListDivider />
            <MenuItem onClick={logout}>
              <LogoutRoundedIcon />
              Log out
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
      
    </Box>
    {portalView &&
        <Tabs value={urlPath} onChange={(e, data) => navigate(`/portal/${selectedPortal?.Subdomain}/${data}`)} size='sm'>
        <TabList disableUnderline>
          <Tab value="settings">Settings</Tab>
          <Tab value="configuration">Configuration</Tab>
          <Tab value="users">Users</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
      </Tabs> 
    }
    </Box>
  );
}