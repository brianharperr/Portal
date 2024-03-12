import { Grid, Option, Select, Sheet } from "@mui/joy";
import { useEffect, useState } from "react";

const CalendarHeader = () => {
  return (
    <>
      <Grid xs={1}>
        Sun
      </Grid>
      <Grid xs={1}>
        Mon
      </Grid>
      <Grid xs={1}>
        Tue
      </Grid>
      <Grid xs={1}>
        Wed
      </Grid>
      <Grid xs={1}>
        Thu
      </Grid>
      <Grid xs={1}>
        Fri
      </Grid>
      <Grid xs={1}>
        Sat
      </Grid>
    </>
  )
}

const CalendarBody = ({year, month}) => {
  function generateMonthDates(year, month) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const startDay = startDate.getDay();
    const endDay = endDate.getDate();
    const dates = [];
    for (let i = 1; i <= 42; i++) {
        const currentDate = new Date(year, month, i - startDay);
        dates.push({
            date: currentDate,
            dayOfMonth: currentDate.getDate(),
            outsideMonth: (i < startDay + 1 || i > endDay + startDay)
        });
    }
    return dates;
}

  const [dates, setDates] = useState(null);

  useEffect(() => {
    setDates(generateMonthDates(year, month))
  }, [year, month])

  return (
    <>
      {dates?.map(x => {
        return (
        <Grid xs={1}>
          <Sheet sx={{ 
            height: 200, 
            p: 1, 
            background: (theme) => x.outsideMonth ? `${theme.vars.palette.background.level1}` : `${theme.vars.palette.background.surface}`,
            color: (theme) => x.outsideMonth ? `${theme.vars.palette.text.tertiary}` : `${theme.vars.palette.text.primary}`
            }}>
          {x.dayOfMonth}
          </Sheet>
        </Grid>
        )
      })

      }
    </>
  )
}

export default function CustomCalendar()
{
  const [month, setMonth] = useState(new Date().getMonth());
  return (
    <>
    <Select onChange={(e, data) => setMonth(data)} value={month}>
      <Option value={0}>January</Option>
      <Option value={1}>February</Option>
      <Option value={2}>March</Option>
      <Option value={3}>April</Option>
      <Option value={4}>May</Option>
      <Option value={5}>June</Option>
      <Option value={6}>July</Option>
      <Option value={7}>August</Option>
      <Option value={8}>September</Option>
      <Option value={9}>October</Option>
      <Option value={10}>November</Option>
      <Option value={11}>December</Option>
    </Select>
    <Grid container columns={7} spacing={1} sx={{ flexGrow: 1 }}>
      <CalendarHeader/>
      <CalendarBody year={2024} month={month}/>
    </Grid>
    </>
  )
}