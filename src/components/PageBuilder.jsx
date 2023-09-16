import React, { useState } from 'react';
import {
  SettingOutlined,
  CommentOutlined,
  LogoutOutlined,
  UserOutlined,
  DollarOutlined,
  AppstoreOutlined,
  PlusOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Space, message, FloatButton, Slider, Badge, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { axiosWithCredentials } from '../configs/axios';
import { useSelector, useDispatch } from 'react-redux';
import { getPortal, getPortalTheme } from '../redux/features/portal.slice';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, onClick, children) {
  return {
    key,
    icon,
    children,
    label,
    onClick
  };
}
export default function PageBuilder(props) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const portal = useSelector(getPortal);
  const portalTheme = useSelector(getPortalTheme);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = [
    getItem('Cases', 'cases', <InfoCircleOutlined />, () => navigate("/")),
    getItem('Inventory', 'inventory', <SettingOutlined />, () => navigate("/inventory")),
    getItem('Analytics', 'analytics', <ProjectOutlined />, () => navigate('/analytics')),
    getItem('Messages', 'messages', <UserOutlined />, () => navigate("/users")),
    getItem('Admin', 'admin', <DollarOutlined />, () => navigate("/billing")),
    getItem('Support', 'support', <CommentOutlined />, () => navigate("/support")),
  ];

  const profileitems = [
    getItem('Profile', '1', <UserOutlined />, () => navigate("/profile")),
    getItem('Logout', '2', <LogoutOutlined />, () => logout()),
  ];
  return (
    <Layout
    style={{
      minHeight: '100vh'
    }}>
      <Sider style={{ background: portalTheme?.background.primary}} breakpoint='md' collapsedWidth="0" theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu style={{ background: portalTheme?.background.primary, color: portalTheme?.text.secondary}} mode="vertical">
          <Menu.Item icon={<InfoCircleOutlined/>} key='cases' className={`${portalTheme?.hover} ${props.name === 'cases' ? portalTheme?.selected: null}`} style={{ color: (props.name === "cases")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Cases</Menu.Item>
          <Menu.Item key='inventory' className={`${portalTheme?.hover} ${props.name === 'inventory' ? portalTheme?.selected: null}`} style={{ color: (props.name === "inventory")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Inventory</Menu.Item>
          <Menu.Item key='analytics' className={`${portalTheme?.hover} ${props.name === 'analytics' ? portalTheme?.selected: null}`} style={{ color: (props.name === "analytics")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Analytics</Menu.Item>
          <Menu.Item icon={<Badge size='small' style={{ background: '#009900' }} count={1}><CommentOutlined /></Badge>} key='messages' className={`${portalTheme?.hover} ${props.name === 'messages' ? portalTheme?.selected: null}`} style={{ color: (props.name === "messages")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Messages</Menu.Item>
          <Menu.Item key='admin' className={`${portalTheme?.hover} ${props.name === 'admin' ? portalTheme?.selected: null}`} style={{ color: (props.name === "admin")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Admin</Menu.Item>  
          <Menu.Item key='support' className={`${portalTheme?.hover} ${props.name === 'support' ? portalTheme?.selected: null}`} style={{ color: (props.name === "support")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Support</Menu.Item>  
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className='flex h-full justify-between mx-12'>
          <img src={portal?.LogoSource} alt="" className='p-2'/>
          <Dropdown
            
            menu={{
              items: profileitems,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space direction='vertical' size={16}>
                <Space wrap size={16}>
                  <Avatar style={{ backgroundColor: portalTheme?.background.primary, color: portalTheme?.text.secondary }} size={40}>{localStorage.getItem('name') ? localStorage.getItem('name').split(' ')[0].toUpperCase() : "USER"}</Avatar>
                </Space>
              </Space>
            </a>
          </Dropdown>
          </div>
          </Header>
        <Content className='mt-8 mx-4'>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          />
          {props.children}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          FamilyLynk ©2023
        </Footer>
      </Layout>
    </Layout>
  )
};