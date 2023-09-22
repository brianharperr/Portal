import { Result, Button } from "antd";

export default function PortalNotFound()
{
    return (
        <Result
            status="404"
            title="Portal not found!"
            subTitle="Please check the url is correct."
            extra={<Button type="primary" onClick={() => window.location.href = "https://familylynk.com"}>Go to FamilyLynk</Button>}
        />
    )
}