import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvgCaseCompletion, getAvgCaseCompletion } from '../../redux/features/analytic.slice';
import { getPortal } from '../../redux/features/portal.slice';
import { useEffect, useState } from 'react';
import {
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

export default function AvgCaseCompletion()
{

    const data = useSelector(getAvgCaseCompletion);
    const dispatch = useDispatch();
    const portal = useSelector(getPortal);
    const [formattedData, setFormattedData] = useState([]);
    const [change, setChange] = useState();
    const [status, setStatus] = useState('init');

    useEffect(() => {
        if(portal){
            var payload = {
                id: portal.ID
            }
            dispatch(fetchAvgCaseCompletion(payload)).catch(() => setStatus('error'));
        }
    }, [portal]);

    function cleanData(data)
    {
      if(data?.length > 0){
          var format = [];
          for(let i = 4; i >= 0; i--)
          {
              var d = new Date();
              var month = (d.getMonth()+1) - i;
              var textMonth = new Date(d.setMonth((d.getMonth()) - i)).toLocaleString('en-US', {month: 'long'});
              var idx = data.findIndex( x => x.Month === month && x.Year === new Date().getFullYear());
              var completionTime = 0;
              if(idx > -1){
                  if(!data[idx].CompletionTime){
                      completionTime = 0;
                      
                  }else{
                      completionTime = data[idx].CompletionTime / 60 / 60 / 24
                  }
                  
              }
              format.push({
                  Month: month,
                  Text: textMonth,
                  CompletionTime: completionTime
              })
          }
          if(format.length >= 2){
            var v1 = format[format.length - 2].CompletionTime;
            var v2 = format[format.length - 1].CompletionTime;
            var change = ((v2 - v1) / v1) * 100;
            setChange(change)
          }
          setFormattedData(format);
          setStatus('success');
      }else{
          setStatus('empty');
      }
    }
    useEffect(() => {   
      cleanData(data);
    }, [data])

    return (
      <div className="items-center justify-between p-4 sm:flex sm:p-6">
        <div className="w-full">
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
            Average Case Completion Time
          </h3>
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            {status === "success" && (
              <>
                {formattedData[formattedData.length - 1].CompletionTime === 0
                  ? "No " +
                    formattedData[formattedData.length - 1].Text +
                    " cases has been completed"
                  : formattedData[formattedData.length - 1].CompletionTime.toFixed(
                      2
                    ) + " days"}
              </>
            )}
          </span>
          {change &&
            formattedData[formattedData.length - 1].CompletionTime !== 0 && (
              <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                <span
                  className={`flex items-center mr-1.5 text-sm ${
                    change > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {change < 0 ?
                  <ArrowDownOutlined/>
                  :
                  <ArrowUpOutlined/>
                  }
                  {Math.abs(change.toFixed(2))}%
                </span>
                Since last month
              </p>
            )}
        </div>
        <div className="w-full min-h-[155px]">
          {formattedData && (
            <Chart
              type="bar"
              height={155}
              series={[
                {
                  name: "Average Case Completion Time",
                  data: formattedData.map((x) => x.CompletionTime),
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
                noData: {
                  text: "No Data",
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: formattedData.map((x) => x.Text),
                },
                yaxis: {
                  labels: {
                    formatter: function (val) {
                      return val.toFixed(2);
                    },
                  },
                  show: false,
                },
                fill: {
                  opacity: 1,
                },
              }}
            />
          )}
        </div>
      </div>
    )
}