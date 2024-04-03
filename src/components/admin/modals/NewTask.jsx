import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Typography } from 'antd';
const { TextArea } = Input;
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedPortal } from '../../../redux/features/admin.portal.slice';
import { createService, createTask } from '../../../redux/features/service.slice';
const { Title } = Typography;
export default function NewTask({ visible, close, nav, verify, data }) {

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: ""
  })

  function saveNewRole(){

        messageApi.open({
            type: 'loading',
            content: 'Saving new task..',
            duration: 0,
            key: 'new-task-loading'
        });
        setLoading(true);
        var payload2 = {
            Name: form.name,
            ServiceID: data.ID,
            PortalID: portal.ID
        }

        dispatch(createTask(payload2)).unwrap()
        .then(() => {
            close();
            messageApi.destroy('new-task-loading');
            messageApi.open({
                type: 'success',
                content: `\'${form.name}\' Task saved.`,
                duration: 4
            })
        })
        .catch(() => {
            messageApi.destroy('new-task-loading');
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
            description: ""
        })
    }, [visible])
  return (
    <Modal
    open={visible}
    onCancel={close}
    footer={null}
    >
        {contextHolder}
        <Title level={4}>New Task</Title>
            <Form layout='vertical'>
            <Form.Item required label="Name" className='!mb-2'>
                <Input maxLength={45} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            </Form.Item>
            <Form.Item>
                <Button loading={loading}  onClick={() => saveNewRole()}>{loading ? 'Saving...' : 'Save'}</Button>
            </Form.Item>
          </Form>

    </Modal>
  );
}