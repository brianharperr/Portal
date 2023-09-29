import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageBuilder from "../components/PageBuilder";
import { axiosWithCredentials } from "../configs/axios";
import { getPortal } from "../redux/features/portal.slice";
import { useParams } from "react-router-dom";
import { Avatar, Modal, Button, notification, Radio, DatePicker, Descriptions, InputNumber, Menu, Select, TimePicker, Typography, Spin, Divider, Popconfirm, List, Collapse, Form } from "antd";
const { Title, Paragraph } = Typography;
import { MessageOutlined, QuestionCircleOutlined, LoadingOutlined, OrderedListOutlined, EditOutlined, SolutionOutlined, TagsOutlined, FileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc  from 'dayjs/plugin/utc';
import { deleteCase, downloadReport, downloadTags, updateCase } from "../redux/features/case.slice";
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
    const [api, contextHolder] = notification.useNotification();
    const [saved, setSaved] = useState(null);
    const [data, setData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showMessages, setShowMessages] = useState(false);
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
    const [firstNameLoading, setFirstNameLoading] = useState(false);
    const [lastNameLoading, setLastNameLoading] = useState(false);
    const [ageLoading, setAgeLoading] = useState(false);
    const [sexLoading, setSexLoading] = useState(false);
    const [residenceLoading, setResidenceLoading] = useState(false);
    const [causeOfDeathLoading, setCauseOfDeathLoading] = useState(false);
    const [dateCompletedLoading, setDateCompletedLoading] = useState(false);
    const [dateCreatedLoading, setDateCreatedLoading] = useState(false);
    const [dateOfDeathLoading, setDateOfDeathLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [contactNameLoading, setContactNameLoading] = useState(false);
    const [contactRelationLoading, setContactRelationLoading] = useState(false);
    const [contactPhoneNumberLoading, setContactPhoneNumberLoading] = useState(false);
    const [contactEmailLoading, setContactEmailLoading] = useState(false);
    const [directorLoading, setDirectorLoading] = useState(false);
    const [serviceLoading, setServiceLoading] = useState(false);
    const [homeLoading, setHomeLoading] = useState(false);
    const [preArrangedLoading, setPreArrangedLoading] = useState(false);

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
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => updatePatientFirstName(e)}}>{data?.Patient.FirstName}</Paragraph>{firstNameLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Last Name',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => updatePatientLastName(e)}}>{data?.Patient.LastName}</Paragraph>{lastNameLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Sex',
            children: <><Select popupMatchSelectWidth={false} onChange={e => updatePatientSex(e)} className="!-mt-1" bordered={false} value={data?.Patient.Sex} options={[{value: 'M', label: 'Male'}, {value: 'F', label: 'Female'}]}/>{sexLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Age',
            children: <><Paragraph className="!mb-0" editable={{ onChange: (e) => updatePatientAge(e)}}>{data?.Patient.Age}</Paragraph>{ageLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Residence',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => updatePatientResidence(e)}}>{data?.Patient.Residence}</Paragraph>{residenceLoading && <LoadingOutlined/>}</>
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
                <DatePicker autoFocus value={data?.Patient.DateOfDeath ? dayjs(data?.Patient.DateOfDeath): ""} onChange={(e,str) => {
                    if(str){
                        setData({...data, Patient: {...data.Patient, DateOfDeath: dayjs(str).utc().format()}});
                        updatePatientDateOfDeath(dayjs(str).utc().format());
                    }else{
                        setData({...data, Patient: {...data.Patient, DateOfDeath: ""}});
                        updatePatientDateOfDeath("");
                    }
                    setDateOfDeathEdit(false);
                }}
                />
                :
                <>
                {
                data?.Patient.DateOfDeath && new Date(data?.Patient.DateOfDeath).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}
                <EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateOfDeathEdit(true)} />
                {dateOfDeathLoading && <LoadingOutlined/>}
                </>
                }
                </>
            )
        },
        {
            label: 'Cause of Death',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 64, onChange: (e) => updatePatientCauseOfDeath(e)}}>{data?.Patient.CauseOfDeath}</Paragraph>{causeOfDeathLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Case Created',
            children: (
                <>
                {dateCreatedEdit ?
                <DatePicker autoFocus value={data?.DateCreated ? dayjs(data?.DateCreated): ""} onChange={(e,str) => {
                    if(str){
                        setData({...data, DateCreated: dayjs(str).utc().format()});
                        updateCaseCreated(dayjs(str).utc().format());
                    }else{
                        setData({...data, DateCreated: ""});
                        updateCaseCreated("");
                    }
                    setDateCreatedEdit(false);
                }}
                />
                :
                <>
                {
                data?.DateCreated && new Date(data?.DateCreated).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}
                <EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateCreatedEdit(true)} />
                {dateCreatedLoading && <LoadingOutlined/>}
                </>
                }
                </>
            )
        },
        {
            label: 'Case Completed',
            children: (
                <>
                {dateCompletedEdit ?
                <DatePicker autoFocus value={data?.DateCompleted ? dayjs(data?.DateCompleted): ""} onChange={(e,str) => {
                    if(str){
                        setData({...data, DateCompleted: dayjs(str).utc().format()});
                        updateCaseCompleted(dayjs(str).utc().format());
                    }else{
                        setData({...data, DateCompleted: ""});
                        updateCaseCompleted("");
                    }
                    setDateCompletedEdit(false);
                }}
                />
                :
                <>
                {
                data?.DateCompleted && new Date(data?.DateCompleted).toDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}
                {data?.Status === 'Complete' && <EditOutlined className="!text-[#1677ff] ml-1" onClick={() => setDateCompletedEdit(true)} />}
                {dateCompletedLoading && <LoadingOutlined/>}
                </>
                }
                </>
            )
        },
        {
            label: 'Case Status',
            children: (
                <>
                <Radio.Group value={data?.Status} onChange={e => {
                    updateCaseStatus(e)
                }}>
                    <Radio.Button value="Active">Active</Radio.Button>
                    <Radio.Button value="Complete">Complete</Radio.Button>
                </Radio.Group>
                {statusLoading && <LoadingOutlined/>}
                </>
            )
        },
    ]

    const processingItems = [
        {
            label: 'Service',
            children: <><Select popupMatchSelectWidth={false} onChange={e => {if(e !== data.ServiceID){ setServiceChangeConfirm({ visible: true, newService: e } )}}} className="!-mt-1" bordered={false} value={data?.ServiceID} options={options?.Services}/>{serviceLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Home',
            children: <><Select popupMatchSelectWidth={false} onChange={e => updateHome(e)} className="!-mt-1" bordered={false} value={data?.HomeID} options={options?.Homes}/>{homeLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Director',
            children: <><Select popupMatchSelectWidth={false} onChange={e => updateDirector(e)} className="!-mt-1" bordered={false} value={data?.UserID} options={options?.Users}/>{directorLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Pre-Arranged',
            children: <><Radio.Group onChange={e => updatePreArranged(e.target.value)} value={data?.PreArranged}><Radio value={1}>Yes</Radio><Radio value={0}>No</Radio></Radio.Group>{preArrangedLoading && <LoadingOutlined/>}</>
        }
    ]
    const contactItems = [
        {
            label: 'Name',
            children: <><Paragraph editable={{ maxLength: 45, onChange: (e) => updateContactName(e)}}>{data?.Contact.Name}</Paragraph>{contactNameLoading && <LoadingOutlined/>}</>
        },        {
            label: 'Relation',
            children: <><Select popupMatchSelectWidth={false} onChange={e => updateContactRelation(e)} className="!-mt-1 !min-w-[120px]" bordered={false} value={data?.Contact.Relation} options={relations}/>{contactRelationLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Phone Number',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => updateContactPhoneNumber(e)}}>{data?.Contact.PhoneNumber}</Paragraph>{contactPhoneNumberLoading && <LoadingOutlined/>}</>
        },
        {
            label: 'Email',
            children: <><Paragraph className="!mb-0" editable={{ maxLength: 45, onChange: (e) => updateContactEmail(e)}}>{data?.Contact.Email}</Paragraph>{contactEmailLoading && <LoadingOutlined/>}</>
        },
    ]

    function handleDeleteCase()
    {
        setDeleteCaseLoading(true);
        dispatch(deleteCase(saved.ID)).unwrap()
        .then(() => window.location.href = "/")
        .finally(() => setDeleteCaseLoading(false));
    }

    function handleDownloadTags()
    {
        var payload = {
            ID: saved.ID,
            Name: data.Patient.FirstName + " " + data.Patient.LastName,
        }
        dispatch(downloadTags(payload));
    }

    function handleDownloadReport()
    {
        var payload = {
            DisplayID: saved.DisplayID,
            PortalID: portal.ID,
            Name: data?.Patient.FirstName + " " + data?.Patient.LastName,
        }
        dispatch(downloadReport(payload));
    }

    function updatePatientFirstName(value)
    {
        setFirstNameLoading(true);
        var payload = {
            Method: "/patient/first-name",
            ID: saved.Patient.ID,
            FirstName: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Patient: {...data.Patient, FirstName: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setFirstNameLoading(false));
    }

    function updatePatientLastName(value)
    {
        setLastNameLoading(true);
        var payload = {
            Method: "/patient/last-name",
            ID: saved.Patient.ID,
            LastName: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Patient: {...data.Patient, LastName: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setLastNameLoading(false));
    }

    function updatePatientSex(value)
    {
        setSexLoading(true);
        var payload = {
            Method: "/patient/sex",
            ID: saved.Patient.ID,
            Sex: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Patient: {...data.Patient, Sex: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setSexLoading(false));
    }

    function updatePatientAge(value)
    {
        setAgeLoading(true);
        var payload = {
            Method: "/patient/age",
            ID: saved.Patient.ID,
            Age: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Patient: {...data.Patient, Age: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setAgeLoading(false));
    }

    function updatePatientResidence(value)
    {
        setResidenceLoading(true);
        var payload = {
            Method: "/patient/residence",
            ID: saved.Patient.ID,
            Residence: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Patient: {...data.Patient, Residence: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setResidenceLoading(false));
    }

    function updatePatientDateOfDeath(value)
    {
        setDateOfDeathLoading(true);
        var payload = {
            Method: "/patient/date-of-death",
            ID: saved.Patient.ID,
            DateOfDeath: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Patient: {...data.Patient, DateOfDeath: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setDateOfDeathLoading(false));
    }

    function updatePatientCauseOfDeath(value)
    {
        setCauseOfDeathLoading(true);
        var payload = {
            Method: "/patient/cause-of-death",
            ID: saved.Patient.ID,
            CauseOfDeath: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Patient: {...data.Patient, CauseOfDeath: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setCauseOfDeathLoading(false));
    }

    function updateCaseCreated(value)
    {
        setDateCreatedLoading(true);
        var payload = {
            Method: "/date-created",
            ID: saved.ID,
            DateCreated: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, DateCreated: value}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setDateCreatedLoading(false));
    }

    function updateCaseCompleted(value)
    {
        setDateCompletedLoading(true);
        var payload = {
            Method: "/date-completed",
            ID: saved.ID,
            DateCompleted: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, DateCompleted: value}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setDateCompletedLoading(false));
    }

    function updateCaseStatus(value, date)
    {
        setStatusLoading(true);
        var payload = {
            Method: "/status",
            ID: saved.ID,
            Status: value.target.value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Status: value.target.value, DateCompleted: value.target.value === "Active" ? "": new Date().toUTCString()}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setStatusLoading(false));
    }

    function updateContactName(value)
    {
        setContactNameLoading(true);
        var payload = {
            Method: "/contact/name",
            ID: saved.Contact.ID,
            Name: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Contact: { ...data.Contact, Name: value }}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setContactNameLoading(false));
    }

    function updateContactRelation(value)
    {
        setContactRelationLoading(true);
        var payload = {
            Method: "/contact/relation",
            ID: saved.Contact.ID,
            Relation: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Contact: {...data.Contact, Relation: value}}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setContactRelationLoading(false));
    }

    function updateContactPhoneNumber(value)
    {
        setContactPhoneNumberLoading(true);
        var payload = {
            Method: "/contact/phone-number",
            ID: saved.Contact.ID,
            PhoneNumber: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Contact: {...data.Contact, PhoneNumber: value}}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setContactPhoneNumberLoading(false));
    }

    function updateContactEmail(value)
    {
        setContactEmailLoading(true);
        var payload = {
            Method: "/contact/email",
            ID: saved.Contact.ID,
            Email: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, Contact: {...data.Contact, Email: value}}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setContactEmailLoading(false));
    }

    function updateDirector(value)
    {
        setDirectorLoading(true);
        var payload = {
            Method: "/director",
            ID: saved.ID,
            UserID: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, UserID: value}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setDirectorLoading(false));
    }

    function updateService(value)
    {
        setServiceLoading(true);
        var payload = {
            Method: "/service",
            ID: saved.ID,
            ServiceID: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, ServiceID: value}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => {
            setServiceLoading(false);
            setServiceChangeConfirm({
                visible: false,
                newService: null
            })
        });
    }

    function updateHome(value)
    {
        setHomeLoading(true);
        var payload = {
            Method: "/home",
            ID: saved.ID,
            HomeID: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, HomeID: value}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setHomeLoading(false));
    }

    function updatePreArranged(value)
    {
        setPreArrangedLoading(true);
        var payload = {
            Method: "/prearranged",
            ID: saved.ID,
            PreArranged: value
        }
        dispatch(updateCase(payload)).unwrap()
        .then(() => setData({...data, PreArranged: value}))
        .catch(() => {
            api.error({
                placement: 'topRight',
                message: 'Error',
                description: 'Internal Server Error. Please try operation later.'
            })
        })
        .finally(() => setPreArrangedLoading(false));
    }
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
    }, [data?.DisplayID, portal?.ID])
    
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

    return (
        <PageBuilder>
            {contextHolder}
            <Modal
            title="Are you sure you want to change the service?"
            open={serviceChangeConfirm.visible}
            onOk={() => updateService(serviceChangeConfirm.newService)}
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
            onClick={(e) => setPage(e.key)}
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
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1,
            }}
            title={"Processing"}
            items={processingItems}
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
            items={saved?.Tasks.map((x, idx) => ({
                key: idx,
                label: x.Name,
                children: (
                    <Form>
                        {x.TaskOptions.map(option => {
                            return (
                                <Form.Item label={option.Name}>
                                    
                                </Form.Item>
                            )
                        })}
                    </Form>
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