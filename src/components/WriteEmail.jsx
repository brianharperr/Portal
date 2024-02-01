import React, { useState, useEffect, forwardRef } from 'react';
import Box from '@mui/joy/Box';
import ModalClose from '@mui/joy/ModalClose';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Sheet from '@mui/joy/Sheet';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, ButtonGroup, Chip, IconButton, Input, Radio, RadioGroup, Stack, Typography } from '@mui/joy';

import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import { axiosWithCredentials } from '../configs/axios';
import { Close } from '@mui/icons-material';

const WriteEmail = forwardRef(
  function WriteEmail({ open, onClose }, ref) {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ccOptions, setCCOptions] = useState([]);

    const [to, setTo] = useState([]);
    const [cc, setCC] = useState([]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [tag, setTag] = useState('None');
    const [caseRef, setCaseRef] = useState([]);

    function handleMessageFormSubmission()
    {
      onClose();
      // var payload = {
      //     CaseReference: caseRef,
      //     To: to,
      //     Cc: cc,
      //     Subject: subject,
      //     Body: body,
      //     Tag: tag

      // }
      // axiosWithCredentials.post('/message', payload)
      // .then(() => {
      //     // setMessage({
      //     //     Subject: "",
      //     //     Body: "",
      //     //     CaseReference: [],
      //     //     To: [],
      //     //     Cc: []
      //     // });
      // })
    }

    useEffect(() => {
      axiosWithCredentials.get('/search/users')
        .then(res => {
          if (res.data.length > 0) {
            setUsers(res.data.map(x => ({ label: x.Name, id: x.ID })));
            setCCOptions(res.data.map(x => ({ label: x.Name, id: x.ID })));
          }
        })
        .catch(err => {
          // Handle error
        });

        axiosWithCredentials.get('/search/cases')
        .then(res => {
            if(res.data.length > 0){
              setOrders(res.data.map(x => ({ label: "#" + x.DisplayID + " - " + x.PatientName + " (" + new Date(x.DateCreated).toLocaleDateString() + ")", id: x.ID, shortDisplay: "#" + x.DisplayID })))
            }
        })
        .catch(err => {

        });
    }, []);

    useEffect(() => {

      if (to) {
        setCCOptions(users.filter(x => to.map(x => x.id).indexOf(x.id) < 0));
        setCC(cc.filter(x => !to.map(x => x.id).includes(x.id)));

      }
    }, [to]);

    return (
      <Sheet
        ref={ref}
        sx={{
          alignItems: 'center',
          px: 1.5,
          py: 1.5,
          ml: 'auto',
          width: { xs: '100dvw', md: 600 },
          flexGrow: 1,
          border: '1px solid',
          borderRadius: '8px 8px 0 0',
          backgroundColor: 'background.level1',
          borderColor: 'neutral.outlinedBorder',
          boxShadow: 'lg',
          zIndex: 1000,
          position: 'fixed',
          bottom: 0,
          right: 24,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography level="title-sm">New message</Typography>
          <ModalClose id="close-icon" onClick={onClose} />
        </Box>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}
        >
          <FormControl required>
            <FormLabel>To</FormLabel>
            <Autocomplete multiple aria-label="Message" value={to} options={users} onChange={(e,data) => setTo(data)} />
          </FormControl>
          <FormControl>
            <FormLabel>CC</FormLabel>
            <Autocomplete multiple aria-label="Message" value={cc} options={ccOptions} onChange={(e,data) => setCC(data)} />
          </FormControl>
          <Input placeholder="Subject" aria-label="Message" />
          <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Textarea
              placeholder="Type your message here…"
              aria-label="Message"
              minRows={8}
              endDecorator={
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  flexGrow={1}
                  sx={{
                    py: 1,
                    pr: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <div>
                    <IconButton size="sm" variant="plain" color="neutral">
                      <FormatColorTextRoundedIcon />
                    </IconButton>
                    <IconButton size="sm" variant="plain" color="neutral">
                      <AttachFileRoundedIcon />
                    </IconButton>
                    <IconButton size="sm" variant="plain" color="neutral">
                      <InsertPhotoRoundedIcon />
                    </IconButton>
                    <IconButton size="sm" variant="plain" color="neutral">
                      <FormatListBulletedRoundedIcon />
                    </IconButton>
                  </div>
                  <FormControl orientation='horizontal'>
            <FormLabel>Tag</FormLabel>
            <ButtonGroup spacing="0.5rem" size="sm" aria-label="neutral button group">
              <Button variant={tag === 'None' ? 'solid' : 'soft'} color='neutral' onClick={() => setTag('None')}>None</Button>
              <Button variant={tag === 'Work' ? 'solid' : 'soft'} color='primary' onClick={() => setTag('Work')}>Work</Button>
              <Button variant={tag === 'Personal' ? 'solid' : 'soft'} color='danger' onClick={() => setTag('Personal')}>Personal</Button>
            </ButtonGroup>
          </FormControl>
                  <Button
                    color="primary"
                    sx={{ borderRadius: 'sm' }}
                    onClick={handleMessageFormSubmission}
                  >
                    Send
                  </Button>
                </Stack>
              }
              sx={{
                '& textarea:first-of-type': {
                  minHeight: 72,
                },
              }}
            />
          </FormControl>
          <Accordion>
            <AccordionSummary>Order Reference</AccordionSummary>
            <AccordionDetails>
          <FormControl>
            <Autocomplete 
            multiple 
            aria-label="Message" 
            value={caseRef} 
            options={orders} 
            onChange={(e,data) => setCaseRef(data)} 
            renderTags={(tags, getTagProps) => 
            tags.map((x, index)=> (
              <Chip
              endDecorator={<Close fontSize="sm" />}
              {...getTagProps({ index })}
            >
              {x.shortDisplay}
            </Chip>
            ))} 
            />
          </FormControl>
          </AccordionDetails>
          </Accordion>
        </Box>
      </Sheet>
    );
  }
);

export default WriteEmail;
