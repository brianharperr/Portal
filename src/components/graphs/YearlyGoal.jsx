import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCasesOverTime, fetchYearlyGoal, getCasesOverTime, getYearlyGoal, updateYearlyGoal } from '../../redux/features/analytic.slice';
import { getPortal } from '../../redux/features/portal.slice';
import { Button, InputNumber, Popover } from 'antd';
export default function YearlyGoalGraph()
{

    const data = useSelector(getYearlyGoal);
    const dispatch = useDispatch();
    const portal = useSelector(getPortal);
    const [caseGoal, setCaseGoal] = useState();
    const [percentComplete, setPercentComplete] = useState();
    const [yearlyGoalPopup, setYearlyGoalPopup] = useState(false);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(firstDate.getFullYear() + 1,0,0);
    const difference = secondDate.getTime() - firstDate.getTime();
    const diffDays = Math.ceil(difference / oneDay);
    const percentYearComplete = Math.round(diffDays/365 * 100);
    
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
            text: "Loading...",  
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

    function handleSubmit()
    {
      var payload = {
        ID: data.ID,
        YearlyGoal: caseGoal
      }
      dispatch(updateYearlyGoal(payload));
      setYearlyGoalPopup(false);
    }

    useEffect(() => {
        if(portal){
            var payload = {
                id: portal.ID
            }
            dispatch(fetchYearlyGoal(payload))
        }
    }, [portal]);

    useEffect(() => {
      if(data){
        if(data.YearlyGoal > 0){
          setCaseGoal(data.YearlyGoal);
          setPercentComplete(((data.Cases / data.YearlyGoal) * 100).toFixed(2));
        }else{
          setCaseGoal(0);
          setPercentComplete(0);
        }
      }
    }, [data])
    
    useEffect(() => {
      if(data){
        if(data.YearlyGoal){
          setCaseGoal(data.YearlyGoal);
          setPercentComplete(((data.Cases / data.YearlyGoal) * 100).toFixed(2));
        }else{
          setCaseGoal(0);
          setPercentComplete(0);
        }
      }
    }, []);
    return (
        <div className="items-center justify-between p-4 sm:flex sm:p-6">
        <div className="w-full">
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
            {new Date().getFullYear()} Goal
          </h3>
          {data &&
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            {percentComplete}%
          </span>
          }
          <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
            {diffDays} days remaining
          </p>
          <Popover
              onOpenChange={handleSubmit}
              content={<InputNumber value={caseGoal} onChange={e => setCaseGoal(e)}/>}
              trigger="click">
            <Button>Update goal</Button>
          </Popover>
        </div>
        <div className="w-full min-h-[155px]">

          <Chart
            type="radialBar"
            height={155}
            series={[percentYearComplete, percentComplete]}
            options={{
              chart: {
                type: "radialBar",
                height: 350,
                sparkline: {
                  enabled: true,
                },
              },
              labels: ["% of the year complete", "% to goal"],
              stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
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