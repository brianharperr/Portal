import { useParams } from "react-router-dom"
import PageBuilder2 from "../../components/admin/PageBuilder2";
import { Button, Dropdown, Menu, MenuButton, MenuItem, Stack, Tab, TabList, Tabs } from "@mui/joy";
// getItem('About', 'about', <InfoCircleOutlined />, () => navigate("/")),
// getItem('Settings', 'settings', <SettingOutlined ref={ref2} />, () => navigate("/settings")),
// getItem('Configuration', 'sub1', <ProjectOutlined ref={ref3} />, null, [
//   getItem('Services', 'services', null, () => navigate("/services")),
//   getItem('Homes', 'homes', null, () => navigate("/homes")),
//   getItem('Roles', 'roles', null, () => navigate("/roles")),
// ]),
// getItem('Users', 'users', <UserOutlined ref={ref4}/>, () => navigate("/users")),
// getItem('Billing', 'billing', <DollarOutlined ref={ref5}/>, () => navigate("/billing")),
// getItem('Support', 'support', <CommentOutlined ref={ref6}/>, () => navigate("/support")),
// ];
export default function PortalView()
{
    const { name } = useParams();
    
    return (
        <PageBuilder2 portalView>
        </PageBuilder2>
    )
}