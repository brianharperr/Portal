import { DatePicker, Input, Select, Radio, Form, Button } from "antd";
import {
    CheckOutlined,
    EditOutlined
  } from '@ant-design/icons';
import dayjs from "dayjs";
const { TextArea } = Input;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCase, uncompleteCase } from "../redux/features/case.slice";
import { completeTask, editTask, updateOption } from "../redux/features/casetwo.slice";
import LocationSearch from "./LocationSearch";
export default function DynamicField({ data, employees, complete })
{
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(data.DateCompleted === null);
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState(data);

    function handleEdit()
    {
        var payload = {
            ID: data.ID
        }
        dispatch(editTask(payload)).unwrap()
        .finally(() => setEditMode(true))
    }

    function handleSubmit()
    {
        setLoading(true);
        dispatch(completeTask(task)).unwrap()
        .then(() => setEditMode(false))
        .finally(() => setLoading(false));
    }

    function handleUpdateOption(option, value)
    {
        console.log(value);
        setTask({...task, TaskOptions: task.TaskOptions.map(x => x.ID === option.ID ? {...x, Value: value} : x)});
    }
    //<Select suffixIcon={null} onSearch={e => console.log(e)} showSearch disabled={!editMode} onChange={(e) => handleUpdateOption(option, e)} value={parseInt(option.Value) || null} />
    function renderInput(option){
        switch(option.Type){
            case 'Employee':
                return <Select disabled={!editMode} options={employees} onChange={(e) => handleUpdateOption(option, e)} value={parseInt(option.Value) || null}/>
            case 'Location':
                return <LocationSearch disabled={!editMode} value={option.Value} onChange={e => handleUpdateOption(option, e)}/>
            case 'Text':
                return <Input disabled={!editMode} value={option.Value} onChange={(e) => handleUpdateOption(option, e.target.value)}/>
            case 'Radio Buttons':
                return (
                <Radio.Group disabled={!editMode} value={option.Value} onChange={(e) => handleUpdateOption(option, e.target.value)}>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                </Radio.Group>
                )
            case 'Date':
                return <DatePicker format="MM/DD/YYYY" size="small" disabled={!editMode} value={option.Value ? dayjs(option.Value): ""} onChange={(e) => handleUpdateOption(option, e)}/>
            case 'Checkbox':
                return <Checkbox disabled={!editMode}  checked={option.Value} onChange={(e) => handleUpdateOption(option, e)}/>
            case 'Textarea':
                return <TextArea disabled={!editMode} value={option.Value} onChange={(e) => handleUpdateOption(option, e.target.value)}/>
        }
    }

    return (
        <Form layout="veritcal">
        {task.TaskOptions.map(option => {
                return (
                    <Form.Item key={option.ID} label={option.Name}>
                        {renderInput(option)}
                    </Form.Item>
                )
        })}
        {!editMode ? 
            <Form.Item>
                <Button icon={<EditOutlined/>} onClick={handleEdit}>Edit</Button>
                {data.CompletedBy &&
                    <p className="text-gray-500 italic font-light text-xs">Completed by {employees?.find(x => x.value === data.CompletedBy).label} {data.DateCompleted ? "(" + new Date(data.DateCompleted).toLocaleString() + ")" : ''}</p>
                }
            </Form.Item>
            :
            <Form.Item>
                <Button icon={<CheckOutlined/>} onClick={handleSubmit} loading={loading}>Complete</Button>
            </Form.Item>
        }
        </Form>
    )
}