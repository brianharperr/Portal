import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMessages } from "../redux/features/message.slice";
import Notification from "./Notification";
import { AblyProvider, useChannel, usePresence } from 'ably/react';
import { useSelector } from 'react-redux'
import { getUser } from "../redux/features/user.slice";

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

    const { channel } = useChannel('notifications', user.sub.toString() , (message) => {
        const data = JSON.parse(message.data);
        setNotificationStack(prev => [...prev, data]);
        pageSpecificBehavior();
    })

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