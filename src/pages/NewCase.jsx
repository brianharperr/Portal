import PageBuilder from "../components/PageBuilder";
import { Steps, Form, Input, Select, Button, InputNumber, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
const { TextArea } = Input;
import { axiosWithCredentials } from "../configs/axios";
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
    const [current, setCurrent] = useState(0);
    const [options, setOptions] = useState({
        Homes: [],
        Services: [],
        Users: []
    })

    const [form, setForm] = useState({
        FirstName: "",
        LastName: "",
        Age: null,
        Sex: "",
        CauseOfDeath: "",
        DateOfDeath: "",
        PreArranged: "",
        Service: null,
        Home: null,
        Director: null,
        ContactName: "",
        ContactPhoneNumber: "",
        ContactEmail: "",
        ContactRelation: "",
        ContactOtherRelation: ""
    })

    useEffect(() => {
        axiosWithCredentials.post('/procedure/getHomesServicesEmployees')
        .then(res => {
            setOptions({
                Homes: res.data.Homes.map(x => ({ key: x.ID, value: x.ID, label: x.Name})),
                Services: res.data.Services.map(x => ({ key: x.ID, value: x.ID, label: x.Name})),
                Users: res.data.Users.map(x => ({ key: x.ID, value: x.ID, label: x.FirstName + " " + x.LastName}))
            });
        })
}, []);

    return (
        <PageBuilder>
            <Steps 
            current={current}
            onChange={e => setCurrent(e)}
            items={[
                {
                  title: 'Patient'
                },
                {
                  title: 'Contact'
                },
                {
                  title: 'Processing'
                },
              ]}
            />
            {current === 0 &&
            <Form layout="vertical" className="!mx-auto !max-w-[720px]">
                <Form.Item required label="First name">
                    <Input value={form.FirstName} onChange={e => setForm({...form, FirstName: e.target.value})}/>
                </Form.Item>
                <Form.Item  label="Middle name">
                    <Input/>
                </Form.Item>
                <Form.Item required label="Last name">
                    <Input/>
                </Form.Item>
                <Form.Item label="Age">
                    <InputNumber value={form.Age} onChange={e => setForm({...form, Age: e})}/>
                </Form.Item>
                <Form.Item label="Sex">
                    <Select options={[ {label: "Male", value: "M"}, {label: "Female", value: "F"}]} value={form.Sex} onChange={e => setForm({...form, Sex: e})}/>
                </Form.Item>
                <Form.Item label="Date Of Death">
                    <DatePicker showTime value={form.DateOfDeath} onChange={e => setForm({...form, DateOfDeath: e})}/>
                </Form.Item>
                <Form.Item label="Cause Of Death">
                    <Input value={form.CauseOfDeath} onChange={e => setForm({...form, CauseOfDeath: e.target.value})}/>
                </Form.Item>
                <Form.Item>
                    <Button onClick={() => setCurrent(1)}>Next</Button>
                </Form.Item>
            </Form>
            }
            {current === 1 &&
            <Form layout="vertical" className="!mx-auto !max-w-[720px]">
                <Form.Item label="Full name">
                    <Input value={form.FirstName} onChange={e => setForm({...form, FirstName: e.target.value})}/>
                </Form.Item>
                <Form.Item label="Relation">
                    <Select options={relations} value={form.ContactRelation} onChange={e => setForm({...form, ContactRelation: e})}/>
                </Form.Item>
                {form.ContactRelation === "Other" && 
                <Form.Item>
                    <Input value={form.ContactOtherRelation} onChange={e => setForm({...form, ContactOtherRelation: e.target.value})}/>
                </Form.Item>
                }
                <Form.Item  label="Email">
                    <Input/>
                </Form.Item>
                <Form.Item label="Phone number">
                    <Input/>
                </Form.Item>
                <Form.Item>
                    <Button onClick={() => setCurrent(2)}>Next</Button>
                </Form.Item>
            </Form>
            }
            {current === 2 &&
            <Form layout="vertical" className="!mx-auto !max-w-[720px]">
                <Form.Item label="Service">
                    <Select options={options.Services} value={form.Service} onChange={e => setForm({...form, Service: e})}/>
                </Form.Item>
                <Form.Item label="Home">
                    <Select options={options.Homes} value={form.Home} onChange={e => setForm({...form, Home: e})}/>
                </Form.Item>
                <Form.Item label="Director">
                    <Select options={options.Users} value={form.Director} onChange={e => setForm({...form, Director: e})}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary">Finish</Button>
                </Form.Item>
            </Form>
            }
        </PageBuilder>
    )
}