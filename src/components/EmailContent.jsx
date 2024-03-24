import * as React from 'react';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import AspectRatio from '@mui/joy/AspectRatio';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import Tooltip from '@mui/joy/Tooltip';
import MoreVert from '@mui/icons-material/MoreVert';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import FlagIcon from '@mui/icons-material/Flag';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import IconButton from '@mui/joy/IconButton';
import TagConfig from '../data/Tags'
import { axiosWithCredentials } from '../configs/axios';
import { useDispatch } from 'react-redux';
import { deleteMessage, flagMessage } from '../redux/features/message.slice';
import { useNavigate } from 'react-router-dom';
import { Dropdown, ListDivider, ListItemDecorator, Menu, MenuButton, MenuItem, Skeleton } from '@mui/joy';
import UndoIcon from '@mui/icons-material/Undo';

export default function EmailContent({ onDelete, message, onReply, onForward, onSelect }) {
  const [open, setOpen] = React.useState([false, false, false]);
  const [replies, setReplies] = React.useState([]);
  const [cases, setCases] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [repliesLoading, setRepliesLoading] = React.useState(false);

  function handleDelete(){

    var req = {
      id: message.ID
    }
    dispatch(deleteMessage(req)).unwrap()
    .then((res) => onDelete());

  }

  function handleFlag(value){

    var req = {
      id: message.ID,
      Flagged: value
    }
    dispatch(flagMessage(req)).unwrap();

  }

  function onReplyOpen(message){
    navigate('/inbox?id=' + message.ID);
    onSelect(message.ID);
  }

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
    if(message){
      setCases([]);
      var payload = {
        id: message.ID
      }

      axiosWithCredentials.get('/message/cases', { params: payload })
      .then(res => {
        setCases(res.data.length > 0 ? res.data : null);
      })

      if(message.ReplyID){
        setRepliesLoading(true);
        axiosWithCredentials.get('/message/replies', { params: { id: message.ReplyID } })
        .then(res => {
          setReplies(res.data);
        })
        .finally(() => setRepliesLoading(false))
      }else{
        setReplies([]);
      }

    }
  }, [message])

  return (
    <div className=''>
    {message ?
      <>
      <Sheet
      variant="outlined"
      sx={{
        minHeight: 500,
        borderRadius: 'sm',
        p: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Sender and Date Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{display: 'flex'}}>
            <Avatar
              src={message?.ProfilePicture}
            />
            <Box sx={{ ml: 2 }}>
              <Typography level="title-sm" textColor="text.primary" mb={0.5}>
                {message?.SenderName}
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                {formatDate(message?.DateCreated)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
        className="sm:flex hidden h-[32px] flex-row gap-3"
        >
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<ReplyRoundedIcon />}
            onClick={() => onReply(message)}
          >
            Reply
          </Button>
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<ForwardToInboxRoundedIcon />}
            onClick={() => onForward(message)}
          >
            Forward
          </Button>
          {message.Flagged === 1 ?
              <Button
              size="sm"
              variant="plain"
              color="warning"
              startDecorator={<UndoIcon />}
              onClick={() => handleFlag(0)}
            >
              Unflag
            </Button> 
          :
            <Button
              size="sm"
              variant="plain"
              color="warning"
              startDecorator={<FlagIcon />}
              onClick={() => handleFlag(1)}
            >
              Flag
            </Button>
          }
          <Button
            size="sm"
            variant="plain"
            color="danger"
            startDecorator={<DeleteRoundedIcon />}
            onClick={() => handleDelete()}
          >
            Delete
          </Button>

        </Box>
        <Box className="sm:hidden">
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
              >
                <MoreVert />
              </MenuButton>
              <Menu placement="bottom-end">
                <MenuItem>
                  <ListItemDecorator>
                    <ReplyRoundedIcon />
                  </ListItemDecorator>{' '}
                  Reply
                </MenuItem>
                <MenuItem>
                  <ListItemDecorator>
                    <ForwardToInboxRoundedIcon />
                  </ListItemDecorator>{' '}
                  Forward
                </MenuItem>
                <ListDivider />
                {message.Flagged === 1 ?
                <MenuItem onClick={() => handleFlag(0)}>
                  <ListItemDecorator sx={{ color: 'warning' }}>
                    <FlagIcon color='warning' />
                  </ListItemDecorator>{' '}
                  Unflag
                </MenuItem>
                :
                <MenuItem onClick={() => handleFlag(1)}>
                <ListItemDecorator sx={{ color: 'warning' }}>
                  <FlagIcon color='warning' />
                </ListItemDecorator>{' '}
                Flag
              </MenuItem>
                }
                <MenuItem>
                  <ListItemDecorator>
                    <DeleteRoundedIcon color='danger' />
                  </ListItemDecorator>{' '}
                  Delete
                </MenuItem>
              </Menu>
            </Dropdown>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box
        sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'start' }}
      >
        <Typography
          level="title-lg"
          textColor="text.primary"
          endDecorator={message.Tag &&
            <Chip component="span" size="sm" variant="soft" color={TagConfig.find(x => x.label === message.Tag)?.theme}>
              {message?.Tag}
            </Chip>
          }
        >
          {message?.Subject}
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <Typography
              component="span"
              level="body-sm"
              sx={{ mr: 1, display: 'inline-block' }}
            >
              From
            </Typography>
            <Tooltip size="sm" title="Copy email" variant="outlined">
              <Chip size="sm" variant="soft" color="primary" onClick={() => navigator.clipboard.writeText(message.SenderEmail)}>
                {message?.SenderEmail}
              </Chip>
            </Tooltip>
          </div>
          <div>
            <Typography
              component="span"
              level="body-sm"
              sx={{ mr: 1, display: 'inline-block' }}
            >
              to
            </Typography>
            <Tooltip size="sm" title="Copy email" variant="outlined">
              <Chip size="sm" variant="soft" color="primary" onClick={() => navigator.clipboard.writeText(message.RecipientEmail)}>
                {message?.RecipientEmail}
              </Chip>
            </Tooltip>
          </div>
        </Box>
      </Box>
      <Divider />
      <Typography level="body-sm" mt={2} mb={2} sx={{ minHeight: 200}}>
        {message?.Body}
      </Typography>
      {cases?.length > 0 &&
      <>
      <Divider/>
      <Typography level="title-sm" mt={2} mb={2}>
        Order References
      </Typography>
      <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
      {cases.map(x => {
        return (
          <Chip key={x.Name} variant="outlined" color='neutral' onClick={() => navigate('/case/' + x.CaseID)}>
            {x.Name} #{x.CaseID}
          </Chip>
        )
      })
      }
      </Box>
      </>
      }
      </Sheet>
      {repliesLoading ?
                <Sheet
                variant="outlined"
                sx={{
                  minHeight: 500,
                  borderRadius: 'sm',
                  p: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  {/* Sender and Date Info */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{display: 'flex'}}>
                      {/* <Avatar
                        src={reply?.ProfilePicture}
                      /> */}
                      <Skeleton animation="wave" variant="circular" width={40} height={40} />
                      <Box sx={{ ml: 2 }}>
                        <Typography level="title-sm" textColor="text.primary" mb={0.5}>
                          {/* {reply?.SenderName} */}
                          <Skeleton variant="text" level="title-sm" animation="wave" width={100}/>
                        </Typography>
                        <Typography level="body-xs" textColor="text.tertiary">
                        {/* {formatDate(reply?.DateCreated)} */}
                          <Skeleton variant="text" level="body-xs" animation="wave" width={80}/>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <Box
                  sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                >
                  <Typography
                    level="title-lg"
                    textColor="text.primary"
                  >
                    {/* {reply?.Subject} */}
                    <Skeleton variant="text" level="title-lg" animation="wave" width={100}/>
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexWrap: 'wrap',
                    }}
                  >
      
                      <Typography
                        component="span"
                        level="body-sm"
                        sx={{ mr: 1, display: 'inline-block' }}
                      >
                        <Skeleton variant="text" level="body-sm" animation="wave" width={100}/>
                      </Typography>
                     
                  </Box>
                </Box>
                <Divider />
                <Typography level="body-sm" mt={2} mb={2} sx={{ minHeight: 200}}>
                  {/* {reply?.Body} */}
                  <Skeleton variant="text" level="body-sm" animation="wave"/>
                </Typography>
      
                </Sheet>
      :
        <>
        {replies.map(reply => {
        return ( 
          <Sheet
          variant="outlined"
          sx={{
            minHeight: 500,
            borderRadius: 'sm',
            p: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {/* Sender and Date Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{display: 'flex'}}>
                <Avatar
                  src={reply?.ProfilePicture}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography level="title-sm" textColor="text.primary" mb={0.5}>
                    {reply?.SenderName}
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {formatDate(reply?.DateCreated)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
                className="sm:flex hidden h-[32px] flex-row gap-3"
                >
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    startDecorator={<ReplyRoundedIcon />}
                    onClick={() => onReplyOpen(reply)}
                  >
                    Open
                  </Button>

                </Box>
          </Box>
          <Divider sx={{ mt: 2 }} />
          <Box
            sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'start' }}
          >
            <Typography
              level="title-lg"
              textColor="text.primary"
              endDecorator={reply.Tag &&
                <Chip component="span" size="sm" variant="soft" color={TagConfig.find(x => x.label === reply.Tag)?.theme}>
                  {reply?.Tag}
                </Chip>
              }
            >
              {reply?.Subject}
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <Typography
                  component="span"
                  level="body-sm"
                  sx={{ mr: 1, display: 'inline-block' }}
                >
                  From
                </Typography>
                <Tooltip size="sm" title="Copy email" variant="outlined">
                  <Chip size="sm" variant="soft" color="primary" onClick={() => navigator.clipboard.writeText(reply.SenderEmail)}>
                    {reply?.SenderEmail}
                  </Chip>
                </Tooltip>
              </div>
              <div>
                <Typography
                  component="span"
                  level="body-sm"
                  sx={{ mr: 1, display: 'inline-block' }}
                >
                  to
                </Typography>
                <Tooltip size="sm" title="Copy email" variant="outlined">
                  <Chip size="sm" variant="soft" color="primary" onClick={() => navigator.clipboard.writeText(reply.RecipientEmail)}>
                    {reply?.RecipientEmail}
                  </Chip>
                </Tooltip>
              </div>
            </Box>
          </Box>
          <Divider />
          <Typography level="body-sm" mt={2} mb={2} sx={{ minHeight: 200}}>
            {reply?.Body}
          </Typography>
          </Sheet>
        )
      })

      }
        </>
      }

      </>
      :
      null
    }
    </div>
  );
}