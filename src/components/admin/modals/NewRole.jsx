import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Typography, Checkbox, Collapse  } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosWithSimpleCredentials, axiosWithoutCredentials } from '../../../configs/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createRole, fetchRoles } from '../../../redux/features/role.slice';
import { getSelectedPortal } from '../../../redux/features/admin.portal.slice';
const { Title } = Typography;
export default function NewRole({ visible, close, nav, verify }) {

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    create_case: 0,
    update_case: 0,
    delete_case: 0,
    read_inventory: 0,
    update_inventory: 0,
    read_analytics: 0
  })

  function saveNewRole(){

        messageApi.open({
            type: 'loading',
            content: 'Saving new role..',
            duration: 0,
            key: 'new-role-loading'
        });
        setLoading(true);
        var payload2 = {
            Name: form.name,
            Permissions: form,
            PortalID: portal.ID
        }

        dispatch(createRole(payload2)).unwrap()
        .then(() => {
            close();
            messageApi.destroy('new-role-loading');
            messageApi.open({
                type: 'success',
                content: `\'${form.name}\' Role saved.`,
                duration: 4
            })
        })
        .catch(() => {
            messageApi.destroy('new-role-loading');
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
            name: "",
            create_case: 0,
            update_case: 0,
            delete_case: 0,
            read_inventory: 0,
            update_inventory: 0,
            read_analytics: 0
        })
    }, [visible])
  return (
    <Modal
    open={visible}
    onCancel={close}
    footer={null}
    >
        {contextHolder}
        <Title level={4}>New Role</Title>
            <Form>
            <Form.Item className='!mb-0' required label="Name">
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            </Form.Item>
            <Collapse ghost items={[
                { 
                    key: '1', 
                    label: 'Permissions', 
                    children: (
                        <Form>
                        <Form.Item className="!mb-0" label="Create Case">
          <Checkbox checked={form.create_case} onChange={e => setForm({...form, create_case: e.target.checked ? 1 : 0})}/>
        </Form.Item>
        <Form.Item className="!mb-0" label="Update Case">
          <Checkbox checked={form.update_case} onChange={e => setForm({...form, update_case: e.target.checked ? 1 : 0})}/>
        </Form.Item>
        <Form.Item className="!mb-0" label="Delete Case">
          <Checkbox checked={form.delete_case} onChange={e => setForm({...form, delete_case: e.target.checked ? 1 : 0})}/>
        </Form.Item>
        <Form.Item className="!mb-0" label="Access Inventory">
          <Checkbox checked={form.read_inventory} onChange={e => setForm({...form, read_inventory: e.target.checked ? 1 : 0})}/>
        </Form.Item>
        <Form.Item className="!mb-0" label="Update Inventory">
          <Checkbox checked={form.update_inventory} onChange={e => setForm({...form, update_inventory: e.target.checked ? 1 : 0})}/>
        </Form.Item>
        <Form.Item label="Access Analytics">
          <Checkbox checked={form.read_analytics} onChange={e => setForm({...form, read_analytics: e.target.checked ? 1 : 0})}/>
        </Form.Item>
                    </Form>
                    )
                }
        ]} bordered={false}/>
                    <Form.Item>
            <Button loading={loading}  onClick={() => saveNewRole()}>{loading ? 'Saving...' : 'Save'}</Button>
        </Form.Item>
          </Form>

    </Modal>
  );
}