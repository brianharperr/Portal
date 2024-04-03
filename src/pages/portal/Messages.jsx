import { Button, FloatButton, Form, Input, Menu, Popconfirm, Select, Tooltip } from "antd";
import { useState } from "react";
import PageBuilder from "../components/PageBuilder";
import Inbox from "../../components/Inbox";
import {
    InboxOutlined,
    SendOutlined,
    MailOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { axiosWithCredentials } from "../../configs/axios";
import { useEffect } from "react";
import MessageModal from "../components/MessageModal";
import Sent from "../../components/Sent";
const { TextArea } = Input;
export default function Messages()
{
    const [page, setPage] = useState("inbox");
    const [message, setMessage] = useState(null);
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState([]);
    const [ccOptions, setCCOptions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [to, setTo] = useState([]);
    const [cc, setCc] = useState([]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [caseRef, setCaseRef] = useState([]);
    const [toError, setToError] = useState(false);
    const [subjectError, setSubjectError] = useState(false);

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

    function sendMessage()
    {
        if(to.length <= 0){
            setToError(true);
        }else{
            setToError(false);
        }
        if(!subject){
            setSubjectError(true);
        }else{
            setSubjectError(false);
        }

        if(toError || subjectError){
            return;
        }
        
        var payload = {
            CaseReference: caseRef,
            To: to,
            Cc: cc,
            Subject: subject,
            Body: body,

        }
        axiosWithCredentials.post('/message', payload)
        .then(() => {
            setMessage({
                Subject: "",
                Body: "",
                CaseReference: [],
                To: [],
                Cc: []
            });
            setPage('inbox');
            setMessage(null);
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
            ]);
        })
    }
    function renderMenuItem(){
        switch(page){
            case 'inbox':
                return <Inbox select={(data) => setSelected(data.ID)}/>
            case 'sent':
                return <Sent select={(data) => setSelected(data.ID)}/>
            case 'message':
                return (
                    <div className="bg-white p-4 shadow mt-4">
                    <Form>
                        <div className="flex justify-between mb-4">
                            <Button type="primary" icon={<SendOutlined />} onClick={sendMessage}>Send</Button>
                            <Popconfirm
                            title="Delete the draft"
                            description="Are you sure you want to discard this message?"
                            onConfirm={handleDiscard}
                            okText="Yes"
                            cancelText="No"
                            >
                                <Button icon={<DeleteOutlined/>}></Button>
                            </Popconfirm>
                        </div>
                        <Form.Item required validateStatus={toError ? "error" : null} label="To">
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
                        
                        <Form.Item validateStatus={subjectError ? "error" : null} required label="Subject">
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
            {!message && <FloatButton shape="circle" icon={<MailOutlined/>} type="primary" tooltip="New message" onClick={newMessage}/>}
            <MessageModal id={selected} open={selected} close={() => setSelected(null)}/>
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