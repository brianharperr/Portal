import { useLocation } from "react-router-dom";

const usePath = () => {
  const location = useLocation();
  
  return location.pathname.slice(1);
};

export default usePath;