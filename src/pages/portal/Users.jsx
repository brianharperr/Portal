import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { FocusTrap } from '@mui/base/FocusTrap';
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Grid,
  Stack,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { getPortal } from "../../redux/features/portal.slice";
import { useEffect, useState } from "react";
import { fetchUser, fetchUsers, getUser, getUsers } from "../../redux/features/user.slice";
import UserCard from "../../components/UserCard";
import WriteEmail from "../../components/WriteEmail";
import UserInviteModal from "../../components/modals/UserInviteModal";


export default function Users() {
  
  const navigate = useNavigate();
  const portal = useSelector(getPortal);
  const dispatch = useDispatch();
  const users = useSelector(getUsers);
  const user = useSelector(getUser);
  const [writeEmailOpen, setWriteEmailOpen] = useState(false);
  const [inviteModal, setInviteModal] = useState(false)
  const [toDefault, setToDefault] = useState(null);
  const viewUserOrders = (id) => {
    navigate("/orders", { state: { director: id }});
  }

  const openMessageToUser = (id) => {
    setToDefault(id);
    setWriteEmailOpen(true);
  }

  useEffect(() => {
    if(!users){
      dispatch(fetchUsers());
    }
    if(!user){
      dispatch(fetchUser());
    }
  }, [])

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              <Typography color="primary" fontWeight={500} fontSize={12}>
                Users
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              Users
            </Typography>
            <Button
              color="primary"
              startDecorator={<PersonAddRoundedIcon />}
              size="sm"
              onClick={() => setInviteModal(true)}
            >
              Invite User
            </Button>
          </Box>
          <UserInviteModal open={inviteModal} onClose={() => setInviteModal(false)} />
          <FocusTrap open={writeEmailOpen} disableAutoFocus disableEnforceFocus>
              <WriteEmail toDefault={toDefault} open={writeEmailOpen} onClose={() => setWriteEmailOpen(false)} />
          </FocusTrap>
          <Box sx={{ flex: 1, justifyContent: 'center', width: "100%" }}>
            <Grid container columns={{ xs: 1, sm: 2, xl: 4}} spacing={4}>
              {users?.map(x => {
                return (
                <Grid xs={1} item>
                  <UserCard onPrimaryClick={openMessageToUser} onSecondaryClick={viewUserOrders} adminView={user?.Role.ID === 1} user={x} key={x.ID}/>
                </Grid>
                )
              })}
            </Grid>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
