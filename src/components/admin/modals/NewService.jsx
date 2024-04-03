import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Typography } from 'antd';
const { TextArea } = Input;
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedPortal } from '../../../redux/features/admin.portal.slice';
import { createService } from '../../../redux/features/service.slice';
const { Title } = Typography;
export default function NewService({ visible, close, nav, verify }) {

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: ""
  })

  function saveNewRole(){

        messageApi.open({
            type: 'loading',
            content: 'Saving new service..',
            duration: 0,
            key: 'new-service-loading'
        });
        setLoading(true);
        var payload2 = {
            Name: form.name,
            Description: form.description,
            PortalID: portal.ID
        }

        dispatch(createService(payload2)).unwrap()
        .then(() => {
            close();
            messageApi.destroy('new-service-loading');
            messageApi.open({
                type: 'success',
                content: `\'${form.name}\' Service saved.`,
                duration: 4
            })
        })
        .catch((err) => {
            messageApi.destroy('new-service-loading');
            if(err === "DUPLICATE_SERVICE_NAME"){
                messageApi.open({
                    type: 'error',
                    content: `There is already a service with that name.`,
                    duration: 4
                })
            }else{
                messageApi.open({
                    type: 'error',
                    content: `Internal Server Error. Try again later.`,
                    duration: 4
                })
            }
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
        <Title level={4}>New Service</Title>
            <Form layout='vertical'>
            <Form.Item required label="Name" className='!mb-2'>
                <Input maxLength={45} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            </Form.Item>
            <Form.Item label="Description" className='!mb-4'>
                <TextArea value={form.description} rows={6} maxLength={255} onChange={e => setForm({...form, description: e.target.value})}/>
            </Form.Item>
            <Form.Item>
                <Button loading={loading}  onClick={() => saveNewRole()}>{loading ? 'Saving...' : 'Save'}</Button>
            </Form.Item>
          </Form>

    </Modal>
  );
}