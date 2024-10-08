import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMessages } from "../redux/features/message.slice";
import Notification from "./Notification";

export default function WebNotificationHandler({ user })
{
    const dispatch = useDispatch();
    const [notificationStack, setNotificationStack] = useState([]);

    function pageSpecificBehavior()
    {
        switch(window.location.pathname){
            case '/inbox':
                //Refresh inbox
                var payload = {
                    offset: 0,
                    limit: null,
                }
                dispatch(fetchMessages(payload));
                break;
        }
    }

    function closeNotification()
    {
        setNotificationStack(notificationStack.slice(1))
    }

    return (
        <>
        {notificationStack.length > 0 &&
            <Notification 
            color='success'
            onClose={() => closeNotification(notificationStack[0])} 
            data={notificationStack[0]} 
            />
        }
        </>
    )
}