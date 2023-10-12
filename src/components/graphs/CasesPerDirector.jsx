import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCasesPerDirector, fetchCasesPerHome, getCasesPerDirector, getCasesPerHome } from '../../redux/features/analytic.slice';
import { getPortal } from '../../redux/features/portal.slice';
import { useEffect, useState } from 'react';

export default function CasesPerDirector()
{

    const data = useSelector(getCasesPerDirector);
    const dispatch = useDispatch();
    const portal = useSelector(getPortal);
    const [years, setYears] = useState();
    const [selection, setSelection] = useState();
    const [formattedData, setFormattedData] = useState();

    useEffect(() => {
        if(portal){
            var payload = {
                id: portal.ID
            }
            dispatch(fetchCasesPerDirector(payload))
        }
    }, [portal]);

    useEffect(() => {
        if(data){
            var years = data.filter((person, index, selfArray) =>
                index === selfArray.findIndex((p) => (
                    p.Year === person.Year
                ))
            ).map(x => ({
                key: x.Year,
                value:  x.Year,
                text: x.Year.toString()
            }));
            if(years.length > 0){
                setYears(years);
                setSelection(years[0].value);
            }
        }
    }, [data])

    return (
        <>
        <div className="p-6 justify-between flex">
        <div>
          <div>Cases per Director</div>
          {selection && years && data &&
          <div>
            <div value={selection} options={years} onChange={(e, data) => setSelected(data.value)}/>
          </div>
            }
        </div>
        </div>
        <div>
            <Chart
            type="bar"
            height={400}
            series={[
                {
                name: "Cases",
                data: data.filter(x => x.Year === selection).map(x => x.Count),
                },
            ]}
            options={{
                chart: {
                type: "bar",
                height: 350,
                },
                yaxis: {
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
                categories: data.filter(x => x.Year === selection).map(x => x.Name),
                },
                fill: {
                opacity: 1,
                },
            }}
            />
        </div>
        </>
    )
}