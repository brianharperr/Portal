import { Divider, Form, Input, Modal, Select, Skeleton, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import States from "../data/States";
import { axiosWithCredentials } from "../configs/axios";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';
export default function MessageModal({ open, id, close })
{
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        setData(null);
        if(id){
            setLoading(true);
            var payload = {
                id: id
            }
            axiosWithCredentials.get('/message', { params: payload })
            .then((res) => {
                if(res.data){
                    setData(res.data);
                    var payload = {
                        ID: res.data.ID
                    }

                    axiosWithCredentials.put('/message/read', payload)
                }
            })
            .finally(() => setLoading(false));
        }
    }, [id])

    return (
        <Modal cancelText="Close" okText="Reply" title={data? data?.Subject : <Skeleton.Button active/>} open={open} onCancel={close}>
            From: <Tag bordered={false}>{data?.Sender}</Tag>
            <br/>
            To: 
            {data?.To.map(x => {
                return <Tag bordered={false}>{x.Name}</Tag>
            })}
            <br/>
            {data?.Cc.length > 0 &&
            <>
            Cc: 
            {data?.Cc.map(x => {
                return <Tag bordered={false}>{x.Name}</Tag>
            })}
            </>
            }
            <div className=" mt-2 text-xs italic">
            {data?.DateCreated ? new Date(data?.DateCreated).toLocaleString(): <Skeleton.Button active/>}
            </div>
            <Divider/>
            {data?.CaseRef.map(x => {
                return <Tag color="gold" className="hover:cursor-pointer hover:bg-yellow-300" onClick={() => navigate('/case/' + x.DisplayID)}>{"#" + x.DisplayID} - {x.Name}</Tag>
            })}
            {data?.CaseRef.length > 0 && <br/>}
            {data?.Body ? data.Body : <Skeleton active/>}
            
        </Modal>
    )
}