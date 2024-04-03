import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { axiosWithAdminCredentials } from "../configs/axios";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortals, getPortals } from "../redux/features/portal.slice";
export default function ProtectedRoute({ children, alternate, portalFetch = true }){

    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const portals = useSelector(getPortals);
    const dispatch = useDispatch();

    useEffect(() => {

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
        .catch(res => navigate('/'))
        .finally(() =>setIsLoading(false));

    }, []);

    return auth ? children : alternate
}