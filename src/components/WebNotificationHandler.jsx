import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchMessages } from "../redux/features/message.slice";
import Notification from "./Notification";

export default function WebNotificationHandler({ user })
{
    const location = useLocation();
    const dispatch = useDispatch();
    const [notificationStack, setNotificationStack] = useState([]);

    function pageSpecificBehavior()
    {

        switch(location.pathname){
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

    //Listen for SSE
    useEffect(() => {

        var api = import.meta.env.VITE_API_URL;
        const eventSource = new EventSource(`${api}/events/${user.sub}`, { withCredentials: true});
        // Event listener for incoming messages
        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setNotificationStack(prev => [...prev, data]);
            pageSpecificBehavior();
        }

        // Handle SSE connection errors
        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        // Clean up the SSE connection when the component unmounts
        return () => {
            eventSource.close();
        };

    }, [])

    return (
        <>
        {notificationStack.length > 0 &&
            <Notification 
            onClose={() => closeNotification(notificationStack[0])} 
            data={notificationStack[0]} 
            />
        }
        </>
    )
}