import { Card, Col, Divider, Row, Segmented } from "antd";
import { useState, useEffect } from "react"
import { axiosWithAdminCredentials } from "../../configs/axios";

const periodOptions = [
    {
        label: 'Monthly',
        value: 'month'
    },
    {
        label: 'Annually',
        value: 'year'
    }
]

export default function PlanCards({ plan, selectPlan })
{
    const [period, setPeriod] = useState("month");
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function normalizePlanPrice(price){
        price = price / 100;
        var per = period === "month" ? "mo." : "yr."
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        }).replace(/\.00$/,'') + "/" + per;
    }

    useEffect(() => {
        axiosWithAdminCredentials.get('/stripe/plans')
        .then(res => {
            setPlans(res.data);
        })
        .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="max-w-[1024px] mx-auto text-center">
        <Segmented
        options={periodOptions}
        onChange={e => setPeriod(e)}
        className="!mb-6"
        />
        <Row gutter={16}>
            {plans[period]?.map(x => {
                return (
                    <Col span={8}>
                        <Card className={`${x === plan && '!border-2 !border-flgreen hover:!border-2 hover:!border-flgreen'} transition-all duration-100`} hoverable onClick={() => selectPlan(x)} title={x.product.name} bordered={false}>
                        {normalizePlanPrice(x.amount)}
                        <Divider/>
                        </Card>
                    </Col>
                )
            })}
        </Row>
        </div>
    )
}