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

import Layout from '../../components/Layout';
import Navigation from '../../components/Navigation';
import Mails from '../../components/MessageList';
import EmailContent from '../../components/EmailContent';
import WriteEmail from '../../components/WriteEmail';
import HeaderAlt from '../../components/HeaderAlt';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, fetchSent, getFlagged, getInbox, getSentMessages, getTrash } from '../../redux/features/message.slice';
import { axiosWithCredentials } from '../../configs/axios';
import { useLocation, useSearchParams } from 'react-router-dom';
import ReplyEmail from '../../components/ReplyEmail';
import ForwardEmail from '../../components/ForwardEmail';

export default function Inbox() {

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState(null);
  const [writeEmailOpen, setWriteEmailOpen] = React.useState(false);
  const [replyEmailOpen, setReplyEmailOpen] = React.useState(false);
  const [forwardEmailOpen, setForwardEmailOpen] = React.useState(false);
  const [forwardMessageData, setForwardMessageData] = React.useState(null);
  const [replyMessageData, setReplyMessageData] = React.useState(null);

  const dispatch = useDispatch();
  const [queryParameters] = useSearchParams();
  const location = useLocation();
  const [display, setDisplay] = React.useState(location.pathname.slice(1))
  const path = location.pathname.slice(1);
  const [title, setTitle] = React.useState('My ' + path);
  React.useEffect(() => {
    switch(path){
      case 'inbox':
        setTitle('My inbox');
        break;
      case 'sent':
        setTitle('My sent');
        dispatch(fetchSent());
        break;
      case 'flagged':
        setTitle('My flagged');
        break;
      case 'trash':
        setTitle('My trash');
        break;
    }
  }, [path])

  const getCurrentSelector = () => {
    var currentPath = location.pathname.slice(1);
    switch (currentPath) {
      case 'inbox':
        return getInbox;
      case 'sent':
        return getSentMessages;
      case 'trash':
        return getTrash;
      case 'flagged':
        return getFlagged;
      default:
        return getInbox;
    }
  };

  // Use the selected selector to get the messages
  const messages = useSelector(getCurrentSelector());

  function updateSelectedMessage(message){
      var payload = {
        ID: message.ID
    }
    setSelectedMessage(message);
    if(message.Read === 0){
      axiosWithCredentials.put('/message/read', payload);
    }
  }

  function onReplyOpen(ID)
  {
    var selected = messages.findIndex(x => x.ID === ID);
    if(selected){
      setSelectedMessage(messages[selected]);
    }
  }

  React.useEffect(() => {
    if(writeEmailOpen){
      setReplyEmailOpen(false);
      setForwardEmailOpen(false);
    }

    if(forwardEmailOpen){
      setReplyEmailOpen(false);
      setWriteEmailOpen(false);
    }

    if(replyEmailOpen){
      setWriteEmailOpen(false);
      setForwardEmailOpen(false);
    }
  }, [writeEmailOpen, replyEmailOpen, forwardEmailOpen]);

  //fetch messages
  React.useEffect(() => {
    var payload = {
      offset: 0,
      limit: null,
    }
    dispatch(fetchMessages(payload)).unwrap()
    .then((res) => {
      const urlSelectedMessage = res.find(x => x.ID === Number(queryParameters.get('id')));
      if(urlSelectedMessage){
        setSelectedMessage(urlSelectedMessage);
      }
    })

  }, []);

  //update selected message
  React.useEffect(() => {
    if(messages != null && selectedMessage != null){
      var updatedMessage = messages.find(x => x.ID === selectedMessage.ID);
      setSelectedMessage(updatedMessage);
    }
  }, [messages])

  //select message from url query
  React.useEffect(() => {

    if(messages != null){
      const urlSelectedMessage = messages.find(x => x.ID === Number(queryParameters.get('id')));

      setSelectedMessage(urlSelectedMessage ? urlSelectedMessage : null)

    }
  }, [queryParameters]);

  
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
                {title}
              </Typography>
              <Typography level="title-sm" textColor="text.tertiary">
                {messages?.length} message{(messages?.length > 1 ? 's' : null)}
              </Typography>
            </Box>
            <Button
              size="sm"
              startDecorator={<CreateRoundedIcon />}
              onClick={() => setWriteEmailOpen(true)}
              sx={{ ml: 'auto' }}
            >
              Compose
            </Button>
            <FocusTrap open={writeEmailOpen} disableAutoFocus disableEnforceFocus>
              <WriteEmail open={writeEmailOpen} onClose={() => setWriteEmailOpen(false)} />
            </FocusTrap>
            <FocusTrap open={replyEmailOpen} disableAutoFocus disableEnforceFocus>
              <ReplyEmail data={replyMessageData} open={replyEmailOpen} onClose={() => setReplyEmailOpen(false)} />
            </FocusTrap>
            <FocusTrap open={forwardEmailOpen} disableAutoFocus disableEnforceFocus>
              <ForwardEmail data={forwardMessageData} open={forwardEmailOpen} onClose={() => setForwardEmailOpen(false)} />
            </FocusTrap>
          </Box>
          <Mails messages={messages} selectedMessage={selectedMessage} onMessageChange={(message) => updateSelectedMessage(message)}/>
        </Layout.SidePane>
        <Layout.Main className='overflow-y-auto h-[calc(100vh-64px)]'>
          <EmailContent onSelect={(ID) => onReplyOpen(ID)} onReply={(message) => {setReplyMessageData(message); setReplyEmailOpen(true)}} onForward={(message) => {setForwardMessageData(message); setForwardEmailOpen(true)}} onDelete={() => setSelectedMessage(null)} message={selectedMessage} />
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
}