import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCasesOverTime, getCasesOverTime } from '../../redux/features/analytic.slice';
import { getPortal } from '../../redux/features/portal.slice';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
export default function CasesOverTimeGraph()
{

    const data = useSelector(getCasesOverTime);
    const dispatch = useDispatch();
    const portal = useSelector(getPortal);

    function getMonthlyChangeColor(change){
        if(change > 0){
          return 'green'
        }
        if(change < 0){
          return 'red'
        }
        return 'yellow'
      }
      function getMonthlyChangeIcon(change){
        if(change > 0){
          return <ArrowUpOutlined/>
        }
        if(change < 0){
          return <ArrowDownOutlined/>
        }
        return <ArrowRightOutlined />
      }

    const options = {
        chart: {
            type: "area",
            stacked: true,
        },
        stroke: {
            curve: "smooth",
        },
        tooltip: {
            x: {
            format: "MMM yyyy",
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
            format: "MMM yyyy",
            },
        },
        noData: {  
            text: "No Data",  
            align: 'center',  
            verticalAlign: 'middle',  
            offsetX: 0,  
            offsetY: 0,  
            style: {  
              color: "#000000",  
              fontSize: '14px',  
              fontFamily: "Helvetica"  
            }  
          }
    }

    useEffect(() => {
        if(portal){
            var payload = {
                id: portal.ID
            }
            dispatch(fetchCasesOverTime(payload))
        }
    }, [portal]);
    return (
        <>

            <div className="p-6 justify-between flex">
            <div>
                <h1 className='text-lg font-bold'>Cases</h1>
                <h2>per Month</h2>
            </div>
            {data?.monthlyChange &&
            <div>
                Avg.
                <span style={{ color: getMonthlyChangeColor(data.monthlyChange)}}>
                {getMonthlyChangeIcon(data.monthlyChange)}{Math.abs(data.monthlyChange)}
                </span>
            </div>
            }
            </div>
            <div>
            <Chart
                height={400}
                options={options}
                series={data?.graph || []}
            />
            </div>

        </>
    )
}