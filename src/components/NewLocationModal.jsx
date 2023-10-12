import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import States from "../data/States";
import { axiosWithCredentials } from "../configs/axios";

export default function NewLocationModal({ open, close, onResult })
{
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        Name: "",
        Address: "",
        City: "",
        State: "",
        ZipCode: ""
    })

    function handleNewLocation()
    {
        setLoading(true);
        var payload = {
            ...form,
            Country: "US"
        }
        axiosWithCredentials.post('/location', payload)
        .then((res) => {
            onResult(res.data);
            close();
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        setForm({
            Name: "",
            Address: "",
            City: "",
            State: "",
            Zipcode: ""
        })
        setLoading(false);
    }, [open]);

    return (
        <Modal title="New Location" open={open} confirmLoading={loading} onOk={handleNewLocation} onCancel={close}>
            <Form layout="vertical">
                <Form.Item label="Name">
                    <Input value={form.Name} onChange={e => setForm({...form, Name: e.target.value})}/>
                </Form.Item>
                <Form.Item label="Address">
                    <Input value={form.Address} onChange={e => setForm({...form, Address: e.target.value})}/>
                </Form.Item>
                <Form.Item label="City">
                    <Input value={form.City} onChange={e => setForm({...form, City: e.target.value})}/>
                </Form.Item>
                <Form.Item label="State">
                    <Select value={form.State} filterOption={(inputValue, option) => option.label.toLowerCase().includes(inputValue.toLowerCase())} showSearch options={States} onChange={e => setForm({...form, State: e})}/>
                </Form.Item>
                <Form.Item label="Zipcode">
                    <Input value={form.ZipCode} onChange={e => setForm({...form, ZipCode: e.target.value})}/>
                </Form.Item>
                <Form.Item label="Country">
                    <Select value={"United States of America"} disabled/>
                </Form.Item>
            </Form>
        </Modal>
    )
}