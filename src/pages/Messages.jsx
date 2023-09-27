import { Button, Form, Input, Menu, Select, Tooltip } from "antd";
import { useState } from "react";
import PageBuilder from "../components/PageBuilder";
import Inbox from "../components/Inbox";
import {
    InboxOutlined,
    SendOutlined,
    MailOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { axiosWithCredentials } from "../configs/axios";
import { useEffect } from "react";
const { TextArea } = Input;
export default function Messages()
{
    const [page, setPage] = useState("inbox");
    const [message, setMessage] = useState(null);
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState([]);
    const [ccOptions, setCCOptions] = useState([]);

    const [to, setTo] = useState([]);
    const [cc, setCc] = useState([]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [caseRef, setCaseRef] = useState([]);

    const [menuItems, setMenuItems] = useState([
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
    ]);

    function handleDiscard()
    {
        setPage('inbox');
        setMenuItems([
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
        ])
        setMessage(null);
    }
    function newMessage()
    {
        setMessage({
            Subject: "",
            Body: "",
            CaseReference: [],
            To: [],
            Cc: []
        });
        setMenuItems([
            {
                label: 'Inbox',
                key: 'inbox',
                icon: <InboxOutlined/>
            },
            {
                label: 'Sent',
                key: 'sent',
                icon: <SendOutlined/>
            },
            {
                label: 'Message',
                key: 'message',
                icon: <MailOutlined/>
            }
        ])
        setPage('message');
    }

    function renderMenuItem(){
        switch(page){
            case 'inbox':
                return <Inbox/>
            case 'sent':
                return <Sent/>
            case 'message':
                return (
                    <div className="bg-white p-4 shadow mt-4">
                    <Form>
                        <div className="flex justify-between mb-4">
                            <Button type="primary" icon={<SendOutlined />}>Send</Button>
                            <Tooltip title="Discard"><Button onClick={handleDiscard} icon={<DeleteOutlined/>}></Button></Tooltip>
                        </div>
                        <Form.Item label="To">
                            <Select mode="multiple" options={users} onChange={e => setTo(e)}/>
                        </Form.Item>
                        <Form.Item label="Cc">
                            <Select mode="multiple" options={ccOptions} onChange={e => setCc(e)}/>
                        </Form.Item>
                        <Form.Item label="Case Reference">
                            <Select mode="multiple" options={cases} onChange={e => setCaseRef(e)}/>
                        </Form.Item>
                    </Form>
                    <Form layout="vertical">
                        
                        <Form.Item label="Subject">
                            <Input size="large" onChange={e => setSubject(e.target.value)}/>
                        </Form.Item>
                        <Form.Item label="Body">
                            <TextArea showCount maxLength={2500} rows={8} onChange={e => setBody(e.target.value)}/>
                        </Form.Item>
                    </Form>
                    </div>
                )
        }
    }

    useEffect(() => {
        if(to){
            setCCOptions(users.filter(x => {
                return to.indexOf(x.value) < 0;
            }))
        }
    }, [to])

    useEffect(() => {
        axiosWithCredentials.get('/search/users')
        .then(res => {
            if(res.data.length > 0){
                setUsers(res.data.map(x => ({ label: x.Name, value: x.ID })));
                setCCOptions(res.data.map(x => ({ label: x.Name, value: x.ID })));
            }
        })
        .catch(err => {

        });
        axiosWithCredentials.get('/search/cases')
        .then(res => {
            if(res.data.length > 0){
                setCases(res.data.map(x => ({ label: "#" + x.DisplayID + " - " + x.PatientName + " (" + new Date(x.DateCreated).toLocaleDateString() + ")", value: x.ID })))
            }
        })
        .catch(err => {

        }) 
    }, [])

    return (
        <PageBuilder name='messages'>
            <div className="py-2">
                {!message && <Button type="primary" icon={<MailOutlined/>} onClick={newMessage}>New Message</Button>}
            </div>
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