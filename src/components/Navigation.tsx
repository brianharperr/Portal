import * as React from 'react';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import OutboxRoundedIcon from '@mui/icons-material/OutboxRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';
import AssistantPhotoRoundedIcon from '@mui/icons-material/AssistantPhotoRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <List size="sm" sx={{ '--ListItem-radius': '8px', '--List-gap': '4px' }}>
      <ListItem nested>
        <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
          Browse
        </ListSubheader>
        <List aria-labelledby="nav-list-browse">
          <ListItem>
            <ListItemButton onClick={() => {navigate('/inbox'); onClose()}} selected={location.pathname === '/inbox'}>
              <ListItemDecorator>
                <InboxRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Inbox</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => {navigate('/sent'); onClose()}} selected={location.pathname === '/sent'}>
              <ListItemDecorator>
                <OutboxRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Sent</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => {navigate('/flagged'); onClose()}} selected={location.pathname === '/flagged'}>
              <ListItemDecorator>
                <AssistantPhotoRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Flagged</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => {navigate('/trash'); onClose()}} selected={location.pathname === '/trash'}>
              <ListItemDecorator>
                <DeleteRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Trash</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
      <ListItem nested sx={{ mt: 2 }}>
        <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
          Tags
        </ListSubheader>
        <List
          aria-labelledby="nav-list-tags"
          size="sm"
          sx={{
            '--ListItemDecorator-size': '32px',
          }}
        >
          <ListItem>
              <ListItemDecorator>
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '99px',
                    bgcolor: 'primary.500',
                  }}
                />
              </ListItemDecorator>
              <ListItemContent>Work</ListItemContent>
          </ListItem>
          <ListItem>
              <ListItemDecorator>
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '99px',
                    bgcolor: 'danger.500',
                  }}
                />
              </ListItemDecorator>
              <ListItemContent>Personal</ListItemContent>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}