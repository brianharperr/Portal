import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { LinearProgress, Skeleton } from '@mui/joy';
import { useSelector } from 'react-redux';
import { getMessageStatus } from '../redux/features/message.slice';
import TagConfig from '../data/Tags';
import { useLocation } from 'react-router-dom';

export default function MessageList({ messages, selectedMessage, onMessageChange }) {

  const location = useLocation();
  const path = location.pathname.slice(1);
  const [readMessages, setReadMessages] = React.useState([]);
  const messageStatus = useSelector(getMessageStatus);

  function formatDate(string)
  {
    // Create a Date object from the string
    const dateObject = new Date(string);
    
    // Define options for formatting the date
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    
    // Format the date using toLocaleDateString
    return dateObject.toLocaleDateString('en-US', options);
    
  }

  React.useEffect(() => {

  }, [messages])
  function messageMarker(item)
  {
    if(path === 'sent'){
      return ''
    }

    if(item.Read === 1){
      if(item.Flagged){
        return '4px solid var(--joy-palette-warning-500, #0B6BCB)'
      }else{
        return ''
      }
    }else{
      if(readMessages.includes(item.ID)){
        if(item.Flagged){
          return '4px solid var(--joy-palette-warning-500, #0B6BCB)'
        }else{
          return ''
        }
      }else{
        return '4px solid var(--joy-palette-primary-500, #0B6BCB)';
      }
    }
  }

  function tagMarker(item)
  {
    var config = TagConfig.find(x => x.label === item.Tag)
    return (
      <>
      {config &&
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '99px',
            bgcolor: `${config.theme}.${config.level}`,
          }}
        />
      }
      </>
    )
  }
  React.useEffect(() => {

    if(selectedMessage && !readMessages.includes(selectedMessage.ID)){
      setReadMessages([...readMessages, selectedMessage.ID])
    }
  }, [selectedMessage]);

  return (
    <List
      sx={{
        [`& .${listItemButtonClasses.root}.${listItemButtonClasses.selected}`]: {
          borderLeft: '2px solid',
          borderLeftColor: 'var(--joy-palette-primary-outlinedBorder)',
        },
      }}
      className="overflow-y-auto h-[calc(100vh-140px)]"
    >
      <div className='min-h-[6px]'>
      {messageStatus === 'loading' && <LinearProgress/>}
      </div>
      {messages?.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemButton
              selected={item.Flagged === 1}
              color={item.Flagged === 1 ? "warning" : 'neutral'}
              {...(item.ID === selectedMessage?.ID && {
                selected: true,
                color: 'neutral',
              })}
              onClick={() => onMessageChange(item)}
              sx={{ p: 2, borderLeft: messageMarker(item)}}
            >
              <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                {/* <Skeleton variant="circular" width={48} height={48} /> */}
                <Avatar alt="" srcSet={item.avatar2x} src={item.avatar} />
              </ListItemDecorator>
              <Box sx={{ pl: 2, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 100 }}>
                    <Typography level="body-xs">{item.SenderName}</Typography>
                    {/* <Skeleton variant="text" level="body-xs" /> */}
                    {tagMarker(item)}
                    
                  </Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {formatDate(item.DateCreated)}
                  </Typography>
                  {/* <Skeleton variant="text" level="body-xs" className="!w-[50px] float-right" /> */}
                </Box>
                <div>
                  <Typography level="title-sm" sx={{ mb: 0.5 }}>
                    {item.Subject}
                  </Typography>
                  {/* <Skeleton variant="text" level="title-sm" />
                  <Skeleton variant="text" level="body-sm" /> */}
                  <Typography level="body-sm">{item.Body}</Typography>
                </div>
              </Box>
            </ListItemButton>
          </ListItem>
          <ListDivider sx={{ m: 0 }} />
        </React.Fragment>
      ))}
    </List>
  );
}