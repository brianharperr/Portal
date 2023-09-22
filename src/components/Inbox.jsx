import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Badge, List, Pagination } from 'antd';
import { Link } from "react-router-dom";
import { fetchInbox, getInbox, getInboxCount } from '../redux/features/message.slice';
export default function Inbox()
{
    const messages = useSelector(getInbox);
    const count = useSelector(getInboxCount);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    
    useEffect(() => {
    var payload = {
        offset: (page-1) * 10
    }
      dispatch(fetchInbox(payload));
    }, [page]);

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                    title={<>{!item.Read && <Badge status="processing" text="Processing" />}{item.Subject}</>}
                    description={"From: " + item.SenderName}
                    />
                </List.Item>
                )}
            />
        </>
    )
}