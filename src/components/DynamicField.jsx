import { DatePicker, Input, Select, Radio, Form, Button } from "antd";
import {
    CheckOutlined,
    EditOutlined
  } from '@ant-design/icons';
import dayjs from "dayjs";
const { TextArea } = Input;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editTask, getCase, uncompleteCase } from "../redux/features/case.slice";
export default function DynamicField({ data, employees, complete })
{
    const dispatch = useDispatch();
    const [task, setTask] = useState(data);
    const selectedCase = useSelector(getCase);
    const [editMode, setEditMode] = useState(data.DateCompleted === null);
    const [loading, setLoading] = useState(false);

    function handleEdit()
    {
        var payload = {
            ID: task.ID,
            CaseID: selectedCase.ID
        }
        dispatch(uncompleteCase(payload)).unwrap()
        .finally(() => setEditMode(false))
    }

    function handleSubmit()
    {
        setLoading(true);
        var payload = {
            ID: task.ID,
            Tasks: task.TaskOptions.map(x => ({ ID: x.ID, Value: x.Value}))
        }
        dispatch(editTask(payload)).unwrap()
        .then(() => setEditMode(false))
        .finally(() => setLoading(false));
    }

    function updateOption(option, value)
    {
        // 1. Make a shallow copy of the items
        let options = [...task.TaskOptions];
        let idx = options.findIndex(x => x.ID === option.ID);
        // 2. Make a shallow copy of the item you want to mutate
        let item = {...options[idx]};
        // 3. Replace the property you're intested in
        if(option.Type === 'Date'){
            item.Value = new dayjs(value);
        }else{
            item.Value = value;
        }
        // 4. Put it back into our array. N.B. we *are* mutating the array here, 
        //    but that's why we made a copy first
        options[idx] = item;
        // 5. Set the state to our new copy
        setTask({...task, TaskOptions: options});
    }
    
    function renderInput(option){
        switch(option.Type){
            case 'Employee':
                return <Select disabled={!editMode} options={employees} onChange={(e) => updateOption(option, e)} value={parseInt(option.Value) || null}/>
            case 'Location':
                return <Select disabled={!editMode} onChange={(e) => updateOption(option, e)} value={parseInt(option.Value) || null} />
            case 'Text':
                return <Input disabled={!editMode} value={option.Value} onChange={(e) => updateOption(option, e.target.value)}/>
            case 'Radio Buttons':
                return (
                <Radio.Group disabled={!editMode} value={option.Value} onChange={(e) => updateOption(option, e.target.value)}>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                </Radio.Group>
                )
            case 'Date':
                return <DatePicker disabled={!editMode} value={dayjs(option.Value)} onChange={(e) => updateOption(option, e)}/>
            case 'Checkbox':
                return <Checkbox disabled={!editMode}  checked={option.Value} onChange={(e) => updateOption(option, e)}/>
            case 'Textarea':
                return <TextArea disabled={!editMode} value={option.Value} onChange={(e) => updateOption(option, e.target.value)}/>
        }
    }

    useEffect(() => {
        setTask(data);
    }, [])
    
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
                {task.CompletedBy &&
                    <p className="text-gray-500 italic font-light text-xs">Completed by {employees?.find(x => x.value === task.CompletedBy).label} {task.DateCompleted ? "(" + new Date(task.DateCompleted).toLocaleString() + ")" : ''}</p>
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