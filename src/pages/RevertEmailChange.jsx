import { Result, Button } from "antd"
import { useEffect, useState } from "react"
import { axiosWithoutCredentials } from "../configs/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function RevertEmailChange()
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
        axiosWithoutCredentials.patch('/user/portal/revert-email', payload)
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
                    title="Email has been reverted!"
                    subTitle={"Your email has been kept as " + email + ". Consider changing your password if the change request was not made by you."}
                    extra={[
                        <Button type="primary" onClick={() => navigate('/')}>
                          Go to Portal
                        </Button>
                      ]}
                />
            :
                <Result
                status="error"
                title="Link is invalid or expired"
                extra={[
                    <b>{email}</b>,
                    <br/>,
                    <br/>,
                    <Button type="primary" onClick={() => navigate('/')}>
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