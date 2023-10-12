import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCasesPerHome, getCasesPerHome } from '../../redux/features/analytic.slice';
import { getPortal } from '../../redux/features/portal.slice';
import { useEffect, useState } from 'react';

export default function CasesPerHome()
{

    const data = useSelector(getCasesPerHome);
    const dispatch = useDispatch();
    const portal = useSelector(getPortal);
    const [formattedData, setFormattedData] = useState([]);
    useEffect(() => {
        if(portal){
            var payload = {
                id: portal.ID
            }
            dispatch(fetchCasesPerHome(payload))
        }
    }, [portal]);

    useEffect(() => {
        if(data){
            setFormattedData(data.filter(x => x.Year === new Date().getFullYear()))
        }
    }, [data])

    return (
        <div className="items-center justify-between p-4 sm:flex sm:p-6 ">
            <div className="w-full">
            <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                Cases Per Home ({new Date().getFullYear()})
            </h3>
            {formattedData?.length > 0 &&
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                {formattedData.reduce((a,b)=>a.Count>b.Count?a:b).Name}
            </span>
            }
            <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                Most Popular
            </p>
            </div>
            <div className="w-full min-h-[155px]">
            <Chart
                type="bar"
                height={155}
                series={[
                {
                    name: "Cases",
                    data: formattedData.map(x => x.Count),
                },
                ]}
                options={{
                chart: {
                    type: "bar",
                    height: 350,
                    sparkline: {
                    enabled: true,
                    },
                },
                yaxis: {
                    reversed: true,
                    axisTicks: {
                    show: true,
                    },
                },
                noData: {
                    text: "No Data"
                },
                plotOptions: {
                    bar: {
                    distributed: true,
                    horizontal: true,
                    barHeight: "75%",
                    dataLabels: {
                        position: "bottom",
                    },
                    },
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ["transparent"],
                },
                xaxis: {
                    categories: formattedData.map(x => x.Name),
                },
                fill: {
                    opacity: 1,
                },
                }}
            />
            </div>
        </div>
    )
}