import { Avatar, Box, IconButton, ListItem, ListItemDecorator, Snackbar, Typography } from "@mui/joy";
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notification({ onClose, data })
{
    const [color, setColor] = useState('neutral');
    const [avatar, setAvatar] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    function style()
    {

        switch(data.format){
            case 'message':
                setColor('success');
                setAvatar(data.avatar);
                setOpen(true);
                break;
            default:
                setColor('neutral');
                setAvatar('');
                setOpen(false);
                break;
        }

    }

    function handleOpen()
    {
        switch(data.format){
            case 'message':
                navigate(`/inbox?id=${data.data.id}`);
                break;
        }
        onClose();
    }

    useEffect(() => {
        style();
    }, [])

    return (
        <Snackbar
        size="lg"
        animationDuration={600}
        sx={{
            padding: 0
        }}
        open={true} 
        color={color} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
        >
            <ListItem sx={{width: '100%', padding: '0.75rem'}}>

                {data.format === 'message' &&
                <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                    <Avatar src={avatar}/>
                </ListItemDecorator>
                }
                <Box sx={{ ml: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography level="title-sm">{data?.data.title}</Typography>
                            <Typography level="body-sm">{data?.data.body}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            {open &&
                                <IconButton sx={{padding: 0}} size="xs" onClick={() => handleOpen()}>
                                    <LaunchIcon fontSize="small"/>
                                </IconButton>
                            }
                            <IconButton sx={{padding: 0}} size="xs" onClick={() => onClose()}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                    </Box>

                </Box>

            </ListItem>
        </Snackbar>
    )
}