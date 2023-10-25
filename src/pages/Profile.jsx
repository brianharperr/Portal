import { Button, Checkbox, Col, Divider, Form, Input, Progress, Row, Switch, Typography, notification} from "antd";
import PageBuilder from "../components/PageBuilder";
import { useEffect, useState } from "react";
import { fetchUser, getUser, updateNotificationSettings, updateUser } from "../redux/features/user.slice";
import { useDispatch, useSelector } from "react-redux";
import ValidationService from "../services/Validation";
import { axiosWithCredentials } from "../configs/axios";

export default function Profile()
{
    const user = useSelector(getUser);
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();
    const [data, setData] = useState();
    const [editedProfile, setEditedProfile] = useState(false);
    const [editedNotifications, setEditedNotifications] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [emailVerification, setEmailVerification] = useState(false);
    const [password2Error, setPassword2Error] = useState();
    const [passwordStrength, setPasswordStrength] = useState({
        value: 0,
        color: 'red',
        extra: 'Passwords must be at least 8 characters, including a capital letter and number'
    });
    const [form, setForm] = useState({
        current: "",
        new: "",
        confirm: ""
    })

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);

    const formItemLayout = {
        labelCol: {
        span: 5,
        },
        wrapperCol: {
        span: 12,
        },
    }

    const buttonLayout = {
        wrapperCol: {
            span: 14,
            offset: 5
        }
    }

    function findSetBitPositions(number) {
        if (number === 0) {
          return [];
        }
      
        const setBitPositions = [];
        let bitPosition = 0;
      
        while (number > 0) {
          if (number & 1) {
            setBitPositions.push(bitPosition);
          }
      
          number >>= 1; // Right shift to check the next bit
          bitPosition++;
        }
      
        return setBitPositions;
      }

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
            CaseNotification: data.CaseNotification,
            MessageNotification: data.MessageNotification,
        }
 
        dispatch(updateUser(payload)).unwrap()
        .then((res) => {
            if(res.EmailVerifyNeeded === 1){
                setEmailVerification(true);
            }else if(res.EmailVerifyNeeded === -1){
                api['error']({
                    message: 'Duplicate Email Address',
                    description:
                      'There\'s a user on this portal with that email address already.',
                  });
            }
        })
        .finally(() => setProfileLoading(false))
    }

    function saveNotifications()
    {
        setNotificationsLoading(true);
        var payload = {
            ID: user.ID,
            CaseNotification: data.CaseNotification,
            MessageNotification: data.MessageNotification
        }
        dispatch(updateNotificationSettings(payload)).unwrap()
        .finally(() => setNotificationsLoading(false))
    }

    function handleResetPassword()
    {
        axiosWithCredentials.patch('/user/portal/password', form)
        .then(() => {
            setForm({
                current: "",
                new: "",
                confirm: ""
            });
            api['success']({
                message: 'Password updated.',
              });
        })
        .catch(() => {
            api['error']({
                message: 'Internal Server Error',
                description: 'Could not update password at this time.',
              });
        })
    }

    const formatPhoneNumber = (value) => {
        // Remove any non-digit characters from the input
        const unformatted = value.replace(/\D/g, '');
    
        // Format the unformatted number as a phone number (e.g., (123) 456-7890)
        const formatted = `(${unformatted.slice(0, 3)}) ${unformatted.slice(3, 6)}-${unformatted.slice(6, 10)}`;
    
        setFormattedPhoneNumber(formatted);
        setData({...data, PhoneNumber: unformatted});
    };

    useEffect(() => {
        dispatch(fetchUser())
    }, [])

    useEffect(() => {
        setResetPassword(form.current && form.confirm && form.new);
        if(form.confirm && form.confirm !== form.new){

        }
    }, [form]);

    useEffect(() => {
        if(form.confirm.length > 0 && form.new !== form.confirm){
            setPassword2Error('Passwords do not match')
        }else{
            setPassword2Error(null);
        }
        setResetPassword(form.current && form.new === form.confirm && passwordStrength.value >= 50);
    }, [form.new, form.confirm])

    useEffect(() => {
        ValidationService.validatePasswordStrength(form.new, (e) => setPasswordStrength(e))
    }, [form.new]);

    useEffect(() => {
        setEditedProfile(
            user?.FirstName !== data?.FirstName ||
            user?.LastName !== data?.LastName ||
            user?.Email !== data?.Email ||
            user?.PhoneNumber !== data?.PhoneNumber
        );

        setEditedNotifications(
            JSON.stringify(findSetBitPositions(user?.CaseNotification)) !== JSON.stringify(data?.CaseNotification) ||
            JSON.stringify(findSetBitPositions(user?.MessageNotification)) !== JSON.stringify(data?.MessageNotification)
        );

    }, [data]);

    useEffect(() => {
        if(user){

            setData({
                ...user,
                CaseNotification:findSetBitPositions(user.CaseNotification),
                MessageNotification:findSetBitPositions(user.MessageNotification)
            });

        }
    }, [user])

    return (
        <PageBuilder name="profile" breadcrumb={["Profile"]}>
            {contextHolder}
            <div className="bg-white rounded-lg pb-4 px-4 shadow-md mx-auto w-[720px]">
            <Form {...formItemLayout}>
                <Divider orientation="left" orientationMargin="0">
                    <Typography.Title level={4}>Profile</Typography.Title>
                </Divider>

                <Form.Item validateStatus={firstNameError ? "error" : null} required label="First Name">
                    <Input value={data?.FirstName} onChange={e => setData({...data, FirstName: e.target.value})} />
                </Form.Item>

                <Form.Item validateStatus={lastNameError ? "error" : null} required label="Last Name">
                    <Input value={data?.LastName} onChange={e => setData({...data, LastName: e.target.value})} />
                </Form.Item>
                <Form.Item required label="Email" hasFeedback validateStatus={emailVerification ? "warning" : null} help={emailVerification ? "A verification email has been sent." : null}>
                    <Input value={data?.Email} onChange={e => setData({...data, Email: e.target.value})} />
                </Form.Item>
                <Form.Item label="Phone Number">
                    <Input value={formattedPhoneNumber} onChange={e => formatPhoneNumber(e.target.value)} />
                </Form.Item>
                <Form.Item {...buttonLayout}>
                    <Button disabled={!editedProfile} loading={profileLoading} type="primary" onClick={saveProfile}>Save</Button>
                </Form.Item>
                <Divider orientation="left" orientationMargin="0">
                    <Typography.Title level={4}>Notifications</Typography.Title>
                </Divider>
                <Form.Item label="Case Updates">
                    <Switch checked={data?.CaseNotification.length !== 0} onChange={e => setData({...data, CaseNotification: e ? [0]: []})}/>
                    <Checkbox.Group value={data?.CaseNotification} disabled={data?.CaseNotification.length === 0} className="ml-2"  options={[
                        {
                            label: 'Email',
                            value: 0,
                        },
                        {
                            label: 'SMS',
                            value: 1,
                        }
                        ]} 
                        onChange={e => setData({...data, CaseNotification: e})}
                        />
                </Form.Item>
                <Form.Item label="Messages">
                    <Switch checked={data?.MessageNotification.length !== 0} onChange={e => setData({...data, MessageNotification: e ? [0]: []})}/>
                    <Checkbox.Group value={data?.MessageNotification} disabled={data?.MessageNotification.length === 0} className="ml-2" options={[
                        {
                            label: 'Email',
                            value: 0,
                        },
                        {
                            label: 'SMS',
                            value: 1,
                        }
                        ]} 
                        onChange={e => setData({...data, MessageNotification: e})}
                    />
                </Form.Item>
                <Form.Item {...buttonLayout}>
                    <Button disabled={!editedNotifications} loading={notificationsLoading} type="primary" onClick={saveNotifications}>Save</Button>
                </Form.Item>
                <Divider orientation="left" orientationMargin="0">
                    <Typography.Title level={4}>Change Password</Typography.Title>
                </Divider>
                <Form.Item label="Current Password">
                    <Input type="password" value={form.current} onChange={e => setForm({...form, current: e.target.value})}/>
                </Form.Item>
                <Form.Item label="New Password" extra={passwordStrength.extra}>
                    <Input type="password" value={form.new} onChange={e => setForm({...form, new: e.target.value})}/>
                    <Progress className="!mt-0" percent={passwordStrength.value} strokeColor={passwordStrength.color} showInfo={false}/>
                </Form.Item>
                <Form.Item label="Confirm Password"
                validateStatus={password2Error && 'error'}
                hasFeedback
                help={password2Error}
                >
                    <Input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}/>
                </Form.Item>
                <Form.Item {...buttonLayout}>
                    <Button disabled={!resetPassword} type="primary" onClick={handleResetPassword}>Reset password</Button>
                </Form.Item>
            </Form>
            </div>
        </PageBuilder>
    )
}