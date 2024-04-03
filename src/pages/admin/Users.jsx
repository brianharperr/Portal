import { Badge, message, Select, Dropdown, Table, Button, Popconfirm } from "antd";
import PageBuilder from "../../components/admin/PageBuilder";
import { useEffect, useState } from 'react';
import { fetchUsers, getRoles, getUsers, updateRole, updateActiveStatus, deleteUser } from "../../redux/features/admin.user.slice";
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedPortal } from "../../redux/features/admin.portal.slice";
import { UserAddOutlined } from '@ant-design/icons';
import InviteUsers from "../../components/admin/modals/InviteUsers";

export default function Users() {

  const dispatch = useDispatch();
  const portal = useSelector(getSelectedPortal);
  const users = useSelector(getUsers);
  const roles = useSelector(getRoles);
  const [inviteModal, setInviteModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
    function handleUserRoleUpdate(user, id)
    {
      messageApi.open({
        type: 'loading',
        content: 'Updating Role..',
        duration: 0,
        key: 'loading-new-role'
      });
        var payload = {
            UserID: user,
            RoleID: id,
            PortalID: portal.ID
        }

        dispatch(updateRole(payload)).unwrap()
        .then(() => {
          messageApi.destroy('loading-new-role');
            messageApi.open({
                type: 'success',
                content: 'Role updated.',
                duration: 4,
            });
        })
        .catch((e) => {
          messageApi.destroy('loading-new-role');
          messageApi.open({
              type: 'error',
              content: 'Internal Server Error. Please try again later.',
              duration: 4,
          });
        })

    }

    function handleUserDelete(idx)
    {
      messageApi.open({
        type: 'loading',
        content: 'Deleting User..',
        duration: 0,
        key: 'loading-deleting-user'
      });
        var payload = {
            UserID: idx,
            PortalID: portal.ID
        }

        dispatch(deleteUser(payload)).unwrap()
        .then((res) => {
          messageApi.destroy('loading-deleting-user');
          messageApi.open({
              type: 'success',
              content: 'User deleted.',
              duration: 4,
          });
        })
        .catch((err) => {
          messageApi.destroy('loading-deleting-user');
          if(err.code === "USER_USED"){
            messageApi.open({
              type: 'error',
              content: 'User has cases assigned to them. Cannot remove at this time.',
              duration: 4,
          });
          }else{
            messageApi.open({
              type: 'error',
              content: 'Internal Server Error. Please try again later.',
              duration: 4,
          });
          }
        })
    }

    function handleToggleActivated(ID)
    {

        var activeStatus = users.find(x => x.ID === ID).Activated;

        var payload = {
            UserID: ID,
            PortalID: portal.ID,
            ToggleTo: activeStatus === 1 ? 0 : 1
        }

        dispatch(updateActiveStatus(payload));
    }

    const roleDropdown = (user, id) => {

      var options = roles?.filter(x => x.ID !== 1).map(x => ({
            value: x.ID,
            label: x.Name
          })
      );

      return (
        <Select disabled={id === 1} className="w-full" value={id === 1 ? "Admin" : id} options={options} onChange={(x) => handleUserRoleUpdate(user, x)}/>
      )
    }

    const actionDropdown = (user) => {
      return (
        <div className="gap-2">
          <Button onClick={() => handleToggleActivated(user.ID)} className="mr-1" size="small">{user.Activated === 1 ? 'Deactivate' : 'Activate'}</Button>
          <Popconfirm placement="topRight" title="Delete user" description="Are you sure you want to delete this user?" okText="Yes" cancelText="No" onConfirm={() => handleUserDelete(user.ID)}><Button danger size="small">Remove</Button></Popconfirm>
        </div>
      )
    }

    const columns = [
        {
            title: "Full name",
            dataIndex: "Name",
            key: 'name',
        },
        {
            title: "Email",
            dataIndex: "Email",
            key: 'email',
            responsive: ['lg'],
        },
        {
            title: "Role",
            dataIndex: "Role",
            key: 'role',
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: 'status',
        },
        {
            title: "Date Joined",
            dataIndex: "DateJoined",
            key: 'datejoined',
            responsive: ['sm']
        },
        {
            title: "",
            dataIndex: "Action",
            key: 'action',
        }
    ]

    useEffect(() => {
      if(portal){
      dispatch(fetchUsers(portal.ID));
      }
    }, [portal]);

    useEffect(() => {
      if(users){
        setTableData(
        users.map(x => ({
          Name: x.FirstName + " " + x.LastName,
          Email: x.Email,
          Role: roleDropdown(x.ID, x.Role.ID),
          Status: x.Activated === 1 ? <Badge status="success" text="Active"/> : <Badge status="error" text="Inactive"/>,
          DateJoined: new Date(x.DateCreated).toLocaleDateString(),
          Action: x.Role.ID !== 1 ? actionDropdown(x) : null
        }))
        )
      }
    }, [users])
  return (
    <PageBuilder breadcrumb={["Users"]} name="users">
          {contextHolder}
          
          <InviteUsers close={() => setInviteModal(false)} visible={inviteModal}/>
          <Button icon={<UserAddOutlined />} className="float-right m-2" onClick={() => setInviteModal(true)}>Invite</Button>
          <Table dataSource={tableData} columns={columns}/>
    </PageBuilder>
  );
};