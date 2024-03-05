import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header';
import { useEffect, useRef, useState, forwardRef } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, getUser, updateUser } from '../redux/features/user.slice';
import { Autocomplete, AutocompleteOption, CircularProgress, FormHelperText, Snackbar, styled } from '@mui/joy';
import ImageCropper from '../components/profile/ImageCropper';
import { Controller, useForm } from 'react-hook-form';
import { axiosWithCredentials } from '../configs/axios';

import timezone from '../data/Timezones';
import InputMask from "react-input-mask";
import { CheckCircleOutline } from '@mui/icons-material';
import ResetPasswordModal from '../components/modals/ResetPasswordModal.jsx';
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 100%;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 100%;
`;

export default function Profile2() {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [roles, setRoles] = useState(null);
    const user = useSelector(getUser);
    const [resetPassword, setResetPassword] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle');
    const [imageCrop, setImageCrop] = useState({
        open: false,
        image: ""
    })
    const { register, handleSubmit, reset, watch, control } = useForm({
        defaultValues: user,
      });

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
      };


    const onSubmit = async (data) => {
        setSaveStatus('loading');
        var payload = {
            ID: user.ID,
            FirstName: data.firstname,
            LastName: data.lastname,
            PhoneNumber: data.phonenumber.replace(/\D/g, ''),
            Email: data.email,
            Timezone: data.timezone,
            RoleID: data.role,
        }
        try{
            const resultAction = await dispatch(updateUser(payload)).unwrap()
            setSaveStatus('fulfilled')
 
        }catch(err){
            setSaveStatus('error')
        }

    }

    const onImageSelect = (e) => {
        e.preventDefault();
        const selectedFile = e.target.files[0];
        if(selectedFile){
            setImageCrop({open: true, image: selectedFile});
        }
    }

    const onCancel = (e) => {
        if(user){
            reset({
                firstname: user.FirstName,
                lastname: user.LastName,
                email: user.Email,
                role: user.Role.ID,
                timezone: user.Timezone,
                phonenumber: user.PhoneNumber
            })
        }
    }
    useEffect(() => {
        dispatch(fetchUser());
        axiosWithCredentials.get('/role')
        .then((res) => setRoles(res.data));

    }, [])

    useEffect(() => {
        if(user){
            reset({
                firstname: user.FirstName,
                lastname: user.LastName,
                email: user.Email,
                role: user.Role.ID,
                timezone: user.Timezone,
                phonenumber: user.PhoneNumber
            })

            if(user.EmailVerifyNeeded === 1){
                
            }
        }
    }, [user, watch])

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <ResetPasswordModal open={resetPassword} onClose={() => setResetPassword(false)}/>
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
        open={saveStatus === 'loading'}
        >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography
                        level='body-sm'
                        startDecorator={<CircularProgress color="neutral" size="sm" sx={{ marginRight: 1}}/>}
                    >
                        Saving profile changes...
                    </Typography>
                </Box>
        </Snackbar>
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
        open={saveStatus === 'fulfilled'}
        autoHideDuration={3000}
        onClose={() => setSaveStatus('idle')}
        color='success'
        >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography
                        level='body-sm'
                        color='success'
                        startDecorator={<CheckCircleOutline color="success" size="sm" sx={{ marginRight: 0}}/>}
                    >
                        Profile updated.
                    </Typography>
                </Box>
        </Snackbar>
        <Sidebar />
        <Header />
        <Box
          component="main"
          className="MainContent"
          sx={{
            pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
            overflow: 'auto',
          }}
        >
            <ImageCropper size="small" visible={imageCrop.open} image={imageCrop.image} onClose={() => setImageCrop({ open: false, image: ""})}/>
            <Box sx={{ flex: 1, width: '100%' }}>
            <Box
                sx={{
                position: 'sticky',
                top: { sm: -100, md: -110 },
                bgcolor: 'background.body',
                }}
            >
                <Box sx={{ px: { xs: 2, md: 6 } }}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="sm" />}
                    sx={{ pl: 0 }}
                >
                    <Link
                    underline="none"
                    color="neutral"
                    href="/"
                    aria-label="Home"
                    >
                    <HomeRoundedIcon />
                    </Link>
                    <Link
                    underline="hover"
                    color="neutral"
                    href="#some-link"
                    fontSize={12}
                    fontWeight={500}
                    >
                    Users
                    </Link>
                    <Typography color="primary" fontWeight={500} fontSize={12}>
                    My profile
                    </Typography>
                </Breadcrumbs>
                <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                    My profile
                </Typography>
                </Box>
            </Box>
            <Stack
                spacing={4}
                sx={{
                display: 'flex',
                maxWidth: '800px',
                mx: 'auto',
                px: { xs: 2, md: 6 },
                py: { xs: 2, md: 3 },
                }}
            >
                <Card>
                <Box sx={{ mb: 1 }}>
                    <Typography level="title-md">Personal info</Typography>
                    <Typography level="body-sm">
                    Customize how your profile information will apper in the portal.
                    </Typography>
                </Box>
                <Divider />
                <form onSubmit={handleSubmit(onSubmit)}>
                <Stack
                    direction="row"
                    spacing={3}
                    sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
                >
                    <Stack direction="column" spacing={1}>
                    <AspectRatio
                        ratio="1"
                        maxHeight={200}
                        sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
                    >
                        <img
                        src={user?.Pic}
                        loading="lazy"
                        alt=""
                        />
                    </AspectRatio>
                    <IconButton
                    onClick={handleFileButtonClick}
                        tabIndex={-1}
                        aria-label="upload new picture"
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        sx={{
                        bgcolor: 'background.body',
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        left: 100,
                        top: 170,
                        boxShadow: 'sm',
                        }}
                    >
                        <VisuallyHiddenInput ref={fileInputRef} onChange={onImageSelect} type="file" />
                        <EditRoundedIcon className='-z-1' />
                    </IconButton>
                    </Stack>
                    <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}>
           
                        <FormControl
                        sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                        >
                        <Input 
                            required
                            size="sm" 
                            {...register("firstname", {required: true, min: 1, maxLength: 45})} 
                            placeholder="First name"
                            slotProps={{
                                input: {
                                maxLength: 45
                                },
                            }}
                        />
                        </FormControl>
                        <FormControl
                        sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                        >
                        <Input 
                            required
                            size="sm" {...register("lastname", {required: true, min: 1, maxLength: 45})} 
                            placeholder="Last name" 
                            sx={{ flexGrow: 1 }} 
                            slotProps={{
                                input: {
                                maxLength: 45
                                },
                            }}
                        />
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <FormControl color={user?.EmailChangeAddress ? 'warning' : 'neutral'} sx={{ flexGrow: 1 }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            required
                            size="sm"
                            type="email"
                            startDecorator={<EmailRoundedIcon color={user?.EmailChangeAddress ? 'warning' : ''} />}
                            {...register("email", {required: true, pattern: /^\S+@\S+$/i})}
                            placeholder="email@provider.com"
                            sx={{ flexGrow: 1 }}
                            slotProps={{
                                input: {
                                  maxLength: 128
                                },
                            }}
                        />
                        {user?.EmailChangeAddress &&
                            <FormHelperText className='font-light'>
                            We sent a verification email to <span className='font-medium underline'>{user?.EmailChangeAddress}</span>.
                            </FormHelperText>
                        }
                        </FormControl>
                        <FormControl>
                        <FormLabel>Role</FormLabel>
                        <Controller
                        name="role"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                            return (
                            <Select 
                            value={value ? value : ""} 
                            onChange={(e, newValue) => {
                                onChange(newValue);
                            }} 
                            id="select" 
                            size="sm" 
                            disabled
                            >
                                {roles?.map(x => {
                                    return <Option key={x.ID} value={x.ID}>{x.Name}</Option>
                                })
                            }
                            </Select>
                            )
                        }}
                        >
                        </Controller>
                        </FormControl>
                    </Stack>
                    <Stack className="!mt-2" spacing={1}>
                    <FormControl sx={{ display: { sm: 'contents' } }}>
                        <FormLabel>Timezone</FormLabel>
                        <Controller
                            name="timezone"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                value={value ? value : ""} 
                                onChange={(e, newValue) => {
                                    onChange(newValue);
                                }} 
                                size="sm"
                                autoHighlight 
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                options={timezone}
                                >
                                    {timezone?.map(x => {
                                        return <Option value={x.value}>{x.label}</Option>
                                    })
        
                                    }
                                </Select>
                            )}
                        />
                    </FormControl>
                    </Stack>
                    <Stack className="!my-2" spacing={1}>
                    <FormControl sx={{ display: { sm: 'contents' } }}>
                        <FormLabel>Phone number</FormLabel>
                        <Controller
                            name="phonenumber"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputMask
                                {...field}
                                mask="(999) 999-9999"
                                maskChar="_"
                                placeholder="(123) 456-7890"
                                >
                                    {(inputProps) => (
                                        <Input
                                        size="sm"
                                        {...inputProps}
                                        />
                                    )}
                                </InputMask>
                            )}
                        />
                    </FormControl>
                    <Link level='body-sm' onClick={() => setResetPassword(true)}>Reset password</Link>
                    </Stack>
                    </Stack>
                </Stack>
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
                >
                    <Stack direction="row" spacing={2}>
                    <Stack direction="column" spacing={1}>
                    <AspectRatio
                        ratio="1"
                        maxHeight={108}
                        sx={{ flex: 1, minWidth: 108, borderRadius: '100%' }}
                    >
                        <img
                        src={user?.Pic}
                        loading="lazy"
                        alt=""
                        />
                    </AspectRatio>
                    <IconButton
                    onClick={handleFileButtonClick}
                        tabIndex={-1}
                        aria-label="upload new picture"
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        sx={{
                        bgcolor: 'background.body',
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        left: 100,
                        top: 170,
                        boxShadow: 'sm',
                        }}
                    >
                        <VisuallyHiddenInput ref={fileInputRef} onChange={onImageSelect} type="file" />
                        <EditRoundedIcon className='-z-1' />
                    </IconButton>
                    </Stack>
                    <Stack spacing={1} sx={{ flexGrow: 1 }}>
                        <FormLabel>Name</FormLabel>
                        <FormControl
                        sx={{
                            display: {
                            sm: 'flex-column',
                            md: 'flex-row',
                            },
                            gap: 2,
                        }}
                        >
                        <Input size="sm" placeholder="First name" />
                        <Input size="sm" placeholder="Last name" />
                        </FormControl>
                    </Stack>
                    </Stack>
                    <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Input size="sm" defaultValue="UI Developer" />
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        size="sm"
                        type="email"
                        startDecorator={<EmailRoundedIcon />}
                        placeholder="email"
                        defaultValue="siriwatk@test.com"
                        sx={{ flexGrow: 1 }}
                    />
                    </FormControl>
                    <div>
                    <FormControl sx={{ display: { sm: 'contents' } }}>
                        <FormLabel>Timezone</FormLabel>
                        <Select
                        size="sm"
                        startDecorator={<AccessTimeFilledRoundedIcon />}
                        defaultValue="1"
                        >
                        <Option value="1">
                            Indochina Time (Bangkok){' '}
                            <Typography textColor="text.tertiary" ml={0.5}>
                            — GMT+07:00
                            </Typography>
                        </Option>
                        <Option value="2">
                            Indochina Time (Ho Chi Minh City){' '}
                            <Typography textColor="text.tertiary" ml={0.5}>
                            — GMT+07:00
                            </Typography>
                        </Option>
                        </Select>
                    </FormControl>
                    </div>
                </Stack>
                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                    <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                    <Button size="sm" variant="outlined" color="neutral" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button size="sm" variant="solid" type='submit'>
                        Save
                    </Button>
                    </CardActions>
                </CardOverflow>
                </form>
                </Card>
            </Stack>
            </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}