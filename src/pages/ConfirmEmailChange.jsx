import { Result, Button } from "antd"
import { useEffect, useState } from "react"
import { axiosWithoutCredentials } from "../configs/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmEmailChange()
{
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        var payload = {
            Token: searchParams.get('token')
        }
        axiosWithoutCredentials.patch('/user/portal/email', payload)
        .then((res) => {
            setEmail(res.data.Email);
            setStatus(1);
        })
        .catch(() => {
            setStatus(0);
        })
        .finally(() => {
            setLoading(false);
        })
    }, [])

    return (
        <>
        {loading ?
        <></>
        :
            <>
            {status === 1 ?
                    <Result
                    status="success"
                    title="Email Verified!"
                    subTitle={"Your email has been changed to " + email}
                    extra={[
                        <Button type="primary" onClick={() => navigate('/')}>
                          Go to Portal
                        </Button>
                      ]}
                />
            :
                <Result
                status="success"
                title="Email Verified!"
                subTitle="Your email has been changed to "
                extra={[
                    <b>{email}</b>,
                    <br/>,
                    <br/>,
                    <Button type="primary" key="console">
                    Go to Portal
                    </Button>
                ]}
                />
            }
            </>
        }
        </>
    )
}