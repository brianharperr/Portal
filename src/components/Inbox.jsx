import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Avatar, Badge, List, Pagination, Skeleton } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { fetchMessages, getMessages, getMessageCount } from '../redux/features/message.slice';
export default function Inbox({ select })
{
    const messages = useSelector(getMessages);
    const count = useSelector(getMessageCount);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [read, setRead] = useState([]);
    const [messagesPerPage, setMessagesPerPage] = useState(localStorage.getItem('inbox-results') || 25);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoading(true);
        var payload = {
            offset: (page-1) * messagesPerPage,
            limit: messagesPerPage,
        }
        dispatch(fetchMessages(payload)).unwrap()
        .finally(() => setLoading(false));
    }, [page, messagesPerPage]);

    return (
        <>
        {!loading ?
            <>
            <List
                locale={{ emptyText: "No messages" }}
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={(item, index) => (
                <List.Item onClick={() => {select(item); setRead([...read, item.ID])}} className="hover:bg-gray-200 !rounded !px-4 transition-all duration-100 hover:cursor-pointer">
                    <List.Item.Meta
                    title={<>{!item.Read && !read.includes(item.ID) && <Badge status="processing" text=" "/>}{item.Subject}</>}
                    description={"From: " + item.SenderName}
                    avatar={<Avatar size={40}>{item.SenderName.split(" ")[0]}</Avatar>}
                    />
                </List.Item>
                )}
            />
            {count > 0 &&
            <Pagination onChange={(page, pageSize) => {
                setMessagesPerPage(pageSize);
                localStorage.setItem('inbox-results', pageSize);
                setPage(page);
              }} 
              showSizeChanger 
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} 
              defaultCurrent={1} 
              total={count} 
              defaultPageSize={messagesPerPage}
              current={page}
              />
            }
            </>
            :
            <List>
                <List.Item>
                    <Skeleton active avatar/>
                </List.Item>
                <List.Item>
                    <Skeleton active avatar/>
                </List.Item>
                <List.Item>
                    <Skeleton active avatar/>
                </List.Item>
                <List.Item>
                    <Skeleton active avatar/>
                </List.Item>
            </List>
        }
        </>
    )
}