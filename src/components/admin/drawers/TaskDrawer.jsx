import { useEffect, useState } from "react"
import { Form, Button, Input, Drawer, message, Table, Typography, Select, Popconfirm, Empty, DatePicker, Radio, Checkbox} from 'antd';
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
import { useDispatch, useSelector } from "react-redux";
import { createOption, deleteOption, swapOptionPositions, updateTaskName, updateOption } from "../../../redux/features/service.slice";
import { getSelectedPortal } from "../../../redux/features/admin.portal.slice";
import { fetchUsers, getUsers } from "../../../redux/features/admin.user.slice";
import { axiosWithAdminCredentials } from "../../../configs/axios";
import EditOption from "../modals/EditOption";

export default function TaskDrawer({ data, close })
{
    const [task, setTask] = useState(data);
    const [options, setOptions] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const users = useSelector(getUsers);
    const [editIndices, setEditIdices] = useState([]);
    const [editOptionModal, setEditOptionModal] = useState(false);
    const [savingIndices, setSavingIdices] = useState([]);
    const portal = useSelector(getSelectedPortal);
    const [selectedOption, setSelectedOption] = useState(null);
    const [locations, setLocations] = useState([]);

    const dispatch = useDispatch();

    function handleNewOption()
    {
      messageApi.open({
        type: 'loading',
        content: 'Creating option...',
        duration: 0,
        key: 'new-option-loading'
    });
      dispatch(createOption({
        PortalID: portal.ID,
        DefaultTaskID: task.ID,
        Type: 'Text',
        Name: 'Untitled Option',
        Value: ''
      })).unwrap()
      .then(() => {
          messageApi.destroy('new-option-loading');
          messageApi.open({
              type: 'success',
              content: 'Option created.',
              duration: 4
          });
      })
      .catch((err) => {
          messageApi.destroy('new-option-loading');
          messageApi.open({
              type: 'error',
              content: 'Internal server error..',
              duration: 4
          });
      });
    }

    function handleDeleteOption(ID)
    {
        messageApi.open({
            type: 'loading',
            content: 'Deleting option...',
            duration: 0,
            key: 'delete-option-loading'
        });
        var payload = {
            ID,
            PortalID: portal.ID
        }
        dispatch(deleteOption(payload)).unwrap()
        .then(() => {
            messageApi.destroy('delete-option-loading');
            messageApi.open({
                type: 'success',
                content: 'Option deleted.',
                duration: 4
            });
        })
        .catch(() => {
            messageApi.destroy('delete-option-loading');
            messageApi.open({
                type: 'error',
                content: 'Internal server error.',
                duration: 4
            });
        })
    }

    function searchLocations(value)
    {
        var payload = {
            portal: portal.ID,
            query: value,
            size: 10
        }
        axiosWithAdminCredentials.get('/search/location/admin', { params: payload })
        .then(res => {
            var spots = res.data.map(x => ({ label: x.Name, value: x.ID }));
            spots.push({
                value: -1,
                label: <b>+ New Location</b>,
            }) 
            setLocations(spots)
        });
    }

    function renderDefaultvalue(x)
    {
        switch(x.Type){
            case "Text":
                return (
                    <Input disabled={!editIndices.includes(x.ID)} value={x.Value} onChange={(e) => editOption(x.ID, "value", e.target.value)}/>
                );
            case "Employee":
                var user = users.find(y => y.ID === parseInt(x.Value));
                return (
                    <p>{user?.FirstName + " " + user?.LastName}</p>
                );
            case "Location":
                var loc = locations.find(y => y.value === parseInt(x.Value));

                return (
                    <p>{loc?.label}</p>
                );
            case "Date":
                return (
                    <DatePicker disabled={!editIndices.includes(x.ID)} showTime onChange={(e) => editOption(x.ID, "value", e)}/> 
                );
            case "Radio Buttons":
                return (
                    <Radio.Group disabled={!editIndices.includes(x.ID)} value={x.Value} onChange={(e) => editOption(x.ID, "value", e.target.value)}>
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                    </Radio.Group>
                );
            case "Checkbox":
                return (
                    <Checkbox disabled={!editIndices.includes(x.ID)} onChange={(e) => editOption(x.ID, "value", e)}/>
                );
            case "Textarea":
                return (
                    <TextArea disabled={!editIndices.includes(x.ID)} value={x.Value} onChange={(e) => editOption(x.ID, "value", e.target.value)}/>
                );
        }
    }

    function editOption(ID, type, value)
    {
        let copy = [...options];
        let copyIndex = copy.findIndex(x => x.data.ID === ID);
        let copyItem = {...copy[copyIndex]};
        switch(type.toLowerCase()){
            case "name":
                copyItem.data = {...copyItem.data, Name: value};
                break;
            case "type":
                copyItem.data = {...copyItem.data, Type: value};
                break;
            case "value":
                copyItem.data = {...copyItem.data, Value: value};
                break;
        }
        copy[copyIndex] = copyItem;
        setOptions(copy);
    }

    function handleNameUpdate()
    {
        messageApi.open({
            type: 'loading',
            content: 'Updating task name...',
            duration: 0,
            key: 'update-taskname-loading'
        });
        var payload = {
            ID: task.ID,
            Name: task.Name,
            PortalID: portal.ID
        }
        dispatch(updateTaskName(payload)).unwrap()
        .then(() => {
            messageApi.destroy('update-taskname-loading');
            messageApi.open({
                type: 'success',
                content: 'Task updated.',
                duration: 4
            });
        })
        .catch(() => {
            messageApi.destroy('update-taskname-loading');
            messageApi.open({
                type: 'error',
                content: 'Internal Server Error.',
                duration: 4
            });
        })
    }

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            var payload = {
                DefaultTaskID: task.ID,
                PortalID: portal.ID,
                ID: active.id,
                Position: over.data.current.sortable.index
            }
            dispatch(swapOptionPositions(payload))
            setOptions((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                return arrayMove(previous, activeIndex, overIndex);
            });
        }
    };

    useEffect(() => {
        if(data){
            setTask(data);
            setOptions(data?.DefaultTaskOptions.map(x => ({ key: x.ID, name: x.Name, data: x})));
        }
    }, [data])

    useEffect(() => {
        searchLocations();
    }, []);

    useEffect(() => {
        dispatch(fetchUsers(portal.ID));
    }, [portal]);

    return (
        <Drawer
        size="large"
            title={task?.Name}
            onClose={close}
            open={data !== undefined}
        >
            {contextHolder}
            {selectedOption && <EditOption visible={editOptionModal} close={() => setEditOptionModal(false)} data={selectedOption}/>}
            <Form layout="vertical">
                <Form.Item label="Name" className="!mb-2">
                    <Input value={task?.Name} onChange={e => setTask({...task, Name: e.target.value})}/>
                </Form.Item>
                {task?.Name !== data?.Name &&
                <Form.Item>
                    <Button type="primary" onClick={() => handleNameUpdate()}>Save</Button>
                </Form.Item>
                }
            </Form>
            {data?.DefaultTaskOptions && 
            <>
            <Title level={5}>Options</Title>
            <Button className="mb-2" onClick={() => handleNewOption()}>New Option</Button>
            {options?.length > 0 ?
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext
                // rowKey array
                items={options.map(i => i.key)}
                strategy={verticalListSortingStrategy}
            >
            <Table columns={[
                {
                    key: 'sort',
                },
                {
                    title: 'Name',
                    key: 'name',
                    render: (x) => (
                        <p>{x.data.Name}</p>
                    )
                },
                {
                    title: 'Type',
                    key: 'type',
                    render: (x) => (
                        <p>{x.data.Type}</p>
                    )
                },
                {
                    title: 'Default Value',
                    key: 'value',
                    render: (x) => (
                        <>
                        {renderDefaultvalue(x.data)}
                        </>
                    )
                },
                {
                    title: "Action",
                    dataIndex: 'data',
                    align: 'right',
                    render: (x) => (
                        <>
                        {editIndices.includes(x.ID) ?
                            <Button.Group>
                            <Button onClick={() => saveOption(x)} loading={savingIndices.includes(x.ID)}>Save</Button>
                            <Button danger onClick={() => cancelOption(x)}>Cancel</Button>
                            </Button.Group>
                        :
                            <Button.Group>
                            <Button onClick={() => {setSelectedOption(x); setEditOptionModal(true)}}>Edit</Button>
                            <Popconfirm title="Delete the option" description="Are you sure you want to delete this option?" okText="Yes" cancelText="No" onConfirm={() => handleDeleteOption(x.ID)}><Button danger>Delete</Button></Popconfirm>
                            </Button.Group>
                        }
                        </>
                    )
                }
            ]}
            components={{
                body: {
                    row: Row,
                },
                }}
                rowKey="key"
            dataSource={options}
            pagination={false}
            />
            </SortableContext>
            </DndContext>
            :
            <Empty description="No options"></Empty>
            }
        </>
        }
        </Drawer>
    )
}