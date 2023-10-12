import { Button, Card, DatePicker, Form, Input, InputNumber, Radio, Select, Space, Steps } from "antd";
import {
    ArrowRightOutlined,
    CheckOutlined,
    ArrowLeftOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';

import { useState } from "react";
import PageBuilder from "../components/PageBuilder";
import { useEffect } from "react";
import { axiosWithCredentials } from "../configs/axios";
import { useDispatch, useSelector } from "react-redux";
import { getPortal } from "../redux/features/portal.slice";
import { useNavigate } from "react-router-dom";
import { createCase } from "../redux/features/case.slice";

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

export default function NewCase()
{
    const portal = useSelector(getPortal);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [current, setCurrent] = useState(0);
    const [options, setOptions] = useState({
        Homes: [],
        Services: [],
        Users: []
    });
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState("M");
    const [age, setAge] = useState(null);
    const [residence, setResidence] = useState();
    const [causeOfDeath, setCauseOfDeath] = useState("");
    const [dateOfDeath, setDateOfDeath] = useState(null);

    const [service, setService] = useState(null);
    const [home, setHome] = useState(null);
    const [director, setDirector] = useState(null);
    const [preArranged, setPreArranged] = useState(0);

    const [contactName, setContactName] = useState(null);
    const [relation, setRelation] = useState(null);
    const [otherRelation, setOtherRelation] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
    const [email, setEmail] = useState(null);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [homeError, setHomeError] = useState(false);
    const [serviceError, setServiceError] = useState(false);
    const [directorError, setDirectorError] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatPhoneNumber = (input) => {
    
        setPhoneNumber(input);
        if(input && input.length < 10){
            setPhoneNumberError(true);
        }else{
            setPhoneNumberError(false);
        }
      };

    function handleSubmit()
    {
        var tmp_current = [];

        if(!firstName){
            tmp_current.push(0);
            setFirstNameError(true);
        }
        if(!lastName){
            tmp_current.push(0);
            setLastNameError(true);
        }
        if(!service){
            tmp_current.push(1);
            setServiceError(true);
        }
        if(!home){
            tmp_current.push(1);
            setHomeError(true);
        }
        if(!director){
            tmp_current.push(1);
            setDirectorError(true);
        }
        if(phoneNumberError){
            tmp_current.push(2);
        }
        if(tmp_current.length > 0){
            setCurrent(Math.min(...tmp_current));
            return;
        }

        setLoading(true);
        var payload = {
            Contact: {
                Name: contactName,
                Email: email,
                PhoneNumber: phoneNumber,
                Relation: (relation === "Other") ? otherRelation : relation
            },
            Patient: {
                FirstName: firstName,
                LastName: lastName,
                Sex: sex,
                Age: age,
                Residence: residence,
                CauseOfDeath: causeOfDeath,
                DateOfDeath: dateOfDeath
            },
            ServiceID: service,
            HomeID: home,
            UserID: director,
            Status: "Active",
            PortalID: portal.ID,
            PreArranged: preArranged
        }
        dispatch(createCase(payload)).unwrap()
        .then(res => {
            navigate('/');
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {

        if(portal){
            var payload = {
                PortalID: portal.ID
            }

            axiosWithCredentials.post('/procedure/getHomesServicesEmployees', payload)
            .then(res => {
                var homes = res.data.Homes.map(x => ({value: x.ID, label: x.Name}));
                var services = res.data.Services.map(x => ({ value: x.ID, label: x.Name}));
                var users = res.data.Users.map(x => ({ value: x.ID, label: x.FirstName + " " + x.LastName}));

                setOptions({
                    Homes: homes,
                    Services: services,
                    Users: users
                });
            
            })
            .catch(err => {

            })
        }
    }, [portal]);

    return (
        <PageBuilder>
            <Card
            className="!max-w-[1024px] mx-auto shadow"
            title={
                <Steps
                onChange={e => setCurrent(e)}
                current={current}
                items={[
                    {
                        title: 'Patient'
                    },
                    {
                        title: 'Processing'
                    },
                    {
                        title: 'Contact'
                    }
                ]}
                />
            }
            >
                {current === 0 &&
                <Form
                  wrapperCol={{
                    span: 8,
                  }}
                  labelCol={{
                      span: 3
                  }}
                >
                    <Form.Item help={firstNameError ? "Required" : null} validateStatus={firstNameError ? "error" : null} required label="First name">
                        <Input max={45} value={firstName} onChange={e => {
                            if(e.target.value){
                                setFirstNameError(false);
                            }else{
                                setFirstNameError(true);
                            }
                            setFirstName(e.target.value);
                        }}/>
                    </Form.Item>
                    <Form.Item label="Middle name">
                        <Input maxLength={45} value={middleName} onChange={e => setMiddleName(e.target.value)}/>
                    </Form.Item>
                    <Form.Item help={lastNameError ? "Required" : null} validateStatus={lastNameError ? "error" : null} required label="Last name">
                        <Input maxLength={45} value={lastName} onChange={e => {
                            if(e.target.value){
                                setLastNameError(false);
                            }else{
                                setLastNameError(true);
                            }
                            setLastName(e.target.value);
                        }}/>
                    </Form.Item>
                    <Form.Item required label="Sex">
                        <Select value={sex} onChange={e => setSex(e)} options={[{label: "Male", value: "M"}, {label: "Female", value: "F"}]}/>
                    </Form.Item>
                    <Form.Item label="Age">
                        <InputNumber value={age} onChange={e => setAge(e)}  min={0}/>
                    </Form.Item>
                    <Form.Item label="Residence">
                        <Input value={residence} onChange={e => setResidence(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Date of death">
                        <DatePicker value={dateOfDeath} onChange={e => setDateOfDeath(e)} />
                    </Form.Item>
                    <Form.Item label="Cause of death">
                        <Input maxLength={64} value={causeOfDeath} onChange={e => setCauseOfDeath(e.target.value)} />
                    </Form.Item>
                    <div className="flex justify-end">
                        <Button onClick={() => setCurrent(1)} icon={<ArrowRightOutlined/>}>Next</Button>
                    </div>
                </Form>
                }
                {current === 1 &&
                <Form
                  wrapperCol={{
                    span: 8,
                  }}
                  labelCol={{
                      span: 3
                  }}
                >
                    <Form.Item help={serviceError ? "Required" : null} validateStatus={serviceError ? "error" : null} required label="Service">
                        <Select value={service} onChange={e => {
                            if(e){
                                setServiceError(false)
                            }
                            setService(e)
                        }} options={options.Services} />
                    </Form.Item>
                    <Form.Item help={homeError ? "Required" : null} validateStatus={homeError ? "error" : null} required label="Home">
                        <Select value={home} onChange={e => {
                            if(e){
                                setHomeError(false)
                            }
                            setHome(e)
                        }} options={options.Homes}/>
                    </Form.Item>
                    <Form.Item help={directorError ? "Required" : null} validateStatus={directorError ? "error" : null} required label="Director">
                        <Select value={director} onChange={e => {
                            if(e){
                                setDirectorError(false)
                            }
                            setDirector(e)
                        }} options={options.Users}/>
                    </Form.Item>
                    <Form.Item label="Pre-Arranged">
                        <Radio.Group value={preArranged} onChange={e => setPreArranged(e.target.value)} defaultValue={0}>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <div className="flex justify-between">
                        <Button onClick={() => setCurrent(0)} icon={<ArrowLeftOutlined/>}>Back</Button>
                        <Button onClick={() => setCurrent(2)} icon={<ArrowRightOutlined/>}>Next</Button>
                    </div>
                </Form>
                }
                {current === 2 &&
                <Form
                  wrapperCol={{
                    span: 8,
                  }}
                  labelCol={{
                      span: 3
                  }}
                >
                    <Form.Item label="Full name">
                        <Input maxLength={45} value={contactName} onChange={e => setContactName(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Relation">
                        <Space>
                            <Space.Compact>
                                <Select className="!min-w-[120px]" options={relations} value={relation} onChange={e => setRelation(e)}/>
                                {relation === "Other" && <Input value={otherRelation} onChange={e => setOtherRelation(e.target.value)}/>}
                            </Space.Compact>
                        </Space>
                    </Form.Item>
                    <Form.Item help={phoneNumberError ? "Invalid number" : null} validateStatus={phoneNumberError ? "error" : null} label="Phone Number">
                        <Input maxLength={10} value={phoneNumber} onChange={e => formatPhoneNumber(e.target.value)} prefix={<PhoneOutlined />}/>
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input maxLength={64} prefix={<MailOutlined />} value={email} onChange={e => setEmail(e.target.value)}/>
                    </Form.Item>
                    <div className="flex justify-between">
                        <Button onClick={() => setCurrent(1)} icon={<ArrowLeftOutlined/>}>Back</Button>
                        <Button onClick={handleSubmit} loading={loading} type="primary" icon={<CheckOutlined/>}>Finish</Button>
                    </div>
                </Form>
                }
            </Card>
        </PageBuilder>
    )
}