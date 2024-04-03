import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Typography, Select, Checkbox, Collapse  } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosWithSimpleCredentials, axiosWithoutCredentials } from '../../../configs/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createHome } from '../../../redux/features/home.slice';
import { getSelectedPortal } from '../../../redux/features/admin.portal.slice';
import USStates from '../../../data/us-states.json';
const { Title } = Typography;
export default function NewHome({ visible, close, nav, verify }) {

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    Name: "",
    Address: "",
    City: "",
    State: "",
    ZipCode: "",
    Country: "US"
  })

  function saveNewHome(){

        if(!(form.Name && form.Address && form.City && form.State && form.ZipCode)){
            messageApi.open({
                type: 'error',
                content: 'Please fill out all required fields',
                duration: 4
            })
            return;
        }
        messageApi.open({
            type: 'loading',
            content: 'Saving new home..',
            duration: 0,
            key: 'new-home-loading'
        });
        setLoading(true);
        var payload2 = {
            Name: form.Name,
            Address: form.Address,
            City: form.City,
            State: form.State,
            ZipCode: form.ZipCode,
            Country: form.Country,
            PortalID: portal.ID
        }

        dispatch(createHome(payload2)).unwrap()
        .then(() => {
            close();
            messageApi.destroy('new-home-loading');
            messageApi.open({
                type: 'success',
                content: `\'${form.Name}\' Home saved.`,
                duration: 4
            })
        })
        .catch(() => {
            messageApi.destroy('new-home-loading');
            messageApi.open({
                type: 'error',
                content: `Internal Server Error. Try again later.`,
                duration: 4
            })
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        setForm({
            Name: "",
            Address: "",
            City: "",
            State: "",
            ZipCode: "",
            Country: "US",
            visible: false
        })
    }, [visible])

  return (
    <Modal
    open={visible}
    onCancel={close}
    footer={null}
    >
        {contextHolder}
        <Title level={4}>New Home</Title>
            <Form labelCol={{span: 4}}>
            <Form.Item required label="Name">
                <Input value={form.Name} onChange={e => setForm({...form, Name: e.target.value})}/>
            </Form.Item>
            <Form.Item  required label="Address">
                <Input value={form.Address} onChange={e => setForm({...form, Address: e.target.value})}/>
            </Form.Item>
            <Form.Item required label="City">
                <Input value={form.City} onChange={e => setForm({...form, City: e.target.value})}/>
            </Form.Item>
            <Form.Item  required label="State">
                <Select
                    showSearch
                    placeholder="Select state"
                    onChange={e => setForm({...form, State: e})}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={USStates.map(x => ({
                        value: x.code,
                        label: x.name
                    }))}
                    value={form.State}
                />
            </Form.Item>
            <Form.Item required label="Zipcode">
                <Input value={form.ZipCode} onChange={e => setForm({...form, ZipCode: e.target.value})}/>
            </Form.Item>
            <Form.Item  required label="Country">
                <Select
                    showSearch
                    value="United States"
                    disabled
                />
            </Form.Item>
            <Button loading={loading}  onClick={() => saveNewHome()}>{loading ? 'Saving...' : 'Save'}</Button>
          </Form>

    </Modal>
  );
}