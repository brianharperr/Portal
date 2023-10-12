import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvgServiceCompletion, getAvgServiceCompletion } from '../../redux/features/analytic.slice';
import { getPortal } from '../../redux/features/portal.slice';
import { useEffect, useState } from 'react';
import { Dropdown, Select } from 'antd';

export default function AvgServiceCompletion()
{

    const data = useSelector(getAvgServiceCompletion);
    const dispatch = useDispatch();
    const portal = useSelector(getPortal);
    const [selected, setSelected] = useState();
    const [years, setYears] = useState();
    useEffect(() => {

        if(portal){
            var payload = {
                id: portal.ID
            }
            dispatch(fetchAvgServiceCompletion(payload))
        }
    }, [portal]);

    useEffect(() => {
        if(data){
            var years = [...new Set(data.map(x => x.Year))].sort((a,b) => {return b - a}).map(x => ({ key: x, value: x, text: x.toString()}));
            if(years?.length > 0){
                setYears(years);
                setSelected(years[0].value);
            }
        }
    }, [data])

    return (
<>    
<div className="p-6 justify-between flex">
      <div>
        <div>Service Completion Time (days)</div>
        {years && selected &&
        <div>
          <Select options={years} value={selected} />
        </div>
        }
      </div>
    </div>
    <div>
      <Chart
        height={400}
        type="bar"
        options={{
          chart: {
            height: 350,
            type: "bar",
          },
          noData: {
            text: "No Data"
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            categories: data.filter(x=> x.Year === 2023).map(x => x.Name),
          },
        }}
        series={[
          {
            name: 'Average Completion Time (days)',
            data: data.filter(x=> x.Year === 2023).map(x => (x.CompletionTime / 60/ 60 / 24).toFixed(2))
          },
        ]}
      />
    </div>
    </>
    )
}