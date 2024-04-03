import { Shortcut } from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, Card, CardContent, Chip, Divider, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { axiosWithAdminCredentials } from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { convertToSlug } from "../../utils/strings";
import { useDispatch } from "react-redux";
import { select } from "../../redux/features/admin.portal.slice";

const UserDisplay = ({users}) => {

    const getInitials = (string) => {
        var names = string.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();
        
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    return (
        <>
        {users.length > 0 ?
        <AvatarGroup sx={{ gap: 1 }}>
            {users.slice(0, 3).map((x, idx) => {
                return (
                    <Avatar key={x.Pic} src={x.Pic}>{getInitials(x.Name)}</Avatar>
                )
            })}
            {users.length > 3 && 
            <Avatar>+{users.length - 3}</Avatar>
            }
        </AvatarGroup>
        :
        <Skeleton variant="circular" width={40} height={40} />
        }
        </>
    )
}

export default function PortalCard({ data })
{

    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const dispatch = useDispatch();
    const redirectToPortalView = () => {
      const slug = convertToSlug(data.Subdomain);
      navigate(`/portal/${slug}/settings`);
    }

    const redirectToPortal = (e) => {
      e.stopPropagation();
      dispatch(select(data));
      window.location.href = `https://${data.Subdomain}.familylynk.com`;
    }

    useEffect(() => {

        //fetch Users
        axiosWithAdminCredentials.get('/procedure/overview-portal-data', { params: { id: data.MasterID }})
        .then((res) => {
          setUsers(res.data.users)
          setSubscription(res.data.subscription);
        })
        .finally(() => setIsLoading(false))


    }, [])

    return ( 
        <Card onClick={redirectToPortalView} className=" shadow-sm hover:shadow-md duration-200 transition-all hover:cursor-pointer">
        <CardContent orientation="horizontal" sx={{ alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                m: '-2px',
                borderRadius: '50%',
                background:
                  'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
              },
            }}
          >
            <Avatar
              size="sm"
              src={data.LogoSource}
              alt=""
            />
          </Box>
          <Box
          sx={{
            marginLeft: 0.25
          }}
          >
          <Typography fontWeight="lg">{data.Name}</Typography>
          </Box>
          <Tooltip title="Open Portal">
          <IconButton onClick={(e) => redirectToPortal(e)} variant="plain" color="neutral" size="sm" sx={{ ml: 'auto' }}>
            <Shortcut/>
          </IconButton>
          </Tooltip>
        </CardContent>
        <Divider inset="2"/>
        <CardContent orientation="horizontal" sx={{ justifyItems: 'center', alignItems: 'center', gap: 2 }}>
          <Typography level='title-md'>{data.UserCount} user{data.UserCount > 1 ? 's' : null}</Typography>
          <UserDisplay users={users}/>
        </CardContent>
        <Divider inset="2"/>
        <CardContent orientation="vertical">
            <Stack direction="row" sx={{ justifyItems: 'center', alignItems: 'center', gap: 2 }}>
              <Typography level='title-sm'>Status</Typography>
              <Chip color={subscription?.active ? "success" : "danger"} variant="outlined" size='sm'>{subscription?.active ? "Active" : "Inactive"}</Chip>
            </Stack>
            <Stack direction="row" sx={{ justifyItems: 'center', alignItems: 'center', gap: 2 }}>
              <Typography level='title-sm'>Subscription Plan</Typography>
              <Typography level='body-sm'>{subscription?.name}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyItems: 'center', alignItems: 'center', gap: 2 }}>
              <Typography level='title-sm'>Renewal Date</Typography>
              <Typography level='body-sm'>{subscription?.payment_due_date}</Typography>
            </Stack>

        </CardContent>
        </Card>
    )
}