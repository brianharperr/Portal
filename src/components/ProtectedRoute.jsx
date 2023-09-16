import { useEffect, useState } from "react"
import { axiosWithCredentials } from "../configs/axios";

export default function ProtectedRoute({ children, alternate, portalFetch = true }){

    const [auth, setAuth] = useState(false);

    useEffect(() => {

        axiosWithCredentials.get('/auth/portal')
        .then(res => {

            localStorage.setItem('Name', res.data.name);
            localStorage.setItem('Role', res.data.role);
            setAuth(true);
        })
        .catch(err => {
            window.location.href = "/login";
            localStorage.clear();
        });

    }, []);

    return auth ? children : alternate
}