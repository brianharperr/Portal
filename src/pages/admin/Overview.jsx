import { getPortals } from "../../redux/features/admin.portal.slice";
import { useSelector } from 'react-redux'

import PageBuilder2 from "../../components/admin/PageBuilder2";
import { Box, Button, Grid, Typography } from "@mui/joy";
import PortalCard from "../../components/admin/PortalCard";

export default function Overview() {

  const portals = useSelector(getPortals);


  return (
    <PageBuilder2>
      <Box
      className="mx-auto"
        sx={{
          
          maxWidth: 1024
        }}
      >
        <div className="mb-2 flex justify-end">
          <Button onClick={() => window.location.href = '/create-portal'} color="neutral" variant="outlined">Add Portal</Button>
        </div>
        <Typography level='title-sm'>Portals</Typography>
        <Grid container spacing={2} sx={{flexGrow: 1, mt: 0.25}}>
        {portals?.map(portal => (
          <Grid xs={12} sm={6}>
            <PortalCard data={portal}/>
          </Grid>
        ))}
        </Grid>
      </Box>
    </PageBuilder2>
  );
};