import React, { useEffect, useRef, useState } from 'react';
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
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Space, message, FloatButton, Tour } from 'antd';
import { useNavigate } from 'react-router-dom';
import { axiosWithAdminCredentials } from '../../configs/axios';
import { useSelector, useDispatch } from 'react-redux';
import { getPortals, getSelectedPortal, getTheme, select } from '../../redux/features/admin.portal.slice';
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
  const [tour, setTour] = useState(sessionStorage.getItem('first_time') === "true");
  const portals = useSelector(getPortals);
  const portalTheme = useSelector(getTheme);
  const dispatch = useDispatch();
  const selectedPortal = useSelector(getSelectedPortal);
  const [messageApi, contextHolder] = message.useMessage();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const steps = [
    {
      title: 'Welcome to FamilyLynk!',
      description: 'This is your ad.',
      target: () => ref1.current,
    },
    {
      title: 'Settings',
      description: 'Update your portal\'s settings and configurations.',
      target: () => ref2.current,
    },
    {
      title: 'Configuration',
      description: 'Setup your homes, services, and user roles.',
      target: () => ref3.current,
    },
    {
      title: 'Users',
      description: 'Invite and manage your portal\'s users.',
      target: () => ref4.current,
    },
    {
      title: 'Billing',
      description: 'Change your payment method, update your subscription plan here.',
      target: () => ref5.current,
    },
    {
      title: 'Support',
      description: 'Experience an issue with our platform? Get help with it on the support page',
      target: () => ref6.current,
    },
  ];

    function logout(){
        axiosWithAdminCredentials('/auth/logout')
        .catch(err => {
            console.log(err);
        })
        .finally(res => {
            sessionStorage.clear('access_token');
            sessionStorage.clear('refresh_token');
            sessionStorage.clear('logged_in');
            localStorage.clear('name');
            window.location.href = "/";
        })
    }
    function goToStripeBilling()
    {
        var payload = {
            ReturnURL: window.location.href
        }
        messageApi.open({
            type: 'loading',
            content: 'Redirecting to billing...',
            key: 'loading-billing-portal',
            duration: 0,
        });
        axiosWithAdminCredentials.post('/stripe/billing-portal', payload)
        .then(res => {
            window.location.href = res.data;
        })
        .catch((err) => {
            messageApi.destroy('loading-billing-portal');
            messageApi.open({
                type: 'error',
                content: 'Could not load billing portal, please try again later.',
                duration: 5,
            });
        })
    }

  const profileitems = [
    getItem('Profile', '1', <UserOutlined />, () => navigate("/profile")),
    getItem('Logout', '2', <LogoutOutlined />, () => logout()),
  ];
  const portalItems = portals.map(x => getItem(x.Name, x.ID, null, () => dispatch(select(x))));
  portalItems.push(getItem('New Portal', '4', <PlusOutlined />, () => navigate("/create-portal")))
  const items = [
    getItem(
      selectedPortal?.Name,
      'sub3',
      <AppstoreOutlined />,
      null,
      portalItems,
    ),
    getItem('About', 'about', <InfoCircleOutlined />, () => navigate("/")),
    getItem('Settings', 'settings', <SettingOutlined ref={ref2} />, () => navigate("/settings")),
    getItem('Configuration', 'sub1', <ProjectOutlined ref={ref3} />, null, [
      getItem('Services', 'services', null, () => navigate("/services")),
      getItem('Homes', 'homes', null, () => navigate("/homes")),
      getItem('Roles', 'roles', null, () => navigate("/roles")),
    ]),
    getItem('Users', 'users', <UserOutlined ref={ref4}/>, () => navigate("/users")),
    getItem('Billing', 'billing', <DollarOutlined ref={ref5}/>, () => navigate("/billing")),
    getItem('Support', 'support', <CommentOutlined ref={ref6}/>, () => navigate("/support")),
  ];
  
  const portalURL = () => import.meta.env.VITE_REACT_APP_API_URL === 'https://familylynk.com/api' ? "https://" + selectedPortal.Subdomain + ".familylynk.com" : "http://" + selectedPortal.Subdomain + ".localhost.com:3000";

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >


      <Tour open={tour} onClose={() => setTour(false)} steps={steps}/>
      <FloatButton tooltip={<div>Go to Portal</div>} icon={<LoginOutlined />} type='primary' onClick={() => window.location.href = portalURL()} />
        {contextHolder}
      <Sider breakpoint="md" collapsedWidth="0" theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme='light' selectedKeys={[props.name]} mode="vertical" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
            <Dropdown
            className='float-right mr-12'
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
          </Header>
        <Content className='mt-8 mx-4'>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
            items={props.breadcrumb?.map(x => ({ title: x}))}
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
  );
};