import { useEffect, useState } from "react"
import { axiosWithCredentials, axiosWithAdminCredentials } from "../configs/axios";
import { useMatch, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import WebNotificationHandler from "./WebNotificationHandler";
import { fetchPortals } from "../redux/features/admin.portal.slice";


export default function ProtectedRoute({ children, admin = false, portalFetch = true, alternate}){

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
        var authString = admin ? '/auth' : '/auth/portal';
        console.log("admin: ", admin);
        if(admin){
            axiosWithAdminCredentials.get('/auth', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            })
            .then(res => {
                setAuth(true);
                if(portalFetch){
                    dispatch(fetchPortals());
                }
            })
            .catch(res => navigate('/'));
        }else{
            axiosWithCredentials.get(authString)
            .then(res => {
                localStorage.setItem('Name', res.data.name);
                localStorage.setItem('Role', res.data.role);
                setAuth(true);
                setUser(res.data);
    
            })
            .catch(err => {
                localStorage.clear();
            });
        }

    }, []);

    return (
        <>
        {auth ?
        <>
        {/* <WebNotificationHandler user={user}/> */}
        {children}
        </>
        :
        alternate}
        </>
    )
}