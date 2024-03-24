import { Card, Grid } from "@mui/joy";
import YearlyGoalGraph from "../graphs/YearlyGoal";
import CasesOverTimeGraph from "../graphs/CasesOverTime";
import CasesPerDirector from "../graphs/CasesPerDirector";

export default function AnalyticsComponent()
{
    return (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={8}>
            <CasesPerDirector/>
        </Grid>
        <Grid xs={4}>
            
        </Grid>
        <Grid xs={4}>
            
        </Grid>
        <Grid xs={8}>
            
        </Grid>
        </Grid>
    )
}