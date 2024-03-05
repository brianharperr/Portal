import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
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

export default function ResetPasswordModal({ open, onClose }) {

    const { register, watch, handleSubmit, setError, formState: { errors } } = useForm({
        Current: '',
        New: '',
        Confirm: ''
    });

    const password = watch('New');
    const confirmPassword = watch('Confirm');
    const [valid, setValid] = React.useState(false);

    const hasCapitalLetter = (str) => /[A-Z]/.test(str);
    const hasNumber = (str) => /\d/.test(str);
    const hasSpecialCharacter = (str) => /[!@#$%^&*(),.?":{}|<>]/.test(str);

    const validatePassword = () => {
        var valid = (
            hasCapitalLetter(password) &&
            hasNumber(password) &&
            hasSpecialCharacter(password) &&
            password.length >= 12 &&
            password === confirmPassword
        )
        setValid(valid);
    }

    React.useEffect(() => {
        validatePassword()
    }, [password, confirmPassword])

    const onSubmit = (data) => {
        axiosWithCredentials.patch('/user/portal/password', data)
        .catch(err => {
            if(err.response.data.code === "INVALID_CREDENTIALS"){
                setError('Current', {
                    type: 'custom',
                    message: 'Password incorrect'
                }, { shouldFocus: true })
            }
        })
    }
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
        })}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
          <DialogTitle>Reset password</DialogTitle>
          <DialogContent>Fill in the form to reset your password.</DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={2}>
              <FormControl error={errors?.Current}>
                <FormLabel>Current Password</FormLabel>
                <Input {...register('Current')} type='password' autoFocus required />
                {errors?.Current && <FormHelperText>{errors?.Current.message}</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input {...register('New')} type='password' required/>
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input {...register('Confirm')} type='password' required />
              </FormControl>
              <Stack>
                <List size='sm'>
                    <ListItem>
                        <ListItemDecorator>{password?.length >= 12 ? <CheckCircleOutline color='success'/> : <CircleOutlined color='danger'/>}</ListItemDecorator>
                        At least 12 characters
                    </ListItem>
                    <ListItem>
                        <ListItemDecorator>{hasCapitalLetter(password) ? <CheckCircleOutline color='success'/> : <CircleOutlined color='danger'/>}</ListItemDecorator>
                        Capital letter
                    </ListItem>
                    <ListItem>
                        <ListItemDecorator>{hasNumber(password) ? <CheckCircleOutline color='success'/> : <CircleOutlined color='danger'/>}</ListItemDecorator>
                        Number
                    </ListItem>
                    <ListItem>
                        <ListItemDecorator>{hasSpecialCharacter(password) ? <CheckCircleOutline color='success'/> : <CircleOutlined color='danger'/>}</ListItemDecorator>
                        Special character
                    </ListItem>
                    <ListItem>
                       <ListItemDecorator>{password === confirmPassword ? <CheckCircleOutline color='success'/> : <CircleOutlined color='danger'/>}</ListItemDecorator>
                        Passwords match
                    </ListItem>
                </List>
              </Stack>
              <Button 
              disabled={!valid}
              type="submit">Reset</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}