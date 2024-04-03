import React, { useState, useEffect } from 'react';
import Logo from '../../assets/logo.png';
import { Modal, Button, Form, Input, message, Typography, List, Select, Alert, Row, Col  } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosWithSimpleCredentials, axiosWithoutCredentials } from '../../../configs/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createHome, updateHome } from '../../../redux/features/home.slice';
import { getSelectedPortal } from '../../../redux/features/portal.slice';
import USStates from '../../../data/us-states.json';
const { Title } = Typography;
const { TextArea } = Input;

export default function EditTask({ visible, close, nav, verify, data }) {

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState(data)

    useEffect(() => {
        setForm(data);
    }, [data])
  return (
    <Modal
    open={visible}
    onCancel={close}
    width={1000}
    footer={null}
    >
        {contextHolder}
       <Form layout='vertical'>
           <Row>
               <Col span={12}>
                <Form.Item label="Name">
                    <Input/>
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea/>
                </Form.Item>
               </Col>
               <Col span={12}>
                    <List>
                        {data.DefaultTaskOptions.map(option => {
                            return (
                                <List.Item>
                                    <Input/>
                                    <Input/>
                                    <Input/>
                                </List.Item>
                            )
                        })}
                   </List>
               </Col>
           </Row>
       </Form>
    </Modal>
  );
}