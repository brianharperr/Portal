import { useEffect, useState } from "react"
import { Form, Button, Input, Drawer, Table, Typography, message, Popconfirm, Empty } from 'antd';
const { Title } = Typography;
const { TextArea } = Input;
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Row } from "../subcomponents/Row";
import TaskDrawer from "./TaskDrawer";
import NewTask from "../modals/NewTask";
import { updateName, updateDescription, swapTaskPositions, deleteDefaultTask } from "../../../redux/features/service.slice";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedPortal } from "../../../redux/features/admin.portal.slice";

export default function ServiceDrawer({ data, close })
{
    const [service, setService] = useState(data);
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [selectedTask, setSelectedTask] = useState();
    const [newTask, setNewTask] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    const [tasks, setTasks] = useState([]);

    const [dataSource, setDataSource] = useState([
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address:
            'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
        },
      ]);

      const columns = [
        {
            key: 'sort',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'left'
        },
        {
            title: "Action",
            align: 'right',
            render: (x) => (
                <>
                <Button className="mr-2" onClick={() => setSelectedTask(x.data)}>Edit</Button>
                <Popconfirm title="Delete the task" description="Are you sure you want to delete this task?" okText="Yes" cancelText="No" onConfirm={() => handleTaskDelete(x.data.ID)}><Button danger>Delete</Button></Popconfirm>
                </>
            )
        }
    ];

    function handleUpdateName()
    {
        messageApi.open({
            type: 'loading',
            content: 'Updating name.',
            key: 'update-name-loading',
            duration: 0
        });
        var payload = {
            ID: service.ID,
            Name: service.Name,
            Description: service.Description,
            PortalID: portal.ID
        }

        dispatch(updateName(payload)).unwrap()
        .then(() => {
            messageApi.destroy('update-name-loading');
            messageApi.open({
                type: 'success',
                content: 'Name updated.',
                duration: 4
            });
        })
        .catch((err) => {
            messageApi.destroy('update-name-loading');
            if(err === "DUP_SERVICE_NAME")
            {
                messageApi.open({
                    type: 'error',
                    content: 'A service by that name already exists.',
                    duration: 4
                });
            }else{
                messageApi.open({
                    type: 'error',
                    content: 'Internal server error.',
                    duration: 4
                });
            }
        })
    }

    function handleUpdateDescription()
    {
        messageApi.open({
            type: 'loading',
            content: 'Updating description.',
            key: 'update-description-loading',
            duration: 0
        });

        var payload = {
            ID: service.ID,
            Description: service.Description,
            PortalID: portal.ID
        }
        dispatch(updateDescription(payload)).unwrap()
        .then(() => {
            messageApi.destroy('update-description-loading');
            messageApi.open({
                type: 'success',
                content: 'Description updated.',
                duration: 4
            });
        })
        .catch((err) => {
            messageApi.destroy('update-description-loading');
            messageApi.open({
                type: 'error',
                content: 'Internal server error.',
                duration: 4
            });
        })
    }

    function handleTaskDelete(id)
    {
        var payload = {
            ID: id,
            PortalID: portal.ID
        }
        dispatch(deleteDefaultTask(payload));
    }

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            var payload = {
                ServiceID: service.ID,
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

    useEffect(() => {
        setService(data);
        setTasks(data?.DefaultTasks.map(x => ({ key: x.ID, name: x.Name, data: x})));
        if(selectedTask){
            setSelectedTask(data?.DefaultTasks.find(x => x.ID === selectedTask.ID));
        }
    }, [data]);

    return (
        <Drawer size="large" title={service?.Name} onClose={close} open={data !== undefined}>
            {contextHolder}
            <NewTask visible={newTask} data={service} close={() => setNewTask(false)}/>
            <Form layout="vertical">
                <Form.Item className="!mb-2" label="Name">
                    <Input value={service?.Name} maxLength={45} onChange={e => setService({...service, Name: e.target.value})}/>
                </Form.Item>
                {data?.Name !== service?.Name &&
                <Form.Item className="!mb-2">
                    <Button type="primary" onClick={() => handleUpdateName()}>Save</Button>
                </Form.Item>
                }
                <Form.Item className="!mb-2" label="Description" >
                    <TextArea value={service?.Description} maxLength={255} onChange={e => setService({...service, Description: e.target.value})}/>
                </Form.Item>
                {data?.Description !== service?.Description && <Form.Item>
                    <Button type="primary" onClick={() => handleUpdateDescription()}>Save</Button>
                </Form.Item>
                }
            </Form>
            <Title level={5}>Tasks</Title>
            <Button className="mb-2" onClick={() => setNewTask(true)}>New Task</Button>
            {tasks?.length > 0 ?
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                // rowKey array
                items={tasks?.map(i => i.key)}
                strategy={verticalListSortingStrategy}
                >
                <Table
                components={{
                    body: {
                    row: Row,
                    },
                }}
                rowKey="key"
                dataSource={tasks}
                pagination={false}
                columns={columns}
                />
                </SortableContext>
            </DndContext>
            :
            <Empty description={<span>No Tasks</span>}>
            </Empty>
        }
        <TaskDrawer data={selectedTask} close={() => setSelectedTask()}/>
        </Drawer>
    )
}