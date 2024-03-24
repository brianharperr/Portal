import { Cancel, Check, DoDisturb } from "@mui/icons-material";
import { Avatar, Button, ButtonGroup, Card, CardActions, CardContent, CardOverflow, Chip, Divider, Typography } from "@mui/joy";
import { axiosWithCredentials } from "../configs/axios";
import { useDispatch } from "react-redux";

export default function UserCard({user, adminView, onSecondaryClick}){

    const dispatch = useDispatch();
    function formatPhoneNumber(phoneNumber) {
        // Remove any non-digit characters from the input
        phoneNumber = phoneNumber.replace(/\D/g, '');
        
        // Format the number
        return '(' + phoneNumber.substring(0, 3) + ') ' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6);
    }

    function handleDeactive()
    {
        var payload = {
            ToggleTo: user.Activated === 1 ? 0 : 1,
            UserID: user.ID
        }
        dispatch();
        axiosWithCredentials.patch('/user/activeStatus', payload);
    }

    return (
        <Card
        sx={{
          maxWidth: "100%",
          boxShadow: "lg",
        }}
      >
        <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
          <Avatar
            src={user.Pic}
            sx={{ "--Avatar-size": "4rem" }}
          />
          <Chip
            size="sm"
            variant="soft"
            color="primary"
            sx={{
              mt: -1,
              mb: 1,
              border: "3px solid",
              borderColor: "background.surface",
            }}
          >
            {user.Role.Name}
          </Chip>
          <Typography level="title-lg">{user.FirstName + " " + user.LastName}</Typography>
          <Typography level="body-sm" sx={{ maxWidth: "24ch" }}>
            {user.Timezone}
          </Typography>
          <Typography level="body-sm" sx={{ maxWidth: "24ch" }}>
            {user.Email}
          </Typography>
            <Typography level="body-sm" sx={{ maxWidth: "24ch" }}>
                {user.PhoneNumber && formatPhoneNumber(user.PhoneNumber)}
            </Typography>
        </CardContent>
        <CardOverflow sx={{ bgcolor: "background.level1" }}>
          <CardActions sx={{ flexDirection: 'column'}} buttonFlex="1">
            <ButtonGroup
              variant="outlined"
              sx={{ bgcolor: "background.surface", width: '100%' }}
            >
              <Button>Message</Button>
              <Button onClick={() => onSecondaryClick(user.ID)}>Orders</Button>
            </ButtonGroup>
            {/* {adminView && user.Role.ID !== 1 &&
            <>
            <Divider/>
            <ButtonGroup
              variant="outlined"
              sx={{ bgcolor: "background.surface", width: '100%' }}
            >
              <Button startDecorator={user.Activated === 1 ? <DoDisturb/> : <Check/>} color='danger' onClick={handleDeactive}>{user.Activated === 1 ? "Deactivate" : "Activate" }</Button>
              <Button startDecorator={<Cancel/>}color='danger' variant='solid'>Remove</Button>
            </ButtonGroup>
            </>
            } */}
          </CardActions>
        </CardOverflow>
      </Card>
    )
}