import { useEffect, useState } from "react";
import PageBuilder from "../../components/admin/PageBuilder";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser, updateName, getUser, toggleNotificationsPreference, updateEmail, updatePassword } from "../../redux/features/admin.user.slice";
import { Button, Card, Checkbox, Form, Input, Select, Space, Tooltip, Typography, message } from "antd";
export default function Profile() {

  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);
  const [editedUser, setEditedUser] = useState(user);
  const [messageApi, contextHolder] = message.useMessage();
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  function handleUpdateEmail()
  {
    setEmailLoading(true);
    messageApi.open({
        type: 'loading',
        content: 'Processing...',
        duration: 0,
        key: 'loading-email-change'
    });
    var payload = {
      ID: user.ID,
      Email: editedUser.Email
    }
    dispatch(updateEmail(payload)).unwrap()
    .then((res) => {
      messageApi.destroy('loading-email-change');
      messageApi.open({
          type: 'success',
          content: 'Check email inbox to confirm change.',
          duration: 4
      });
    })
    .catch(err => {
      messageApi.destroy('loading-email-change');
      messageApi.open({
        type: 'error',
        content: 'Internal Server Error',
        duration: 4
    });
    })
    .finally(() => setEmailLoading(false))
  }
  function updateNotificationPreference(value)
  {
    messageApi.open({
        type: 'loading',
        duration: 0,
        key: 'loading'
    });
    var payload = {
      ID: user.ID,
      ReceiveAlerts: value ? 1 : 0
    }
    dispatch(toggleNotificationsPreference(payload)).unwrap()
    .finally(() => {
      messageApi.destroy('loading');
    })
  }
  
  function handleUpdatePassword()
  {
    messageApi.open({
        type: 'loading',
        content: 'Updating password...',
        duration: 0,
        key: 'loading-new-password'
    });
    setPasswordLoading(true);
    var payload = {
      Current: password.current,
      New: password.new,
      Confirm: password.confirm
    }
    dispatch(updatePassword(payload)).unwrap()
    .then(res => {
      messageApi.destroy('loading-new-password');
      messageApi.open({
          type: 'success',
          content: 'Password changed.',
          duration: 4
      });
    })
    .catch(err => {
      messageApi.destroy('loading-new-password');
      if(err.code === "INVALID_CREDENTIALS"){
        messageApi.open({
          type: 'error',
          content: 'Invalid credentials.',
          duration: 4
      });
      }else{
        messageApi.open({
          type: 'error',
          content: 'Internal Server Error.',
          duration: 4
      });
      }
    })
    .finally(() => setPasswordLoading(false))
  }

  function handleUpdateName()
  {
    messageApi.open({
      type: 'loading',
      content: 'Updating name...',
      duration: 0,
      key: 'loading-new-name'
    });
    setNameLoading(true);
    var payload = {
      FirstName: editedUser.FirstName,
      LastName: editedUser.LastName
    }
    dispatch(updateName(payload)).unwrap()
    .then(res => {
      messageApi.destroy('loading-new-name');
      messageApi.open({
          type: 'success',
          content: 'Name changed.',
          duration: 4
      });
    })
    .catch(err => {
      messageApi.destroy('loading-new-name');
      messageApi.open({
        type: 'error',
        content: 'Internal Server Error.',
        duration: 4
      });
    })
    .finally(() => setNameLoading(false))
  }

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  useEffect(() => {
    if(!user){
      dispatch(getUser());
    }
  }, []);

  return (
    <PageBuilder breadcrumb={["Profile"]} name="profile">
      {contextHolder}
  <Form
    name="complex-form"
    onFinish={null}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
  >
    <Form.Item
      label="Name"
      required
      style={{
        marginBottom: 0,
      }}
    >
      <Form.Item
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50% - 8px)',
        }}
      >
        <Input maxLength={32} placeholder="First" value={editedUser?.FirstName} onChange={e => setEditedUser({...editedUser, FirstName: e.target.value})} />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50% - 8px)',
          margin: '0 8px',
        }}
      >
        <Input maxLength={32} placeholder="Last" value={editedUser?.LastName} onChange={e => setEditedUser({...editedUser, LastName: e.target.value})} />
      </Form.Item>
      {(editedUser?.FirstName !== user?.FirstName || editedUser?.LastName !== user?.LastName) &&
        <Form.Item>
          <Button onClick={handleUpdateName} loading={nameLoading}>Save</Button>
        </Form.Item>
      }
    </Form.Item>
    <Form.Item required label="Email">
      <Space.Compact>
      <Input value={editedUser?.Email} onChange={e => setEditedUser({...editedUser, Email: e.target.value})}/>
      {editedUser?.Email !== user?.Email && 
      <Button type="primary" onClick={handleUpdateEmail} loading={emailLoading}>Save</Button>
      }
      </Space.Compact>
    </Form.Item>
    <Form.Item label="Receive Notifications">
      <Checkbox checked={editedUser?.ReceiveAlerts} onChange={e => updateNotificationPreference(e.target.checked)}/>
    </Form.Item>
    <Card title="Change Password">
        <Form layout="vertical">
          <Form.Item required label="Current password" className="!mb-10">
            <Input type="password" value={password.current} onChange={e => setPassword({...password, current: e.target.value})}/>
          </Form.Item>
          <Form.Item required label="New password" className="!mb-10">
            <Input type="password" value={password.new} onChange={e => setPassword({...password, new: e.target.value})}/>
          </Form.Item>
          <Form.Item required label="Confirm password">
            <Input type="password" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})}/>
          </Form.Item>
          <Form.Item label=" " colon={false} className="!mt-2">
      <Button type="primary" loading={passwordLoading} onClick={handleUpdatePassword}>
        Submit
      </Button>
    </Form.Item>
        </Form>
    </Card>
  </Form>
    </PageBuilder>
  );
};