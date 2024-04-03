import { Button, Card, List, Spin, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PageBuilder from "../../components/admin/PageBuilder";
import { axiosWithAdminCredentials } from "../../configs/axios";
import { getSelectedPortal, updateAutomaticRenewal } from "../../redux/features/admin.portal.slice";
const { Title } = Typography;
import {
    EditOutlined,
    CreditCardOutlined,
    CloseOutlined,
    UndoOutlined,
    MenuUnfoldOutlined,
    LoadingOutlined
  } from '@ant-design/icons';
import { useEffect, useState } from "react";
import PlanCards from "../../components/admin/PlanCards";
  
export default function Billing()
{
    const dispatch = useDispatch();
    const portal = useSelector(getSelectedPortal);
    const [subscription, setSubscription] = useState({
        state: 'loading',
        renewing: false
    });
    const [selectedPlan, setSelectedPlan] = useState(null);

    function fetchFlow(flow)
    {

        var payload = {
            PortalID: portal?.MasterID,
            ReturnURL: window.location.href,
            flow: flow
        };

        axiosWithAdminCredentials.post('/stripe/flow', payload)
        .then(res => window.location.href = res.data);
    }

    function checkout()
    {
        var payload = {
            PortalID: portal.ID,
            MasterID: portal.MasterID,
            PlanID: selectedPlan.id
        }
        axiosWithAdminCredentials.post('/stripe/checkout', payload)
        .then(res => window.location.href = res.data);
    }

    function handleAutomaticRenewalChange()
    {
        var payload = {
            SubscriptionID: portal.SubscriptionID,
            Value: true
        }
        dispatch(updateAutomaticRenewal(payload)).unwrap()
        .then(() => {
          setSubscription({...subscription, renewing: true})
        })
    }

    useEffect(() => {

        if(portal){
            var payload = {
                id: portal.SubscriptionID
            }

            axiosWithAdminCredentials.get('/stripe/subscription', { params: payload })
            .then(res => {
                if(!res.data){
                    setSubscription({
                        state: 'canceled',
                        renewing: false
                    })

                }else{
                    setSubscription({
                        state: res.data.status,
                        renewing: !res.data.cancel_at_period_end
                    });
                }
            })
        }
    }, [portal])

    return (
        <PageBuilder breadcrumb={["Billing"]} name="billing">
            {!subscription.state || subscription.state === 'loading' ? 
            <Spin indicator={<LoadingOutlined spin/>}/>
            :
            <>
            {subscription.state === 'active' ?
            <div className="flex flex-col">
                <Title level={5}>This Portal</Title>
                <List
                className="!mb-10"
                bordered
                itemLayout="horizontal"
                >
                    <List.Item className="hover:bg-white hover:cursor-pointer" onClick={() => fetchFlow('subscription_update')}>
                        <List.Item.Meta
                        avatar={<EditOutlined />}
                        title="Update Plan"
                        description="Swap this portal to a different plan."
                        />
                    </List.Item>
                    {subscription.renewing ?
                        <List.Item className="hover:bg-white hover:cursor-pointer" onClick={() => fetchFlow('subscription_cancel')}>
                            <List.Item.Meta
                            avatar={<CloseOutlined />}
                            title="Cancel Subscription"
                            description="Cancel subscription at the end of the billing period. (Disable Auto Renewal)"
                            />
                        </List.Item>
                    :
                    <List.Item className="hover:bg-white hover:cursor-pointer" onClick={() => handleAutomaticRenewalChange()}>
                        <List.Item.Meta
                        avatar={<UndoOutlined />}
                        title="Do not cancel subscription"
                        description="Stop subscription from canceling at the end of the billing period. (Enable Auto Renewal)"
                        />
                    </List.Item>
                    }
                </List>
                <Title level={5}>All Portals</Title>
                <List
                bordered
                itemLayout="horizontal"
                >
                    <List.Item className="hover:bg-white hover:cursor-pointer" onClick={() => fetchFlow('billing_portal')}>
                        <List.Item.Meta
                        avatar={<MenuUnfoldOutlined />}
                        title="Manage All Portals"
                        description="View and manage all of your subscriptions."
                        />
                    </List.Item>
                    <List.Item className="hover:bg-white hover:cursor-pointer" onClick={() => fetchFlow('payment_method_update')}>
                        <List.Item.Meta
                        avatar={<CreditCardOutlined />}
                        title="Update Payment Method"
                        description="Update how you pay for your portals."
                        />
                    </List.Item>
                </List>
            </div>
            :
            <div className="mx-auto text-center">
            <Title className="!mb-12" level={3}>Looks like your subscription ran out. Let's get back on track!</Title>
            <PlanCards plan={selectedPlan} selectPlan={(x) => setSelectedPlan(x)}/>
            {selectedPlan &&
            <Button onClick={() => checkout()} className="mt-12">Checkout</Button>
            }
            </div>
            }
            </>
            }
        </PageBuilder>
    )
}