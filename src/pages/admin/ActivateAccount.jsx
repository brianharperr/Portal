import { useState, useEffect } from "react";
import { axiosWithAdminCredentials } from "../../configs/axios";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

export default function ActivateAccount() {

    const { token } = useParams();
    const [result, setResult] = useState();
    const [redirectDst, setRedirectDst] = useState();
    const location = useLocation();
    
    function renderOutput(){
        if(!result){
            return ""
        }
        switch(result){
            case "INV_EMAILREG_TOKEN":
                return "Activation link has expired or is invalid."
            case "USER_FOUND":
                return "Account at this email already exists."
            default:
                return "Internal Server Error."
        }
    }

    useEffect(() => {
        axiosWithAdminCredentials.get('auth/activate/' + token)
        .then(res => {
            if(res.data.code === "USER_CREATED"){
                setRedirectDst({path: '/login?verify=true', state: location.pathname})
            }
        })
        .catch(err => {
            setResult(err.response.data.code);
        })
    }, [location, token]);

    if(redirectDst){
        return <Navigate to={redirectDst.path} state={redirectDst.state}/>
    }

    return(
        <div className="flex flex-col justify-center items-center mt-20">
            <Link to={'/'} className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-3xl md:tracking-tight font-oxanium">
                    <span className='text-flgreen'>Family</span><span>Lynk</span>
            </Link>
        {(result) ? "": <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}/>}
        <h1 className="font-light">{renderOutput()}</h1>
        </div>
    )
};