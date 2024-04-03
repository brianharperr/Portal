import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import PasswordMeterInput from '../PasswordInput';
import { Controller, useForm } from 'react-hook-form';
import { FormHelperText, List, ListItem, ListItemDecorator, ModalClose } from '@mui/joy';
import { CheckCircleOutline, CircleOutlined } from '@mui/icons-material';
import { axiosWithCredentials } from '../../configs/axios';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';

export default function UserInviteModal({ open, onClose, onSuccess }) {

    const [emails, setEmails] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const onSubmit = (data) => {
      setLoading(true);
        axiosWithCredentials.patch('/user/portal/password', data)
        .then(onSuccess)
        .catch(err => {
            if(err.response.data.code === "INVALID_CREDENTIALS"){
                setError('Current', {
                    type: 'custom',
                    message: 'Password incorrect'
                }, { shouldFocus: true })
            }
        })
        .finally(() => setLoading(false))
    }

    React.useEffect(() => {
        setEmails([]);
    }, [open])

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => onClose()}>
        <ModalDialog
        aria-labelledby="nested-modal-title"
        aria-describedby="nested-modal-description"
        sx={(theme) => ({
          [theme.breakpoints.only('xs')]: {
            top: 'unset',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: 'none',
            maxWidth: 'unset',
          },
          maxWidth: 400,
          width: 400
        })}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
          <DialogTitle>Invite users</DialogTitle>
          <DialogContent>You can invite multiple users at once by providing their email addresses. Once invited, they will receive an email to register with the portal.</DialogContent>
          <form
            onSubmit={onSubmit}
          >
            <Stack spacing={2}>
              <FormControl error={errors?.Current}>
                <FormLabel>Emails</FormLabel>
                <ReactMultiEmail
                    placeholder='Input your email'
                    emails={emails}
                    onChange={(_emails) => {
                        setEmails(_emails);
                    }}
                    autoFocus={true}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    getLabel={(email, index, removeEmail) => {
                    return (
                        <div data-tag key={index}>
                        <div data-tag-item>{email}</div>
                        <span data-tag-handle onClick={() => removeEmail(index)}>
                            ×
                        </span>
                        </div>
                    );
                    }}
                />
                {errors?.Current && <FormHelperText>{errors?.Current.message}</FormHelperText>}
              </FormControl>
              <Button 
              loading={loading}
              disabled={emails.length === 0}
              type="submit">Invite</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}