import { Button, Form, Input, Steps, Upload, Typography, Layout, Divider } from "antd";
const { Title } = Typography;
import { useEffect, useState } from "react";
import { UploadOutlined, LogoutOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { axiosWithAdminCredentials, axiosWithoutCredentials } from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPortals } from "../../redux/features/admin.portal.slice";
import ColorTheme from "../../configs/color-themes";
import { CirclePicker } from "react-color";
const { Header, Footer, Content } = Layout;
export default function NewPortal() {

    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    const [subdomain, setSubdomain] = useState("");
    const portals = useSelector(getPortals);
    const [pricingPeriod, setPricingPeriod] = useState("month");
    const [plan, setPlan] = useState();
    const [name, setName] = useState("");
    const [data, setData] = useState();
    const [subdomainCheckLoading, setSubdomainCheckLoading] = useState(false);
    const [subdomainAvailability, setSubdomainAvailability] = useState();
    const [color, setColor] = useState("#197257");
    const colors = ColorTheme.map(x => x.background.primary);
    function onNext()
    {
        if(current < items.length-1){
            var copy = [...items];
            copy[current].status = "finish";
            copy[current+1].status = "process";
            setItems(copy);
            setCurrent(current+1);
        }
    }

    function handleSubmit()
    {

        var theme = ColorTheme.find(y=> y.background.primary === color);
        axiosWithAdminCredentials.post('/stripe/checkout', { 
            PlanID: plan.id,
            name: name,
            theme: theme.ID,
            domain: subdomain
        })
        .then(res => {
            window.location.href = res.data
        })
        .catch(err => console.log(err));
        
    }

    function normalizePlanPrice(price){
        price = price / 100;
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        }).replace(/\.00$/,'');
    }
    function handleThemeChange(x){
        setColor(x.hex);
    }

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

    function onBack()
    {
        if(current > 0){
            var copy = [...items];
            copy[current].status = "wait";
            copy[current-1].status = "process";
            setItems(copy);
            setCurrent(current-1);
        }
    }

    const domainStatus = () => subdomainCheckLoading ? 'validating' : subdomainAvailability === undefined ? null : subdomainAvailability ? 'success' : 'error';
    const domainFeedback = () => subdomainCheckLoading ? 'Checking Availability...' : subdomainAvailability === undefined ? null : subdomainAvailability ? 'Available' : 'Not Available'
    function renderStep()
    {
        switch(current){
            case 0:
                return (
                    <>
                    <Form className="">
                        <Form.Item required label="Name">
                        <Input maxLength={128} className="mb-4" required value={name} onChange={e => setName(e.target.value)}/>
                        </Form.Item>
                        <Divider/>
                        <Form.Item label="Logo">
                            <Upload
                            listType="picture"
                            maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Theme">
                            <CirclePicker color={color} colors={colors} onChangeComplete={handleThemeChange}/>
                        </Form.Item>
                    </Form>
                    <Button icon={<EyeOutlined />} disabled>Preview</Button>
                    <Button onClick={() => onNext()} className="!float-right">Next<ArrowRightOutlined/></Button>
                    </>
                )
            case 1:
                return (
                    <>
                    <Form className="mb-8">
                        <Form.Item validateStatus={domainStatus()} hasFeedback help={domainFeedback()}>
                        <label>Domain<span className="text-red-500">*</span></label>
                        <Input maxLength={45} value={subdomain} onChange={e => setSubdomain(e.target.value)} addonBefore="https://" addonAfter=".familylynk.com" required/>
                        </Form.Item>
                    </Form>
                    <Button onClick={() => onNext()} className="!float-right">Next<ArrowRightOutlined/></Button>
                    </>
                );
            case 2:
                return (
                    <>
                    <div className="">
                        <div className="container mx-auto max-w-4xl">
                            <div className="mt-10 text-center">
                            <h1 className="text-4xl font-bold text-gray-800">Pick a plan</h1>
                            <p className="text-lg mt-3 font-semibold">Every plan includes a 30 day free trial</p>
                            </div>
                            <div className="mt-8">
                            <div className="flex justify-between">
                                <div className="flex space-x-16">
                                <div className="flex">
                                    <span className="font-semibold inline mr-4">Plan</span>
                                    <select onChange={(e) =>  setPricingPeriod(e.target.value)} defaultValue={pricingPeriod} className="px-2 py-1 rounded-md text-sm bg-gray-300 flex items-center cursor-pointer">
                                        <option value={"month"}>Monthly</option>
                                        <option value={"year"}>Annually</option>
                                    </select>
                                </div>
                                </div>
                            </div>
                            <div></div>
                            </div>
                            <hr className="mt-10" />
                            <div className="flex space-x-10">
                            { data.Stripe && data.Stripe.Plans.data.filter(x => x.interval === pricingPeriod).map((x,idx) => {
            
                                return (
                                    
                                    <div className="py-12" key={idx}>
                                    <div onClick={() => setPlan(x)} className={`${plan === x ? 'border-flgreen border-4' : ''} bg-white py-4 rounded-xl space-y-6 overflow-hidden  transition-all duration-500 border transform hover:border-flgreen hover:-translate-y-6 hover:scale-105 shadow-xl hover:shadow-2xl cursor-pointer`}>
                                        <div className="px-8 flex justify-between items-center">
                                        <h4 className="text-xl font-bold text-gray-800">{x.product.name}</h4>
                                        </div>
                                        <h1 className="text-4xl text-center font-bold">{normalizePlanPrice(x.amount)}<span className='text-gray-400 text-sm'>/{x.interval === "month" ? 'mo' : 'yr'}.</span></h1>
                                        <p className="px-4 text-center text-sm ">{x.product.description}</p>
                                        <ul className="text-center">
                                            {x.product.features && x.product.features?.map((x, idx) => {
                                                return <li key={idx} className="semi-bold">{x}</li>
                                            })}
                                        </ul>
                                    </div>
                                    </div>
                                )
            
                            })}
                            </div>
                        </div>
                        </div>
                        <Button onClick={() => handleSubmit()} className="!float-right">Checkout<ArrowRightOutlined/></Button>
                </>
                )
            case 3:
                break;
        }
    }

    const [items, setItems] = useState([
        {
          status: 'process',
          title: 'Customize',
        },
        {
          status: 'wait',
          title: 'Choose Domain',
        },
        {
          status: 'wait',
          disabled: true,
          title: 'Select Plan',
        },
        {
          status: 'wait',
          disabled: true,
          title: 'Checkout',
        },
      ]);

      useEffect(() => {
        if(subdomain){
            setSubdomainCheckLoading(true);
            const delayDebounceFn = setTimeout(() => {
                axiosWithoutCredentials.get('/portal/namecheck/' + subdomain)
                .then(res => {
                    setSubdomainAvailability(res.data);
                })
                .finally(() => {
                    setSubdomainCheckLoading(false);
                })
              }, 1000);
          
              return () => clearTimeout(delayDebounceFn)
        }else{
            setSubdomainCheckLoading(false);
            setSubdomainAvailability(undefined);
        }
      }, [subdomain]);

      useEffect(() => {
            axiosWithAdminCredentials.get('/procedure/get-started')
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));

        }, []);
  return (
    <Layout className="!bg-white">
    <Header className="bg-white">
        {portals?.length > 0 ?
        <Button onClick={() => navigate('/')}>
          Return to Home
          <LogoutOutlined />
        </Button>
        :
        <Button onClick={logout}>
        Logout
        <LogoutOutlined />
      </Button>
        }
    </Header>
    <Content className="bg-white !w-[1024px] mx-auto">
    <Title className="!mx-auto w-full text-center" level={2}>Let's get started.</Title>
    <div className="container max-w-[1080px] mx-auto mt-4 px-10 border border-gray-200 p-8 shadow-sm rounded">
      <Steps
        type="navigation"
        current={current}
        className="site-navigation-steps mb-4"
        items={items}
      />
      {
          renderStep()
      }
      {current > 0 && <Button onClick={() => onBack()}>Back</Button>}
      </div>
    </Content>
    <Footer
          style={{
            textAlign: 'center',
            background: '#fff'
          }}
        >
          FamilyLynk ©2023
        </Footer>
  </Layout>
  );
};