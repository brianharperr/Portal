import { useEffect, useState } from "react"
import { axiosWithAdminCredentials } from "../../configs/axios";
import { Avatar, AvatarGroup, Box, Button, Card, CardActions, CardContent, CssBaseline, CssVarsProvider, Divider, IconButton, LinearProgress, List, ListItem, Stack, Typography } from "@mui/joy";
import { CreateRounded, FavoriteBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import HeaderAlt2 from "../../components/HeaderAlt2";

export default function Dashboard()
{

    const [portals, setPortals] = useState([]);
    const [isPortalsLoaded, setIsPortalsLoaded] = useState(false);
    const navigate = useNavigate();

    const openPortal = (subdomain) => {

        const url = new URL(import.meta.env.VITE_BASE_URL);
        const redirect = `${url.protocol}//${subdomain}.${url.host}`;
        window.location.href = redirect;

    }


    useEffect(() => {
        axiosWithAdminCredentials.get('/portal')
        .then(res => {
            setPortals(res.data);
        })
        .finally(() => setIsPortalsLoaded(true));
    }, [])

    return (
        <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
  
        <Layout.Root
        >
          <Layout.Header>
            <HeaderAlt2 />
          </Layout.Header>
          <Stack direction="column" spacing={2} sx={{ display: 'flex', width: '100%'}} >
            <Typography level="title-lg">Portals</Typography>
            <Divider/>
            {isPortalsLoaded ?
            <>
                    {portals.length > 0 ?
        <>
            {portals.map(x => {
                return (
                    <Card
                    variant="outlined"
                    sx={{
                        maxWidth: 600,
                        // to make the card resizable
                        overflow: 'auto',
                        resize: 'horizontal',
                    }}
                    >
                    <Box
                        sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        }}
                    >
                        <Avatar src={x.LogoSource} size="lg" />
                        <Typography level="title-sm">{x.UserCount} user{x.UserCount > 1 ? "s" : null}</Typography>
                    </Box>
                    <CardContent>
                        <Typography level="title-lg">{x.Name}</Typography>
                        <Typography level="body-sm">
                        
                        </Typography>
                    </CardContent>
                    <CardActions buttonFlex="0 1 140px">
                        <Button variant="outlined" color="neutral" onClick={() => openPortal(x.Subdomain)}>
                        View
                        </Button>
                        <Button variant="solid" color="primary">
                        Edit
                        </Button>
                    </CardActions>
                    </Card>
                )
            })
            
            }  
        </>
        :
        "No portals found"
        }
            </>
            :
            <LinearProgress/>
            }
        </Stack>

        </Layout.Root>
      </CssVarsProvider>
    )
}