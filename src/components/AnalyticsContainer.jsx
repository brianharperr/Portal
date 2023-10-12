import CasesOverTimeGraph from "./graphs/CasesOverTime";
import CasesPerService from "./graphs/CasesPerService";
import YearlyGoalGraph from "./graphs/YearlyGoal";
import AvgCaseCompletion from "./graphs/AvgCaseCompletion";
import CasesPerHome from "./graphs/CasesPerHome";
import CasesPerDirector from "./graphs/CasesPerDirector";
import AvgServiceCompletion from "./graphs/AvgServiceCompletion";
export default function AnalyticsContainer() {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 my-4 mx-4">
      
  <div className="col-span-1 lg:col-span-2 border border-gray-200 hover:shadow-lg transition-all duration-300 rounded-lg">
    <CasesOverTimeGraph/>
  </div>
  <div className="col-span-1 lg:col-span-2 xl:col-span-1 border border-gray-200 hover:shadow-lg transition-all duration-300 rounded-lg">
    <CasesPerService/>
  </div>
  <div className="col-span-1 border border-gray-200 hover:shadow-lg rounded-lg transition-all duration-300">
    <YearlyGoalGraph/>
  </div>
  <div className="col-span-1 border border-gray-200 hover:shadow-lg rounded-lg transition-all duration-300">
    <AvgCaseCompletion/>
  </div>
  <div className="col-span-1 border border-gray-200 hover:shadow-lg rounded-lg transition-all duration-300">
    <CasesPerHome/>
  </div>
  <div className="col-span-1 border border-gray-200 hover:shadow-lg transition-all duration-300">
    <CasesPerDirector/>
  </div>
  <div className="col-span-1 xl:col-span-2 border border-gray-200 hover:shadow-lg transition-all duration-300">
    <AvgServiceCompletion/>
  </div>
</div>
  )
}
