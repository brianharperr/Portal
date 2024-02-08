import { useEffect, useState } from "react"
import { axiosWithCredentials } from "../configs/axios";
import { useMatch, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMessages } from "../redux/features/message.slice";
import WebNotificationHandler from "./WebNotificationHandler";

export default function ProtectedRoute({ children, alternate, portalFetch = true }){

    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMessagesRoute = useMatch('/inbox')
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        title: "",
        color: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right'},
        id: null
    })

    useEffect(() => {

        axiosWithCredentials.get('/auth/portal')
        .then(res => {
            localStorage.setItem('Name', res.data.name);
            localStorage.setItem('Role', res.data.role);
            setAuth(true);
            setUser(res.data);

        })
        .catch(err => {
            window.location.href = "/login";
            localStorage.clear();
        });

    }, []);
    
    useEffect(() => {
        if(user){
            var api = import.meta.env.VITE_REACT_APP_API_URL;
            const eventSource = new EventSource(`${api}/events/${user.sub}`, { withCredentials: true});
            // Event listener for incoming messages
            eventSource.onmessage = (e) => {
                const data = JSON.parse(e.data);
                if(isMessagesRoute){
                    var payload = {
                        offset: 0,
                        limit: null,
                      }
                    dispatch(fetchMessages(payload));
                }
                setNotification({
                    ...notification, 
                    open: true,
                    message: data.Subject,
                    title: data.Sender,
                    id: data.ID
                })
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
        }
    }, [user])
    return (
        <>
        {auth ?
        <>
        <WebNotificationHandler user={user}/>
        {children}
        </>
        :
        alternate}
        </>
    )
}