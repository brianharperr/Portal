import { Button, Checkbox, Col, Divider, Form, Input, Row, Typography } from "antd";
import PageBuilder from "../components/PageBuilder";
import { useEffect, useState } from "react";
import { fetchUser, getUser, updateUser } from "../redux/features/user.slice";
import { useDispatch, useSelector } from "react-redux";

export default function Profile()
{
    const user = useSelector(getUser);
    const dispatch = useDispatch();
    const [data, setData] = useState();
    const [editedProfile, setEditedProfile] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [form, setForm] = useState({
        current: "",
        new: "",
        confirm: ""
    })

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
    };

    function saveProfile()
    {
        setProfileLoading(true);

        setFirstNameError(!data.FirstName);
        setLastNameError(!data.LastName);

        if(!data.FirstName || !data.LastName){
            setProfileLoading(false)
            return;
        }
        var payload = {
            ID: user.ID,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Email: data.Email,
            PhoneNumber: data.PhoneNumber,
            ReceiveNotificationsEmail: notifications.includes('Email') ? 1 : 0,
            ReceiveNotificationsSMS: notifications.includes('SMS') ? 1 : 0,
        }
 
        dispatch(updateUser(payload)).unwrap()
        .finally(() => setProfileLoading(false))
    }

    useEffect(() => {
        dispatch(fetchUser())
    }, [])

    useEffect(() => {
        setData(user);
        var notifications = [];
        if(user?.ReceiveNotificationsEmail){
            notifications.push('Email')
        }
        if(user?.ReceiveNotificationsSMS){
            notifications.push('SMS')
        }
        setNotifications(notifications);
    }, [user]);

    useEffect(() => {
        setResetPassword(form.current || form.current || form.new);
    }, [form]);

    useEffect(() => {
        setEditedProfile(
            user?.FirstName !== data?.FirstName ||
            user?.LastName !== data?.LastName ||
            user?.Email !== data?.Email ||
            user?.PhoneNumber !== data?.PhoneNumber ||
            (user?.ReceiveNotificationsEmail != notifications.includes('Email')) ||
            (user?.ReceiveNotificationsSMS != notifications.includes('SMS'))
        );

    }, [data, notifications]);

    return (
        <PageBuilder name="profile" breadcrumb={["Profile"]}>
            <Form className="mx-auto w-[720px]">
            <Divider orientation="left" orientationMargin="0">
                    <Typography.Title level={4}>Profile</Typography.Title>
                </Divider>

 
                <Form.Item validateStatus={firstNameError ? "error" : null} required label="First Name">
                    <Input value={data?.FirstName} onChange={e => setData({...data, FirstName: e.target.value})} />
                </Form.Item>

                <Form.Item validateStatus={lastNameError ? "error" : null} required label="Last Name">
                    <Input value={data?.LastName} onChange={e => setData({...data, LastName: e.target.value})} />
                </Form.Item>

                <Form.Item required label="Email">
                    <Input value={data?.Email} onChange={e => setData({...data, Email: e.target.value})} />
                </Form.Item>
                <Form.Item label="Phone Number">
                    <Input value={data?.PhoneNumber} onChange={e => setData({...data, PhoneNumber: e.target.value})} />
                </Form.Item>
                <Form.Item label="Notifcations">
                    <Checkbox.Group value={notifications} options={[
                        {
                            label: 'Email',
                            value: 'Email',
                        },
                        {
                            label: 'SMS',
                            value: 'SMS',
                        }
                        ]} 
                        onChange={e => setNotifications(e)}
                        />
                </Form.Item>
                {editedProfile &&
                <Form.Item>
                    <Button loading={profileLoading} type="primary" onClick={saveProfile}>Save</Button>
                </Form.Item>
                }
                <Divider orientation="left" orientationMargin="0">
                    <Typography.Title level={4}>Change Password</Typography.Title>
                </Divider>
                <Form.Item label="Current Password">
                    <Input type="password" value={form.current} onChange={e => setForm({...form, current: e.target.value})}/>
                </Form.Item>
                <Form.Item label="New Password">
                    <Input type="password" value={form.new} onChange={e => setForm({...form, new: e.target.value})}/>
                </Form.Item>
                <Form.Item label="Confirm Password">
                    <Input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}/>
                </Form.Item>
                {resetPassword &&
                <Form.Item>
                    <Button type="primary">Reset password</Button>
                </Form.Item>
                }
            </Form>
        </PageBuilder>
    )
}