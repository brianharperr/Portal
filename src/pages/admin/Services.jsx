import PageBuilder from "../../components/admin/PageBuilder";
import { List, Card, Button, Input, Typography, message, Tooltip, Drawer, Table, Select, Popconfirm, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getSelectedPortal } from "../../redux/features/admin.portal.slice";
import { useSelector, useDispatch } from 'react-redux';
import { createOption, deleteDefaultTask, deleteService, duplicateService, fetchServices, getServices, swapTaskPositions, updateDescription } from "../../redux/features/service.slice";
const { Meta } = Card;
import React from 'react';
const { Title} = Typography;
import { EditOutlined, DeleteOutlined, PlusOutlined, MenuOutlined, SwitcherOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Form from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { render } from "react-dom";
import NewService from "../../components/admin/modals/NewService";
import NewTask from "../../components/admin/modals/NewTask";
import ServiceDrawer from "../../components/admin/drawers/ServiceDrawer";

export default function Services() {

  const dispatch = useDispatch();
  const portal = useSelector(getSelectedPortal);
  const services = useSelector(getServices);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
    const [selectedService, setSelectedService] = useState();
    const [tasks, setTasks] = useState([]);
    const [options, setOptions] = useState([]);
    const [newService, setNewService] = useState(false);
    const [selectedTask, setSelectedTask] = useState();
    const [newTask, setNewTask] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function handleDuplicate(id)
    {
        messageApi.open({
            type: 'loading',
            content: 'Duplicating service...',
            duration: 0,
            key: 'duplicate-service-loading'
        });
        dispatch(duplicateService({ ID: id, PortalID: portal.ID })).unwrap()
        .then(() => {
            messageApi.destroy('duplicate-service-loading');
            messageApi.open({
                type: 'success',
                content: 'Service duplicated.',
                duration: 4
            });
        })
        .catch((err) => {
            messageApi.destroy('duplicate-service-loading');
            messageApi.open({
                type: 'error',
                content: 'Internal server error..',
                duration: 4
            });
        });
    }


    function handleDelete(id)
    {
        messageApi.open({
            type: 'loading',
            content: 'Deleting service...',
            duration: 0,
            key: 'delete-service-loading'
        });
        dispatch(deleteService({ ID: id, PortalID: portal.ID })).unwrap()
        .then(() => {
            messageApi.destroy('delete-service-loading');
            messageApi.open({
                type: 'success',
                content: 'Service deleted.',
                duration: 4
            });
        })
        .catch((err) => {
            messageApi.destroy('delete-service-loading');
            messageApi.open({
                type: 'error',
                content: err === "SERVICE_USED" ? 'Service in use by cases.' : 'Internal server error..',
                duration: 4
            });
        });
    }

  useEffect(() => {
      if(portal){
          dispatch(fetchServices(portal.ID)).unwrap()
          .finally(() => setIsLoading(false));
      }
  }, [portal]);

  useEffect(() => {
    if(selectedService){
        setSelectedService(services.find(x => x.ID === selectedService.ID));
    }
  }, [services]);

  useEffect(() => {
      if(selectedService){
            setTasks(selectedService?.DefaultTasks.map(x => ({ key: x.ID, name: x.Name, data: x})));
      }
      if(selectedTask){
        setSelectedTask(selectedService?.DefaultTasks.find(x => x.ID === selectedTask.ID));
      }
  }, [selectedService])

    useEffect(() => {
      if(selectedTask){
            setOptions(selectedTask?.DefaultTaskOptions.map(x => ({ key: x.ID, name: x.Name, data: x})));
      }
  }, [selectedTask])

  const Row = ({ children, ...props }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props['data-row-key'],
    });
    const style = {
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        },
      ),
      transition,
      ...(isDragging
        ? {
            position: 'relative',
            zIndex: 9999,
          }
        : {}),
    };
    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(children, (child) => {
          if (child.key === 'sort') {
            return React.cloneElement(child, {
              children: (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{
                    touchAction: 'none',
                    cursor: 'move',
                  }}
                  {...listeners}
                />
              ),
            });
          }
          return child;
        })}
      </tr>
    );
  };
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
        var payload = {
            ServiceID: selectedService.ID,
            PortalID: portal.ID,
            ID: active.id,
            Position: over.data.current.sortable.index
        }
        dispatch(swapTaskPositions(payload))
      setTasks((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };
  return (
    <PageBuilder breadcrumb={["Configuration", "Services"]} name="services">
        {contextHolder}
        <NewTask data={selectedService} visible={newTask} close={() => setNewTask(false)}/>
        <NewService visible={newService} close={() => setNewService(false)}/>
      <div className="mb-4">
      <Button icon={<PlusOutlined/>} onClick={() => setNewService(true)}>New Service</Button>
      </div>
      <ServiceDrawer data={selectedService} close={() => setSelectedService()}/>
      <Spin spinning={isLoading}>
      <List 
      grid={{ gutter: 16 }}
      dataSource={services}
      renderItem={(item) => (
        <List.Item>
          <Card className="!min-w-[250px]" title={item.Name} actions={[<Tooltip title="Edit"><EditOutlined key="edit" onClick={() => setSelectedService(item)} /></Tooltip>, <Tooltip title="Duplicate"><SwitcherOutlined key="duplicate" onClick={() => handleDuplicate(item.ID)} /></Tooltip>, <Popconfirm title="Delete the service" description="Are you sure you want to delete this service?" okText="Yes" cancelText="No" onConfirm={() => handleDelete(item.ID)}><Tooltip title="Delete"><DeleteOutlined key="delete" /></Tooltip></Popconfirm>]}>
            {item.Description ?? "No Description."}
          </Card>
        </List.Item>
      )}
      />
      </Spin>
    </PageBuilder>
  );
};