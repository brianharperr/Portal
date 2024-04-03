import PageBuilder from "../../components/admin/PageBuilder";
import { Table, Form, Checkbox, Button, Tag, Tooltip, Popconfirm, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRoles, getRoles, updateDefaultRole, updatePermission, deleteRole } from "../../redux/features/role.slice";
import { getSelectedPortal } from "../../redux/features/admin.portal.slice";

import { deleteHome, fetchHomes, getHomes} from "../../redux/features/home.slice";
import { useEffect, useState } from 'react';
import NewHome from "../../components/admin/modals/NewHome";

import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import EditHome from "../../components/admin/modals/EditHome";

export default function Homes() {

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const portal = useSelector(getSelectedPortal);
  const homes = useSelector(getHomes);
  const [newHome, setNewHome] = useState(false);
  const [editHomeData, setEditHomeData] = useState();
  const [editHome, setEditHome] = useState(false);
  const [defaultIndex, setDefaultIndex] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tableRoles, setTableRoles] = useState([]);
  const columns = [
    {
      title: "Name",
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: "Address",
      dataIndex: 'address',
      key: 'address',
      responsive: ['sm']
    },
    {
      title: "Action",
      dataIndex: 'action',
      key: 'action',
      align: 'right'
    },
  ]

  function handleHomeDelete(id){

    var payload = {
        PortalID: portal.ID,
        ID: id
    }
    dispatch(deleteHome(payload));
}   


  function handleHomeDelete(id){

    messageApi.open({
      type: 'loading',
      content: 'Deleting home..',
      duration: 0,
      key: 'delete-home-loading'
  });

    var payload = {
        PortalID: portal.ID,
        ID: id
    }
    dispatch(deleteHome(payload)).unwrap()
    .then(() => {
      messageApi.destroy('delete-home-loading');
      messageApi.open({
          type: 'success',
          content: 'Home deleted.',
          duration: 4,
          key: 'delete-home-loading'
      });
    })
    .catch((err) => {
      messageApi.destroy('delete-home-loading');
      if(err.code === "HOME_FK_CONSTRAINT"){
        messageApi.open({
            type: 'error',
            content: 'Home is currently used in cases. Cannot be deleted.',
            duration: 4,
            key: 'delete-home-loading'
        });
      }else{
        messageApi.open({
            type: 'error',
            content: 'Internal Server Error.',
            duration: 4,
            key: 'delete-home-loading'
        });
      }
    });
  }   

  useEffect(() => {
      if(portal){
          dispatch(fetchHomes(portal.ID)).unwrap()
          .finally(() => setIsLoading(false));
      }
  }, [portal, dispatch])


  useEffect(() => {

      setTableRoles(
        homes.map(x => ({
          key: x.ID,
          name: x.Name,
          address: x.Address + ", " + x.City + ", " + x.State + " " + x.ZipCode,
          action: (
              <>
              <Button className="mr-2" onClick={() => { setEditHomeData(x); setEditHome(true)}} icon={<EditOutlined/>}/>
              <Popconfirm
              title="Delete this home"
              description="Are you sure you want to delete this home?"
              onConfirm={() => handleHomeDelete(x.ID)}
              okText="Yes"
              cancelText="No"
              >
                <Button danger icon={<DeleteOutlined/>}/>
              </Popconfirm>
              </>
            ),
          data: x,
        }))
      )
  }, [homes]);
  return (
    <PageBuilder breadcrumb={["Configuration", "Homes"]} name="homes">
      {contextHolder}
      <NewHome visible={newHome} close={() => setNewHome(false)}/>
      <EditHome data={editHomeData} visible={editHome} close={() => setEditHome(false)}/>
      <div className="mb-4">
        <Button icon={<PlusOutlined />} onClick={() => setNewHome(true)}>New Home</Button>
      </div>
      <Table 
      loading={isLoading}
      dataSource={tableRoles} 
      columns={columns}
      pagination={false}
      >
      </Table>
    </PageBuilder>
  );
};