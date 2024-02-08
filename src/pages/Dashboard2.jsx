import { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { Dropdown, Grid, Menu, MenuButton, MenuItem } from '@mui/joy';
import { axiosWithCredentials } from '../configs/axios';
import BacklogWidget from '../components/widgets/BacklogWidget';

export default function Dashboard2() {

    const navigate = useNavigate();
    const [widgets, setWidgets] = useState([]);
    const [addWidgetLoading, setAddWidgetLoading] = useState(false);
    function addWidget(type)
    {
        setAddWidgetLoading(true);
        axiosWithCredentials.post('/widget', { Type: type })
        .then(res => {
            setWidgets(prev => [...prev, res.data])
        })
        .finally(() => setAddWidgetLoading(false))
    }

    useEffect(() => {
        axiosWithCredentials.get('/widget')
        .then(res => setWidgets(res.data))
        .catch((err) => {})
    }, [])

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                Dashboard
              </Link>
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
              Home
            </Typography>
          </Box>
          <Grid container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ flexGrow: 1 }}>
          {widgets.map(x => {
            switch(x.Type){
                case 'Backlog':
                    return (
                      <Grid xs={12} sm={12} md={6}>
                        <BacklogWidget/>
                      </Grid>
                    )
                default:
                    return null;
            }
          })}
          </Grid>
            <Dropdown variant='outlined'>
                <MenuButton loading={addWidgetLoading} sx={{ width: 200}} color='primary'>
                <Add/>
                Add Widget
                </MenuButton>
                <Menu size='sm' placement='bottom-start'>
                    <MenuItem onClick={() => addWidget("Spotlight")}>Spotlight</MenuItem>
                    <MenuItem onClick={() => addWidget("Backlog")}>Backlog</MenuItem>
                </Menu>
            </Dropdown>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}