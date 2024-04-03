import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Typography, Select, Alert  } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosWithSimpleCredentials, axiosWithoutCredentials } from '../../../configs/axios';
import { useNavigate } from 'react-router-dom';
import { ReactMultiEmail } from 'react-multi-email';
import { useSelector, useDispatch } from 'react-redux';
import { createHome, updateHome } from '../../../redux/features/home.slice';
import { getSelectedPortal } from '../../../redux/features/admin.portal.slice';
import USStates from '../../../data/us-states.json';
const { Title } = Typography;
import 'react-multi-email/dist/style.css';
import { inviteUsers } from '../../../redux/features/admin.user.slice';
export default function InviteUsers({ visible, close, nav, verify, data }) {

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [loading, setLoading] = useState(false)
    const [emails, setEmails] = useState([]);
    const [focused, setFocused] = useState(false);

    function sendInvites()
    {
        setLoading(true);
        var payload = {
            PortalID: portal.ID,
            Emails: emails
        }
        dispatch(inviteUsers(payload)).unwrap()
        .then(res => {
            close()
        })
        .catch(err => {})
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        setEmails([])
    }, [])

  return (
    <Modal
    keyboard
    title={"Invite users to " + portal?.Name}
    open={visible}
    onCancel={close}
    footer={null}
    >
        
        {contextHolder}
            <Form>
            <span>Enter the emails you want to invite.</span>
            <ReactMultiEmail
                style={{
                    minHeight: '81px',
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem',
                }}
                autoFocus={true}
                placeholder='Enter your emails'
                onChange={(_emails) => {
                    setEmails(_emails);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                getLabel={(email, index, removeEmail) => {
                return (
                    <div data-tag key={index}>
                    <div data-tag-item>{email}</div>
                    <span data-tag-handle onClick={() => removeEmail(index)}>
                        ×
                    </span>
                    </div>
                );
                }}
                />
            <Button loading={loading}  onClick={() => sendInvites()}>{loading ? emails.length > 1 ? 'Sending invites' : 'Sending invite' : 'Send'}</Button>
          </Form>

    </Modal>
  );
}