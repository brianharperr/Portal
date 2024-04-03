import { Avatar, Box, Button, Card, CardActions, Divider, Input, Stack, Typography } from "@mui/joy";
import PageBuilder2 from "../../components/admin/PageBuilder2";
import { useSelector } from "react-redux";
import { getSelectedPortal } from "../../redux/features/admin.portal.slice";
import { useState } from "react";

export default function Settings2()
{

    const portal = useSelector(getSelectedPortal);
    const [name, setName] = useState(portal?.Name);
    const [subdomain, setSubdomain] = useState(portal?.Subdomain);
    const [avatar, setAvatar] = useState(portal?.LogoSource);

    const transformDomainStr = (str) => {
        let newStr = str.toLowerCase();

        // Replace spaces with "-"
        newStr = newStr.replace(/\s+/g, "-");
        
        // Remove special characters
        newStr = newStr.replace(/[^\w\s-]/gi, '');
        setSubdomain(newStr);
    }

    return (
        <PageBuilder2 portalView>
            <Stack direction="column" spacing={4} className="mx-auto"
        sx={{
          maxWidth: 800
        }}>
            <Typography level="h1">Settings</Typography>
            <Divider/>
                <Card>
                    <Typography level='title-lg'>Portal Name</Typography>
                    <Typography level='body-sm'>This is your portal's visible name within FamilyLynk. For example, the name of your company or home.</Typography>
                    <Input size='sm' value={name} onChange={(e) => setName(e.target.value)} placeholder="Portal Name" />
                    <Divider/>
                    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography level='body-sm'>Please use 128 characters at the most.</Typography>
                        <Button color='neutral' variant='outlined'>Save</Button>
                    </CardActions>
                </Card>
                <Card>
                    <Typography level='title-lg'>Portal URL</Typography>
                    <Typography level='body-sm'>This is your portal's URL namespace on FamilyLynk. Within it, your team can access the portal.</Typography>
                    <Input sx={{ width: 400}} startDecorator={"https://"} endDecorator={".familylynk.com"} size='sm' value={subdomain} onChange={(e) => transformDomainStr(e.target.value)} placeholder="portal-name" />
                    <Divider/>
                    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography level='body-sm'>Please use 45 characters at the most.</Typography>
                        <Button color='neutral' variant='outlined'>Save</Button>
                    </CardActions>
                </Card>
                <Card>
                    <Typography level='title-lg'>Portal Avatar</Typography>
                    <Typography level='body-sm'>This is your team's avatar. Click on the avatar to upload a custom one from your files.</Typography>
                    <Avatar size='lg' src={avatar}/>
                    <Divider/>
                    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography level='body-sm'>Avatars are only viewed internally.</Typography>
                        <Button color='neutral' variant='outlined'>Save</Button>
                    </CardActions>
                </Card>
                <Card>
                    <Typography level='title-lg'>Delete Portal</Typography>
                    <Typography level='body-sm'>Permanently remove your Portal and all of its contents from the FamilyLynk platform. This action is not reversible — please continue with caution.</Typography>
                    <Button size='sm' sx={{ width: 120 }} color="danger">Delete Portal</Button>
                </Card>
            </Stack>
        </PageBuilder2>
    )
}