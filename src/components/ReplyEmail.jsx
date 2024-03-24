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

const ReplyEmail = forwardRef(
  function WriteEmail({ open, onClose, data }, ref) {
    const [orders, setOrders] = useState([]);
    const [to, setTo] = useState([]);
    const [body, setBody] = useState("");
    const [tag, setTag] = useState(null);
    const [caseRef, setCaseRef] = useState([]);

    const subject = "RE: " + data?.Subject;

    function handleMessageFormSubmission()
    {

      var payload = {
          CaseReference: caseRef?.map(x => x.id),
          Cc: [],
          To: [data.SenderID],
          Subject: subject,
          Body: body,
          Tag: tag,
          ReplyID: data.ID

      }
      axiosWithCredentials.post('/message', payload)
      .then(() => {
          onClose();
      })
    }

    useEffect(() => {
      if(!open){
        setTo([]);
        setBody("");
        setTag(null);
        setCaseRef([]);
      }
    }, [open])

    useEffect(() => {

      if(data){
        axiosWithCredentials.get('/search/cases')
        .then(res => {
            if(res.data.length > 0){
              setOrders(res.data.map(x => ({ label: "#" + x.DisplayID + " - " + x.PatientName + " (" + new Date(x.DateCreated).toLocaleDateString() + ")", id: x.ID, shortDisplay: "#" + x.DisplayID })))
            }
        })
        .catch(err => {

        });
      }
    }, []);

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
          right: { xs: 0, md: 24 },
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography level="title-sm">Reply to message</Typography>
          <ModalClose id="close-icon" onClick={onClose} />
        </Box>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}
        >
          <FormControl required>
            <FormLabel>To</FormLabel>
            <Autocomplete aria-label="Message" placeholder={data?.SenderName} options={[]} />
          </FormControl>
          <Input disabled placeholder="Subject" value={subject} aria-label="Message"/>
          <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Textarea
              placeholder="Type your message here…"
              aria-label="Message"
              minRows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              endDecorator={
                <Stack
                  justifyContent="space-between"
                  alignItems="center"
                  flexGrow={1}
                  sx={{
                    flexDirection: { xs: "column", md: "row"},
                    py: 1,
                    pr: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <div>
                    <IconButton disabled size="sm" variant="plain" color="neutral">
                      <FormatColorTextRoundedIcon />
                    </IconButton>
                    <IconButton disabled size="sm" variant="plain" color="neutral">
                      <AttachFileRoundedIcon />
                    </IconButton>
                    <IconButton disabled size="sm" variant="plain" color="neutral">
                      <InsertPhotoRoundedIcon />
                    </IconButton>
                    <IconButton disabled size="sm" variant="plain" color="neutral">
                      <FormatListBulletedRoundedIcon />
                    </IconButton>
                  </div>
                  <FormControl sx={{ marginLeft: {xs: 1, md: 0}, marginTop: {xs: 1, md: 0}}} orientation='horizontal'>
                    <FormLabel>Tag</FormLabel>
                    <ButtonGroup spacing="0.5rem" size="sm" aria-label="neutral button group">
                      <Button variant={tag === null ? 'solid' : 'soft'} color='neutral' onClick={() => setTag(null)}>None</Button>
                      <Button variant={tag === 'Work' ? 'solid' : 'soft'} color='primary' onClick={() => setTag('Work')}>Work</Button>
                      <Button variant={tag === 'Personal' ? 'solid' : 'soft'} color='danger' onClick={() => setTag('Personal')}>Personal</Button>
                    </ButtonGroup>
                  </FormControl>
                  <Button
                    color="primary"
                    sx={{ borderRadius: 'sm',  display: { xs: "none", md: "block"} }}
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
              key={x.shortDisplay}
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
          <FormControl sx={{ display: { xs: "flex", md: "none"} }}>
          <Button
                    color="primary"
                    sx={{ borderRadius: 'sm' }}
                    onClick={handleMessageFormSubmission}
                  >
                    Send
                  </Button>
          </FormControl>
        </Box>
      </Sheet>
    );
  }
);

export default ReplyEmail;
