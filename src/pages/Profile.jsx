import { Button, Checkbox, Col, Divider, Form, Input, Row, Typography } from "antd";
import PageBuilder from "../components/PageBuilder";
import { useEffect, useState } from "react";
import { fetchUser, getUser } from "../redux/features/user.slice";
import { useDispatch, useSelector } from "react-redux";

export default function Profile()
{
    const user = useSelector(getUser);
    const dispatch = useDispatch();
    const [data, setData] = useState();

    console.log

    useEffect(() => {
        dispatch(fetchUser())
    }, [])

    useEffect(() => {
        setData(user);
    }, [user]);

    return (
        <PageBuilder name="profile" breadcrumb={["Profile"]}>
            <Form className="mx-auto w-[720px]">
                <Row gutter={10}>
                    <Col md={12} xs={24}>
                        <Form.Item required label="First Name">
                            <Input value={data?.FirstName} onChange={e => setData({...data, FirstName: e.target.value})} />
                        </Form.Item>
                    </Col>
                    <Col md={12} xs={24}>
                        <Form.Item required label="Last Name">
                            <Input value={data?.LastName} onChange={e => setData({...data, LastName: e.target.value})} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item required label="Email">
                    <Input value={data?.Email} onChange={e => setData({...data, Email: e.target.value})} />
                </Form.Item>
                <Form.Item label="Phone Number">
                    <Input value={data?.PhoneNumber} onChange={e => setData({...data, PhoneNumber: e.target.value})} />
                </Form.Item>
                <Divider orientation="left" orientationMargin="0">
                    <Typography.Title level={4}>Change Password</Typography.Title>
                </Divider>
                <Form.Item label="Current Password">
                    <Input type="password"/>
                </Form.Item>
                <Form.Item label="New Password">
                    <Input type="password"/>
                </Form.Item>
                <Form.Item label="Confirm Password">
                    <Input type="password"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary">Reset password</Button>
                </Form.Item>
                <Divider orientation="left" orientationMargin="0">
                    <Typography.Title level={4}>Receive Notifications</Typography.Title>
                </Divider>
                <Form.Item label="Email">
                    <Checkbox/>
                </Form.Item>
                <Form.Item label="SMS">
                    <Checkbox/>
                </Form.Item>
            </Form>
        </PageBuilder>
    )
}