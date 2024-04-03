import React, { useState, useEffect } from 'react';
import { Form, Input, message, Typography, Select, DatePicker, Radio, Checkbox, Modal, Button  } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosWithAdminCredentials, axiosWithSimpleCredentials, axiosWithoutCredentials } from '../../../configs/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createHome, updateHome } from '../../../redux/features/home.slice';
import { getSelectedPortal } from '../../../redux/features/admin.portal.slice';
import USStates from '../../../data/us-states.json';
import { getUsers } from '../../../redux/features/admin.user.slice';
import { updateOption } from '../../../redux/features/service.slice';
const { Title } = Typography;
const { TextArea } = Input;
export default function EditOption({ visible, close, nav, verify, data }) {

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState(data);
    const users = useSelector(getUsers);
    const [locations, setLocations] = useState([
        {
            value: -1,
            label: 'New Location +',
        },
    ]);

    function saveOption()
    {
        setLoading(true);
        var payload = {
            PortalID: portal.ID,
            ID: data.ID,
            Name: form.Name,
            Type: form.Type,
            Value: form.Value
        }
        dispatch(updateOption(payload)).unwrap()
        .then(() => {
        })
        .catch((err) => {

        }).finally(() => {
            setLoading(false);
        })
    }

    function searchLocations(value)
    {
        var payload = {
            portal: portal.ID,
            query: value,
            size: 10
        }

        axiosWithAdminCredentials.get('/search/location/admin', { params: payload })
        .then(res => {
            var spots = res.data.map(x => ({ label: <div><b className='!text-gray-600'>{x.Name}</b><p>{x.FullAddress}</p></div>, value: x.ID }));
            spots.push({
                value: -1,
                label: <b>+ New Location</b>,
            }) 
            setLocations(spots)
        });
    }


    function renderDefaultvalue()
    {
        switch(form.Type){
            case "Text":
                return (
                    <Input value={form.Value} onChange={(e) => setForm({ ...form, Value: e.target.value})}/>
                );
            case "Employee":
                return (
                    <Select className="!w-[140px]" options={users.map(x => ({ value: x.ID, label: x.FirstName + " " + x.LastName}))} value={parseInt(form.Value) || null} onChange={(e) => setForm({...form, Value: e})}/>
                );
            case "Location":
                return (
                    <Select labelInValue filterOption={false} options={locations} showSearch onSearch={e => searchLocations(e)} value={parseInt(form.Value) || null} onChange={(e) => setForm({...form, Value: e.value})}/>
                );
            case "Date":
                return (
                    <DatePicker showTime onChange={(e) => setForm({...form, Value: e})}/> 
                );
            case "Radio Buttons":
                return (
                    <Radio.Group value={form.Value} onChange={(e) => setForm({...form, Value: e.target.value})}>
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                    </Radio.Group>
                );
            case "Checkbox":
                return (
                    <Checkbox checked={form.Value} onChange={e => setForm({...form, Value: e})}/>
                );
            case "Textarea":
                return (
                    <TextArea value={form.Value} onChange={e => setForm({...form, Value: e.target.value})}/>
                );
        }
    }

    useEffect(() => {
        setForm({...form, Value: ""});
    }, [form.Type])

    useEffect(() => {
        setForm(data);
        searchLocations();
    }, [visible, data])
  return (
    <Modal
    open={visible}
    onCancel={close}
    footer={null}
    >
        {contextHolder}
        <Title level={4}>Edit '{form.Name}'</Title>
        <Form labelCol={{
      span: 5,
    }}
>
            <Form.Item label="Name">
            <Input value={form.Name} onChange={(e) => setForm({ ...form, Name: e.target.value})}/>
            </Form.Item>
            <Form.Item label="Type">
            <Select className="min-w-[100px]" value={form.Type} options={[
                            { key: 'Text', value: 'Text', label: 'Text'},
                            { key: 'Employee', value: 'Employee', label: 'Employee'},
                            { key: 'Location', value: 'Location', label: 'Location'},
                            { key: 'Date', value: 'Date', label: 'Date'},
                            { key: 'Radio Buttons', value: 'Radio Buttons', label: 'Radio'},
                            { key: 'Checkbox', value: 'Checkbox', label: 'Checkbox'},
                            { key: 'Textarea', value: 'Textarea', label: 'Textarea'},
                        ]}
                        onChange={(e) => setForm({...form, Type: e})}
                        />
            </Form.Item>
            <Form.Item label="Default Value">
                {renderDefaultvalue()}
            </Form.Item>
            <Form.Item>
                <Button className='float-right' loading={loading} type='primary' onClick={() => saveOption()}>Save</Button>
            </Form.Item>
        </Form>

    </Modal>
  );
}