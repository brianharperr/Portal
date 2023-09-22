import { Menu } from "antd";
import { useState } from "react";
import PageBuilder from "../components/PageBuilder";
import Inbox from "../components/Inbox";
import {
    InboxOutlined,
    SendOutlined
} from '@ant-design/icons';
export default function Messages()
{
    const [page, setPage] = useState("inbox");

    const menuItems = [
        {
            label: 'Inbox',
            key: 'inbox',
            icon: <InboxOutlined/>
        },
        {
            label: 'Sent',
            key: 'sent',
            icon: <SendOutlined/>
        }
    ]

    function renderMenuItem(){
        switch(page){
            case 'inbox':
                return <Inbox/>
            case 'sent':
                return <Sent/>
        }
    }

    return (
        <PageBuilder name='messages'>
            <Menu
            mode="horizontal"
            items={menuItems}
            style={{
                background: 'rgba(0,0,0,0)'
            }}
            selectedKeys={[page]}
            onClick={(e) => setPage(e.key)}
            />
            {renderMenuItem()}
        </PageBuilder>
    )
}