import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageBuilder from "../components/PageBuilder";
import { axiosWithCredentials } from "../configs/axios";
import { getPortal } from "../redux/features/portal.slice";
import { useParams, useSearchParams } from "react-router-dom";
import { Avatar, Modal, Button, notification, Radio, DatePicker, Descriptions, InputNumber, Menu, Select, TimePicker, Typography, Spin, Divider, Popconfirm, List, Collapse, Form, Space, Input } from "antd";
const { Title, Paragraph } = Typography;
import { MessageOutlined, QuestionCircleOutlined, CheckOutlined, LoadingOutlined, OrderedListOutlined, EditOutlined, SolutionOutlined, TagsOutlined, FileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc  from 'dayjs/plugin/utc';
import { deleteCase, downloadReport, downloadTags } from "../redux/features/case.slice";
import { fetchCase, getCase, updateContact, updatePatient, updateCase } from "../redux/features/casetwo.slice";
import DynamicField from "../components/DynamicField";
dayjs.extend(utc)

const relations = [
    { key: '', value: '', label: ''},
    { key: 'Son', value: 'Son', label: 'Son'},
    { key: 'Father', value: 'Father', label: 'Father'},
    { key: 'Mother', value: 'Mother', label: 'Mother'},
    { key: 'Grandfather', value: 'Grandfather', label: 'Grandfather'},
    { key: 'Grandmother', value: 'Grandmother', label: 'Grandmother'},
    { key: 'Aunt', value: 'Aunt', label: 'Aunt'},
    { key: 'Uncle', value: 'Uncle', label: 'Uncle'},
    { key: 'Cousin', value: 'Cousin', label: 'Cousin'},
    { key: 'Friend', value: 'Friend', label: 'Friend'},
    { key: 'Other', value: 'Other', label: 'Other'},
]

export default function Case()
{
    const { id } = useParams();
    const portal = useSelector(getPortal);
    const dispatch = useDispatch();
    const selectedCase = useSelector(getCase);
    const [api, contextHolder] = notification.useNotification();
    const [messages, setMessages] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState('profile');
    const [options, setOptions] = useState({
        Homes: [],
        Services: [],
        Users: []
    });
    const [loading, setLoading] = useState(true);

    const [deleteCaseLoading, setDeleteCaseLoading] = useState(false);
    const [dateOfDeathEdit, setDateOfDeathEdit] = useState(false);
    const [dateCreatedEdit, setDateCreatedEdit] = useState(false);
    const [dateCompletedEdit, setDateCompletedEdit] = useState(false);

    const [serviceChangeConfirm, setServiceChangeConfirm] = useState({
        visible: false,
        newService: null
    })

    const [fieldLoading, setFieldLoading] = useState({
        FirstName: false,
        MiddleName: false,
        LastName: false,
        Age: false,
        Sex: false,
        Residence: false,
        CauseOfDeath: false,
        DateCompleted: false,
        DateCreated: false,
        DateOfDeath: false,
        Status: false,
        Name: false,
        Relation: false,
        PhoneNumber: false,
        Email: false,
        Director: false,
        Service: false,
        Home: false,
        PreArranged: false
    })

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
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => handleUpdatePatient('first-name', 'FirstName', e)}}>{selectedCase?.Patient.FirstName}</Paragraph>{fieldLoading.FirstName && <LoadingOutlined/>}</>
        },
        {
            label: 'Last Name',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => handleUpdatePatient('last-name', 'LastName', e)}}>{selectedCase?.Patient.LastName}</Paragraph>{fieldLoading.LastName && <LoadingOutlined/>}</>
        },
        {
            label: 'Sex',
            children: <><Select popupMatchSelectWidth={false} onChange={e => handleUpdatePatient('sex', 'Sex', e)} className="!-mt-1" bordered={false} value={selectedCase?.Patient.Sex} options={[{value: 'M', label: 'Male'}, {value: 'F', label: 'Female'}]}/>{fieldLoading.Sex && <LoadingOutlined/>}</>
        },
        {
            label: 'Age',
            children: <><Paragraph className="!mb-0" editable={{ onChange: (e) => handleUpdatePatient('age', 'Age', e)}}>{selectedCase?.Patient.Age}</Paragraph>{fieldLoading.Age && <LoadingOutlined/>}</>
        },
        {
            label: 'Residence',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => handleUpdatePatient('residence', 'Residence', e)}}>{selectedCase?.Patient.Residence}</Paragraph>{fieldLoading.Residence && <LoadingOutlined/>}</>
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
                <DatePicker format="MM/DD/YYYY" size="small" onOpenChange={e => !e && setDateOfDeathEdit(false)} value={selectedCase?.Patient.DateOfDeath ? dayjs(selectedCase?.Patient.DateOfDeath): ""} onChange={e => handleUpdatePatient('date-of-death', 'DateOfDeath', e.utc().format(), () => setDateOfDeathEdit(false))}/>
                :
                <>
                {
                selectedCase?.Patient.DateOfDeath && new Date(selectedCase?.Patient.DateOfDeath).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}
                <EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateOfDeathEdit(true)} />
                </>
                }
                {fieldLoading.DateOfDeath && <LoadingOutlined/>}
                </>
            )
        },
        {
            label: 'Cause of Death',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 64, onChange: (e) => handleUpdatePatient('cause-of-death', 'CauseOfDeath', e)}}>{selectedCase?.Patient.CauseOfDeath}</Paragraph>{fieldLoading.CauseOfDeath && <LoadingOutlined/>}</>
        }
    ]

    const processingItems = [
        {
            label: 'Service',
            children: <>
            <Select popupMatchSelectWidth={false} onChange={e => {if(e !== selectedCase.Service.ID){ setServiceChangeConfirm({ visible: true, newService: e } )}}} className="!-mt-1" bordered={false} value={selectedCase?.Service.ID} options={options?.Services}/>
            {fieldLoading.Service && <LoadingOutlined/>}
            </>
        },
        {
            label: 'Home',
            children: <><Select popupMatchSelectWidth={false} onChange={e => handleUpdateCase('home', 'Home', e)} className="!-mt-1" bordered={false} value={selectedCase?.Home.ID} options={options?.Homes}/>{fieldLoading.Home && <LoadingOutlined/>}</>
        },
        {
            label: 'Director',
            children: <><Select popupMatchSelectWidth={false} onChange={e => handleUpdateCase('director', 'Director', e)} className="!-mt-1" bordered={false} value={selectedCase?.User.ID} options={options?.Users}/>{fieldLoading.Director && <LoadingOutlined/>}</>
        },
        {
            label: 'Pre-Arranged',
            children: <><Radio.Group onChange={e => handleUpdateCase('prearranged', 'PreArranged', e.target.value)} value={selectedCase?.PreArranged}><Radio value={1}>Yes</Radio><Radio value={0}>No</Radio></Radio.Group>{fieldLoading.PreArranged && <LoadingOutlined/>}</>
        },
        {
            label: 'Case Created',
            children: (
                <>
                {dateCreatedEdit ?
                <DatePicker format="MM/DD/YYYY" size="small" onOpenChange={e => !e && setDateCreatedEdit(false)} value={selectedCase?.DateCreated ? dayjs(selectedCase?.DateCreated): ""} onChange={e => handleUpdateCase('date-created', 'DateCreated', e.utc().format(), () => setDateCompletedEdit(false))}/>
                :
                <>
                {
                selectedCase?.DateCreated && new Date(selectedCase?.DateCreated).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}
                <EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateCreatedEdit(true)} />
                </>
                }
                {fieldLoading.DateCreated && <LoadingOutlined/>}
                </>
            )
        },
        {
            label: 'Case Completed',
            children: (
                <>
                {dateCompletedEdit ?
                <DatePicker format="MM/DD/YYYY" size="small" onOpenChange={e => !e && setDateCompletedEdit(false)} value={selectedCase?.DateCompleted ? dayjs(selectedCase?.DateCompleted): ""} onChange={e => handleUpdateCase('date-completed', 'DateCompleted', e.utc().format(), () => setDateCompletedEdit(false))}/>
                :
                <>
                {selectedCase?.DateCompleted && new Date(selectedCase?.DateCompleted).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}
                {selectedCase?.Status === "Complete" && <EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateCompletedEdit(true)} />}
                </>
                }
                {fieldLoading.DateCompleted && <LoadingOutlined/>}
                </>
            )
        },
        {
            label: 'Case Status',
            children: (
                <>
                <Radio.Group size="small" value={selectedCase?.Status} onChange={e => handleUpdateCase("status", "Status", e.target.value)}>
                    <Radio.Button value="Active">Active</Radio.Button>
                    <Radio.Button value="Complete">Complete</Radio.Button>
                </Radio.Group>
                {fieldLoading.Status && <LoadingOutlined/>}
                </>
            )
        },
    ]
    const contactItems = [
        {
            label: 'Name',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => handleUpdateContact('name','Name', e)}}>{selectedCase?.Contact.Name}</Paragraph>{fieldLoading.Name && <LoadingOutlined/>}</>
        },        {
            label: 'Relation',
            children: <>
            <Select 
            popupMatchSelectWidth={false} 
            onChange={e => handleUpdateContact('relation','Relation', e)} 
            className="!-mt-1 !min-w-[120px]" 
            bordered={false} 
            value={selectedCase?.Contact.Relation} 
            options={relations}/>
            {fieldLoading.Relation && <LoadingOutlined/>}
            </>
        },
        {
            label: 'Phone Number',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => handleUpdateContact('phone-number','PhoneNumber', e)}}>{selectedCase?.Contact.PhoneNumber}</Paragraph>{fieldLoading.PhoneNumber && <LoadingOutlined/>}</>
        },
        {
            label: 'Email',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => handleUpdateContact('email','Email', e)}}>{selectedCase?.Contact.Email}</Paragraph>{fieldLoading.Email && <LoadingOutlined/>}</>
        },
    ]
    function handleDeleteCase()
    {
        setDeleteCaseLoading(true);
        dispatch(deleteCase(selectedCase.ID)).unwrap()
        .then(() => window.location.href = "/")
        .finally(() => setDeleteCaseLoading(false));
    }

    function handleDownloadTags()
    {
        var payload = {
            ID: selectedCase.ID,
            Name: data.Patient.FirstName + " " + data.Patient.LastName,
        }
        dispatch(downloadTags(payload));
    }

    function handleDownloadReport()
    {
        var payload = {
            DisplayID: selectedCase.DisplayID,
            PortalID: portal.ID,
            Name: selectedCase?.Patient.FirstName + " " + selectedCase?.Patient.LastName,
        }
        dispatch(downloadReport(payload));
    }

    function handleUpdatePatient(method, name, value, onSuccess = () => {})
    {
        var payload = {
            ID: selectedCase.Patient.ID,
            Method: method
        };
        payload[name] = value;
        setFieldLoading({...fieldLoading, [name]: true });
        dispatch(updatePatient(payload)).unwrap()
        .then(() => onSuccess())
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setFieldLoading({...fieldLoading, [name]: false }));
    }

    function handleUpdateContact(method, name, value)
    {
        var payload = {
            ID: selectedCase.Contact.ID,
            Method: method
        };
        payload[name] = value;
        setFieldLoading({...fieldLoading, [name]: true });
        dispatch(updateContact(payload)).unwrap()
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setFieldLoading({...fieldLoading, [name]: false }));
    }

    function handleUpdateCase(method, name, value, onSuccess = () => {})
    {
        var payload = {
            ID: selectedCase.ID,
            Method: method
        };
        payload[name] = value;
        setFieldLoading({...fieldLoading, [name]: true });
        dispatch(updateCase(payload)).unwrap()
        .then(() => onSuccess())
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setFieldLoading({...fieldLoading, [name]: false }));
    }
    //Fetch Messages with Case Reference
    useEffect(() => {
        if(selectedCase.DisplayID && portal.ID){
            var payload = {
                id: selectedCase.DisplayID,
                portal: portal.ID
            }
            axiosWithCredentials.get('/message/case', { params: payload })
            .then(res => setMessages(res.data));
        }
    }, [selectedCase.DisplayID, portal])
    
    //Fetch Case and Select field options
    useEffect(() => {
        if(portal){
            var payload = {
                portal: portal.ID,
                id: id
            }
            dispatch(fetchCase(payload)).unwrap()
            .then(res => {
                // setData(res);
            }).finally(() => setLoading(false));

            axiosWithCredentials.post('/procedure/getHomesServicesEmployees')
            .then(res => {
                setOptions({
                    Homes: res.data.Homes.map(x => ({ key: x.ID, value: x.ID, label: x.Name})),
                    Services: res.data.Services.map(x => ({ key: x.ID, value: x.ID, label: x.Name})),
                    Users: res.data.Users.map(x => ({ key: x.ID, value: x.ID, label: x.FirstName + " " + x.LastName}))
                });
            })
        }
    }, [portal])

    //Set page according to url
    useEffect(() => {
        var urlPage = searchParams.get('page');
        if(urlPage === 'profile' || urlPage === 'tasks' || urlPage === 'messages'){
            setPage(urlPage);
        }
    }, []);

    return (
        <PageBuilder>
            {contextHolder}
            <Modal
            title="Are you sure you want to change the service?"
            open={serviceChangeConfirm.visible}
            onOk={() => handleUpdateCase('service', 'Service', serviceChangeConfirm.newService, () => setServiceChangeConfirm({ visible: false, newService: null}))}
            onCancel={() => setServiceChangeConfirm({ visible: false, newService: null})}
            >
                Changing the service will remove all saved task progress.
            </Modal>
            <Menu 
            items={menuItems}
            mode="horizontal"
            style={{
                background: 'rgba(0,0,0,0)'
            }}
            selectedKeys={[page]}
            onClick={(e) => {
                setPage(e.key);
                setSearchParams({ 'page': e.key})
            }}
            />
            {page === 'profile' &&
            <>
            <Spin spinning={loading} size="large" indicator={<LoadingOutlined/>}>
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
            <Descriptions 
            column={{
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1,
            }}
            title={"Processing"}
            items={processingItems}
            />
            </div>
            </Spin>
            <div className="w-[200px] mt-4">
            <Button onClick={handleDownloadTags} icon={<TagsOutlined />} block>Download Tags</Button>
            <Button onClick={handleDownloadReport} icon={<FileOutlined />} className="!mt-4" block>Download Report</Button>
            </div>
            <Divider/>
            <Popconfirm
            title="Delete this case"
            description="Are you sure to delete this case?"
            onConfirm={handleDeleteCase}
            okButtonProps={{
                loading: deleteCaseLoading,
            }}
            icon={
            <QuestionCircleOutlined
                style={{
                color: 'red',
                }}
            />
            }
            >
                <Button danger>Delete Case</Button>
            </Popconfirm>
            </>
            }
            {page === 'tasks'&&
            <>
            <Collapse
            className="mt-2"
            items={selectedCase?.Tasks.map((x, idx) => ({
                key: idx,
                expandIcon: <CheckOutlined/>,
                label: (
                    <>
                    <span className={`transition-all duration-200 ${x.DateCompleted ? 'font-bold text-green-500' : null }`}>{x.Name} {x.DateCompleted && <CheckOutlined/>}</span>
                    </>
                ),
                children: (
                    <DynamicField data={x} employees={options.Users}/>
                )
            }))}
            />
            </>
            }
            {page === 'messages' &&
            <>
                <List
                itemLayout="vertical"
                size="small"
                dataSource={messages}
                locale={{emptyText: "No messages"}}
                renderItem={(item) => (
                    <List.Item
                    actions={[new Date(item.DateCreated).toLocaleString()]}
                    >
                        <List.Item.Meta
                        title={item.Subject}
                        description={"From: " + item.SenderName}
                        />
                        {item.Body}
                    </List.Item>
                )}
                >

                </List>
            </>
            }
        </PageBuilder>
    )
}