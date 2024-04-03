import PageBuilder from "../../components/admin/PageBuilder";
import { Table, Form, Checkbox, Button, Tag, Tooltip, Popconfirm, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRoles, getRoles, updateDefaultRole, updatePermission, deleteRole } from "../../redux/features/role.slice";
import { getSelectedPortal } from "../../redux/features/admin.portal.slice";
import { useEffect, useState } from 'react';
import {
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import NewRole from "../../components/admin/modals/NewRole";
export default function Roles() {

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const portal = useSelector(getSelectedPortal);
  const roles = useSelector(getRoles);
  const [newRole, setNewRole] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tableRoles, setTableRoles] = useState([]);
  const columns = [
    {
      title: "Role",
      dataIndex: 'role',
      key: 'role'
    },
  ]

  function handleNewDefault(newID)
  {
      var payload = {
          PortalID: portal.ID,
          ID: newID
      }

      dispatch(updateDefaultRole(payload));
  }

  function updatePermisisons(payload)
  {
      dispatch(updatePermission(payload));
  }

  function handleDeleteRole(id)
  {
    setDeleteLoading(true);
        messageApi.open({
          type: 'loading',
          content: 'Deleting role',
          duration: 0,
          key: 'role-delete-loading'
        });
      var payload = {
          PortalID: portal.ID,
          RoleID: id
      }
      dispatch(deleteRole(payload)).unwrap()
      .then(() => {
        messageApi.destroy('role-delete-loading');
        messageApi.open({
          type: 'success',
          content: 'Role deleted.',
          duration: 4,
        });
      })
      .catch(() => {
        messageApi.destroy('role-delete-loading');
        messageApi.open({
          type: 'error',
          content: 'Internal Server Error. Please try again later.',
          duration: 4,
        });
      })
      .finally(() => setDeleteLoading(false));
  }

  useEffect(() => {
      if(portal){
          dispatch(fetchRoles(portal.ID)).unwrap()
          .finally(() => setIsLoading(false));
      }
  }, [portal, dispatch])

  useEffect(() => {
    var defaultRole = roles.find(x => x.PortalID && x.Default)?.ID;

    if(!defaultRole){
        defaultRole = 2;
    }

    setTableRoles(
      roles.map(x => ({
        key: x.ID,
        role: <span>{x.Name} {x.ID === defaultRole &&<Tag>Default</Tag>}</span>,
        data: x,
      }))
    )
}, [roles]);
  return (
    <PageBuilder breadcrumb={["Configuration", "Roles"]} name="roles">
      {contextHolder}
      <NewRole visible={newRole} close={() => setNewRole(false)}/>
      <div className="mb-4">
        <Button icon={<PlusOutlined />} onClick={() => setNewRole(true)}>New Role</Button>
      </div>
      <Table 
      loading={isLoading}
      dataSource={tableRoles} 
      columns={columns}
      pagination={false}
      expandable={{
        expandedRowRender: (role) => (
          <Form>
            <Form.Item className="!mb-0" label="Create Case">
              <Checkbox checked={role.data.Permissions.create_case} disabled={role.data.ID === 1 || role.data.ID === 2} onChange={e => updatePermisisons({...role.data.Permissions, create_case: e.target.checked ? 1: 0})}/>
            </Form.Item>
            <Form.Item className="!mb-0" label="Update Case">
              <Checkbox checked={role.data.Permissions.update_case} disabled={role.data.ID === 1 || role.data.ID === 2} onChange={e => updatePermisisons({...role.data.Permissions, create_case: e.target.checked ? 1: 0})}/>
            </Form.Item>
            <Form.Item className="!mb-0" label="Delete Case">
              <Checkbox checked={role.data.Permissions.delete_case} disabled={role.data.ID === 1 || role.data.ID === 2} onChange={e => updatePermisisons({...role.data.Permissions, create_case: e.target.checked ? 1: 0})}/>
            </Form.Item>
            <Form.Item className="!mb-0" label="Access Inventory">
              <Checkbox checked={role.data.Permissions.read_inventory} disabled={role.data.ID === 1 || role.data.ID === 2} onChange={e => updatePermisisons({...role.data.Permissions, create_case: e.target.checked ? 1: 0})}/>
            </Form.Item>
            <Form.Item className="!mb-0" label="Update Inventory">
              <Checkbox checked={role.data.Permissions.update_inventory} disabled={role.data.ID === 1 || role.data.ID === 2} onChange={e => updatePermisisons({...role.data.Permissions, create_case: e.target.checked ? 1: 0})}/>
            </Form.Item>
            <Form.Item className="!mb-0" label="Access Analytics">
              <Checkbox checked={role.data.Permissions.read_analytics} disabled={role.data.ID === 1 || role.data.ID === 2} onChange={e => updatePermisisons({...role.data.Permissions, create_case: e.target.checked ? 1: 0})}/>
            </Form.Item>
            <Form.Item>
              {role.data.ID !== 1 && <Button onClick={() => handleNewDefault(role.data.ID)}>Set as Default</Button>}
              {role.data.ID !== 1 && role.data.ID !== 2 && <Popconfirm title="Delete the role" onConfirm={() => handleDeleteRole(role.data.ID)} description="Are you sure you want to delete this role?" okText="Yes" cancelText="No"><Tooltip title="Delete"><Button className="ml-2" danger icon={<DeleteOutlined />}></Button></Tooltip></Popconfirm>}
            </Form.Item>
          </Form>
        )
      }}
      >
      </Table>
    </PageBuilder>
  );
};