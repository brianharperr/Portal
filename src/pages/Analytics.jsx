import { Menu } from "antd";
import PageBuilder from "../components/PageBuilder";
import { useState } from "react";
import AnalyticsContainer from "../components/AnalyticsContainer";

export default function Analytics()
{
    const [current, setCurrent] = useState('basic');

    const items = [
        {
          label: 'Basic',
          key: 'basic',
        },
        {
          label: 'Premium',
          key: 'premium',
        }
      ];

    return (
        <PageBuilder name="analytics">
            <Menu 
            items={items} 
            mode="horizontal" 
            selectedKeys={[current]} 
            onClick={e => setCurrent(e.key)}
            style={{
                background: 'rgba(0,0,0,0)'
            }}
             />
             {current === 'basic' && <AnalyticsContainer/>

             }
        </PageBuilder>
    )
}