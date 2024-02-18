import { useEffect, useState } from "react"
import { axiosWithCredentials } from "../configs/axios";
import { useMatch, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMessages } from "../redux/features/message.slice";
import WebNotificationHandler from "./WebNotificationHandler";
import axios from "axios";

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