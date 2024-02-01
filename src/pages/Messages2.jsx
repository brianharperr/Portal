import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import { FocusTrap } from '@mui/base/FocusTrap';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';

import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import Mails from '../components/Mails';
import EmailContent from '../components/EmailContent';
import WriteEmail from '../components/WriteEmail';
import HeaderAlt from '../components/HeaderAlt';
import { useSelector } from 'react-redux';
import { getInboxCount } from '../redux/features/message.slice';
import { axiosWithCredentials } from '../configs/axios';

export default function Messages2() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const count = useSelector(getInboxCount);

  function updateSelectedMessage(message){
      var payload = {
        ID: message.ID
    }
    setSelectedMessage(message);
    if(message.Read === 0){
      axiosWithCredentials.put('/message/read', payload);
    }
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation />
        </Layout.SideDrawer>
      )}

      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: '100vh',
            overflow: 'hidden',
          }),
        }}
      >
        <Layout.Header>
          <HeaderAlt />
        </Layout.Header>
        <Layout.SideNav>
          <Navigation />
        </Layout.SideNav>
        <Layout.SidePane>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ alignItems: 'center', gap: 1 }}>
              <Typography level="title-lg" textColor="text.secondary">
                My inbox
              </Typography>
              <Typography level="title-sm" textColor="text.tertiary">
                {count} message{(count > 1 ? 's' : null)}
              </Typography>
            </Box>
            <Button
              size="sm"
              startDecorator={<CreateRoundedIcon />}
              onClick={() => setOpen(true)}
              sx={{ ml: 'auto' }}
            >
              Compose
            </Button>
            <FocusTrap open={open} disableAutoFocus disableEnforceFocus>
              <WriteEmail open={open} onClose={() => setOpen(false)} />
            </FocusTrap>
          </Box>
          <Mails selectedMessage={selectedMessage} onMessageChange={(message) => updateSelectedMessage(message)}/>
        </Layout.SidePane>
        <Layout.Main>
          <EmailContent message={selectedMessage} />
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
}