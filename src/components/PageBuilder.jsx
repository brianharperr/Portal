import React, { useState } from 'react';
import {
  SettingOutlined,
  CommentOutlined,
  LogoutOutlined,
  UserOutlined,
  DollarOutlined,
  ContainerOutlined,
  BookOutlined,
  BarChartOutlined,
  ProjectOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InfoCircleOutlined,
  QuestionOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Button, Dropdown, Space, message, FloatButton, Slider, Badge, Image, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { axiosWithCredentials } from '../configs/axios';
import { useSelector, useDispatch } from 'react-redux';
import { getPortal, getPortalTheme } from '../redux/features/portal.slice';
import { useEffect } from 'react';
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
  const [unread, setUnread] = useState(0);
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

  useEffect(() => {
    axiosWithCredentials.get('/message/unread')
    .then(res => {
        setUnread(res.data);
    })
  }, []);

  return (
    <Layout
    style={{
      minHeight: '100vh'
    }}>
      <Sider style={{ background: portalTheme?.background.primary}} breakpoint='md' collapsedWidth="0" trigger={null} theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu style={{ background: portalTheme?.background.primary, color: portalTheme?.text.secondary}} mode="vertical">
          <Menu.Item icon={<BookOutlined/>} onClick={() => navigate('/')} key='cases' className={`${portalTheme?.hover} ${props.name === 'cases' ? portalTheme?.selected: null}`} style={{ color: (props.name === "cases")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Cases</Menu.Item>
          <Menu.Item icon={<ContainerOutlined />} onClick={() => navigate('/inventory')} key='inventory' className={`${portalTheme?.hover} ${props.name === 'inventory' ? portalTheme?.selected: null}`} style={{ color: (props.name === "inventory")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Inventory</Menu.Item>
          <Menu.Item icon={<BarChartOutlined/>} onClick={() => navigate('/analytics')} key='analytics' className={`${portalTheme?.hover} ${props.name === 'analytics' ? portalTheme?.selected: null}`} style={{ color: (props.name === "analytics")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Analytics</Menu.Item>
          <Menu.Item onClick={() => navigate('/messages')} icon={<Badge size='small' style={{ background: '#009900' }} count={unread}><CommentOutlined /></Badge>} key='messages' className={`${portalTheme?.hover} ${props.name === 'messages' ? portalTheme?.selected: null}`} style={{ color: (props.name === "messages")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Messages</Menu.Item>
          <Menu.Item icon={<SettingOutlined/>} onClick={() => window.location.href = "https://www.familylynk.com"} key='admin' className={`${portalTheme?.hover} ${props.name === 'admin' ? portalTheme?.selected: null}`} style={{ color: (props.name === "admin")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Admin</Menu.Item>  
          <Menu.Item icon={<QuestionOutlined/>} onClick={() => navigate('/support')} key='support' className={`${portalTheme?.hover} ${props.name === 'support' ? portalTheme?.selected: null}`} style={{ color: (props.name === "support")? portalTheme?.text.secondary: portalTheme?.text.primary}}>Support</Menu.Item>  
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className='flex h-full justify-between mr-12'>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {portal?.LogoSource ?
          <img src={portal?.LogoSource} alt="" className='p-2 hover:cursor-pointer' onClick={() => navigate("/")}/>
          :
          <Skeleton.Button size='large' active className='!pt-3'/>
          }
          <Dropdown
            
            menu={{
              items: profileitems,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space direction='vertical' size={16}>
                <Space wrap size={16}>
                  <Avatar style={{ backgroundColor: portalTheme?.background.primary, color: portalTheme?.text.secondary }} size={40}>{localStorage.getItem('Name') ? localStorage.getItem('Name').split(' ')[0].toUpperCase() : "USER"}</Avatar>
                </Space>
              </Space>
            </a>
          </Dropdown>
          </div>
          </Header>
        <Content className='mx-4'>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
            items={props.breadcrumb?.map(x => ({ title: x }))}
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