import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import PageBuilder from "../components/PageBuilder";
import { axiosWithCredentials } from "../configs/axios";
import { getPortal } from "../redux/features/portal.slice";
import { useParams } from "react-router-dom";
import { Avatar, Button, Radio, DatePicker, Descriptions, InputNumber, Menu, Select, TimePicker, Typography } from "antd";
const { Title, Paragraph } = Typography;
import { MessageOutlined, OrderedListOutlined, EditOutlined, SolutionOutlined, TagsOutlined, FileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function Case()
{
    const { id } = useParams();
    const portal = useSelector(getPortal);

    const [saved, setSaved] = useState(null);
    const [data, setData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showMessages, setShowMessages] = useState(false);
    const [page, setPage] = useState('profile');

    const [dateOfDeathEdit, setDateOfDeathEdit] = useState(false);
    const [dateCreatedEdit, setDateCreatedEdit] = useState(false);
    const menuItems = [
        {
            label: 'Profile',
            key: 'profile',
            icon: <SolutionOutlined />
        },
        {
            label: 'Tasks',
            key: 'tasks',
            icon: <OrderedListOutlined />
        },
        {
            label: 'Messages',
            key: 'messages',
            icon: <MessageOutlined/>
        }
    ]

    const patientItems = [
        {
            label: 'First Name',
            children: <Paragraph className="!mb-0" editable>{data?.Patient.FirstName}</Paragraph>
        },
        {
            label: 'Last Name',
            children: <Paragraph className="!mb-0" editable={{ onChange: (e) => setData({...data, Patient: {...data.Patient, LastName: e}})}}>{data?.Patient.LastName}</Paragraph>
        },
        {
            label: 'Sex',
            children: <Select onChange={e => setData({...data, Patient: {...data.Patient, Sex: e}})} className="!-mt-1" bordered={false} value={data?.Patient.Sex} options={[{value: 'M', label: 'Male'}, {value: 'F', label: 'Female'}]}/>
        },
        {
            label: 'Age',
            children: <Paragraph className="!mb-0" editable={{ onChange: (e) => setData({...data, Patient: {...data.Patient, Age: e}})}}>{data?.Patient.Age}</Paragraph>
        },
        {
            label: 'Residence',
            children: <Paragraph className="!mb-0" editable={{ onChange: (e) => setData({...data, Patient: {...data.Patient, Residence: e}})}}>{data?.Patient.Residence}</Paragraph>
        },
        {
            label: '',
            children: null
        },
        {
            label: 'Date of Death',
            children: (
                <>
                {dateOfDeathEdit ?
                <DatePicker value={dayjs(data?.Patient.DateOfDeath)} onChange={(e,str) => {
                    if(str){
                    setData({...data, Patient: {...data.Patient, DateOfDeath: new Date(str).toISOString()}});
                    setDateOfDeathEdit(false)
                    }
                }}
                />
                :
                <>
                {new Date(data?.Patient.DateOfDeath).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}<EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateOfDeathEdit(true)} />
                </>
                }
                </>
            )
        },
        {
            label: 'Cause of Death',
            children: <Paragraph className="!mb-0" editable={{ onChange: (e) => setData({...data, Patient: {...data.Patient, CauseOfDeath: e}})}}>{data?.Patient.CauseOfDeath}</Paragraph>
        },
        {
            label: 'Case Created',
            children: (
                <>
                {dateCreatedEdit ?
                <DatePicker value={dayjs(data?.DateCreated)} onChange={(e,str) => {
                    if(str){
                    setData({...data, DateCreated: new Date(str).toISOString()});
                    setDateOfDeathEdit(false)
                    }
                }}
                />
                :
                <>
                {new Date(data?.DateCreated).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}<EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateCreatedEdit(true)} />
                </>
                }
                </>
            )
        },
        {
            label: 'Case Status',
            children: (
                <Radio.Group value={data?.Status} onChange={e => setData({...data, Status: e.target.value})}>
                    <Radio.Button value="Active">Active</Radio.Button>
                    <Radio.Button value="Complete">Complete</Radio.Button>
                </Radio.Group>
            )
        }
    ]

    const contactItems = [
        {
            label: 'Name',
            children: data?.Contact.Name
        },        {
            label: 'Relation',
            children: data?.Contact.Relation
        },
        {
            label: 'Phone Number',
            children: data?.Contact.PhoneNumber
        },
        {
            label: 'Email',
            children: data?.Contact.Email
        },
    ]
    //Fetch Messages with Case Reference
    useEffect(() => {
        if(data){
            var payload = {
                id: data.DisplayID,
                portal: portal.ID
            }
            axiosWithCredentials.get('/message/case', { params: payload })
            .then(res => setMessages(res.data));
        }
    }, [data])
    
    useEffect(() => {
        if(portal){
            var payload = {
                portal: portal.ID,
                id: id
            }
            axiosWithCredentials.get('/case', { params: payload })
            .then(res => {
                setSaved(res.data);
                setData(res.data);
            });
        }
    }, [portal])

    return (
        <PageBuilder>
            <Menu 
            items={menuItems}
            mode="horizontal"
            style={{
                background: 'rgba(0,0,0,0)'
            }}
            selectedKeys={[page]}
            onClick={(e) => setPage(e.key)}
            />
            {page === 'profile' &&
            <>
            <div className="bg-white p-4 shadow mt-1">
            <Descriptions 
            column={{
                xs: 1,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
            }}
            title={"Patient"}
            items={patientItems}
            />
            <Descriptions 
            column={{
                xs: 1,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
            }}
            title={"Contact"}
            items={contactItems}
            />
            </div>
            <Button icon={<TagsOutlined />}>Download Tags</Button>
            <Button icon={<FileOutlined />}>Download Report</Button>
            <Button danger>Delete Case</Button>
            </>
            }
        </PageBuilder>
    )
}