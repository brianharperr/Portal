import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCasesPerService, getCasesPerService } from '../../redux/features/analytic.slice';
import { getPortal } from '../../redux/features/portal.slice';
import { useEffect, useState } from 'react';
export default function CasesPerService()
{

    const data = useSelector(getCasesPerService);
    const dispatch = useDispatch();
    const portal = useSelector(getPortal);
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState();

    useEffect(() => {
        if(portal){
            var payload = {
                id: portal.ID
            }
            dispatch(fetchCasesPerService(payload))
        }
    }, [portal]);

    useEffect(() => {
        if(data){
            var months = data.filter((person, index, selfArray) =>
                index === selfArray.findIndex((p) => (
                    p.Month === person.Month && p.Year === person.Year
                ))
            ).map(x => new Date(x.Year, x.Month-1))
            .sort((a,b) => { return b - a})
            .map((x,idx) => ({
                key: idx,
                value: { Month: x.getMonth() + 1, Year: x.getFullYear() },
                text: x.toLocaleString('default', { month: 'long' }) + " " + x.getFullYear()
            }))
            if(months.length > 0){

                setMonths(months);
                setSelectedMonth(months[0].value);
            }
        }
    }, [data])

    return (
        <>
            <div className="p-6 justify-between flex">
            <div>
                <div>Service Breakdown</div>
                <div>
                {months && selectedMonth && data &&
                <div options={months} value={selectedMonth} onChange={(e,data) => setSelectedMonth(data.value)}/>
                }
                </div>
            </div>
            </div>
            <div>
            {(data && selectedMonth) &&
            <>
             <Chart
                type="donut"
                height={400}
                options={{
                    chart: {
                        type: "donut",
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    noData: {
                        text: "No Data"
                    },
                    plotOptions: {
                        pie: {
                        donut: {
                            labels: {
                            show: true,
                            total: {
                                showAlways: true,
                                show: true,
                            },
                            },
                        },
                        },
                    },
                    labels: data.filter(x=> x.Year === selectedMonth.Year && x.Month === selectedMonth.Month).map(x => x.Name),
                }}
                series={data.filter(x=> x.Year === selectedMonth.Year && x.Month === selectedMonth.Month).map(x => x.Count)}
            /> 
            </>
            }
            </div>
        </>
    )
}