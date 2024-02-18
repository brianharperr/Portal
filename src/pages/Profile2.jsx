import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useEffect, useRef, useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import CountrySelector from '../components/profile/CountrySelector';
import TimezoneSelector from '../components/profile/TimezoneSelector';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, getUser } from '../redux/features/user.slice';
import { Tooltip, styled } from '@mui/joy';
import ImageCropper from '../components/profile/ImageCropper';
import { Controller, useForm } from 'react-hook-form';
import { axiosWithCredentials } from '../configs/axios';

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
    const [imageCrop, setImageCrop] = useState({
        open: false,
        image: ""
    })

    const { register, handleSubmit, reset, watch, control, fields } = useForm({
        defaultValues: user,
      });
    const handleFileButtonClick = () => {
        fileInputRef.current.click();
      };

    const onSubmit = (data) => {
        console.log(data);
    }

    const onImageSelect = (e) => {
        e.preventDefault();
        const selectedFile = e.target.files[0];
        if(selectedFile){
            setImageCrop({open: true, image: selectedFile});
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
                timezone: user.Timezone
            })
        }
    }, [user, watch])
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
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
                    href="#some-link"
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
                        <Input size="sm" {...register("firstname")} placeholder="First name" />
                        </FormControl>
                        <FormControl
                        sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                        >
                        <Input size="sm" {...register("lastname")} placeholder="Last name" sx={{ flexGrow: 1 }} />
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            size="sm"
                            type="email"
                            startDecorator={<EmailRoundedIcon />}
                            {...register("email")}
                            placeholder="email@provider.com"
                            sx={{ flexGrow: 1 }}
                        />
                        </FormControl>
                        <FormControl>
                        <FormLabel>Role</FormLabel>
                        <Controller
                        name="role"
                        control={control}
                        render={({field}) => {
                            return (<Select {...field} id="select" size="sm" disabled={user?.Role.ID !== 1}>
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
                    <div>
                        <TimezoneSelector {...register("timezone")} defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}/>
                    </div>
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
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                            srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                            loading="lazy"
                            alt=""
                        />
                        </AspectRatio>
                        <IconButton
                        aria-label="upload new picture"
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        sx={{
                            bgcolor: 'background.body',
                            position: 'absolute',
                            zIndex: 2,
                            borderRadius: '50%',
                            left: 85,
                            top: 180,
                            boxShadow: 'sm',
                        }}
                        >
                        <EditRoundedIcon />
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
                    <CountrySelector />
                    </div>
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
                    <Button size="sm" variant="outlined" color="neutral">
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