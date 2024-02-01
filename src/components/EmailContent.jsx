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

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import FolderIcon from '@mui/icons-material/Folder';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TagConfig from '../data/Tags'

export default function EmailContent({ message }) {
  const [open, setOpen] = React.useState([false, false, false]);

  const handleSnackbarOpen = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = true;
    setOpen(updatedOpen);
  };

  const handleSnackbarClose = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };

  function formatDate(string)
  {
    // Create a Date object from the string
    const dateObject = new Date(string);
    
    // Define options for formatting the date
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    
    // Format the date using toLocaleDateString
    return dateObject.toLocaleDateString('en-US', options);
    
  }
  
  return (
    <>
    {message ?
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        <Box
          sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
        >
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<ReplyRoundedIcon />}
            onClick={() => handleSnackbarOpen(0)}
          >
            Reply
          </Button>
          <Snackbar
            color="success"
            open={open[0]}
            onClose={() => handleSnackbarClose(0)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<CheckCircleRoundedIcon />}
            endDecorator={
              <Button
                onClick={() => handleSnackbarClose(0)}
                size="sm"
                variant="soft"
                color="neutral"
              >
                Dismiss
              </Button>
            }
          >
            Your message has been sent.
          </Snackbar>
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<ForwardToInboxRoundedIcon />}
            onClick={() => handleSnackbarOpen(1)}
          >
            Forward
          </Button>
          <Snackbar
            color="success"
            open={open[1]}
            onClose={() => handleSnackbarClose(1)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<CheckCircleRoundedIcon />}
            endDecorator={
              <Button
                onClick={() => handleSnackbarClose(1)}
                size="sm"
                variant="soft"
                color="neutral"
              >
                Dismiss
              </Button>
            }
          >
            Your message has been forwarded.
          </Snackbar>
          <Button
            size="sm"
            variant="plain"
            color="danger"
            startDecorator={<DeleteRoundedIcon />}
            onClick={() => handleSnackbarOpen(2)}
          >
            Delete
          </Button>
          <Snackbar
            color="danger"
            open={open[2]}
            onClose={() => handleSnackbarClose(2)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<CheckCircleRoundedIcon />}
            endDecorator={
              <Button
                onClick={() => handleSnackbarClose(2)}
                size="sm"
                variant="soft"
                color="neutral"
              >
                Dismiss
              </Button>
            }
          >
            Your message has been deleted.
          </Snackbar>
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
            <Chip component="span" size="sm" variant="soft" color={TagConfig.find(x => x.label === message.Tag).theme}>
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
      <Typography level="body-sm" mt={2} mb={2}>
        {message?.Body}
      </Typography>
    </Sheet>
      :
      <></>
    }
    </>
  );
}