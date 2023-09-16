import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login";
import { useEffect } from "react";
import ValidationService from "./services/Validation";
import { fetchPortal } from "./redux/features/portal.slice";
import { useDispatch } from "react-redux";
import ForgotPassword from "./pages/ForgotPassword";

export default function App()
{
  const dispatch = useDispatch();
  useEffect(() => {
    var subdomain = ValidationService.validateSubdomain(window.location.host);
    
    if(subdomain){
      dispatch(fetchPortal());
    }else{
      window.location.href = import.meta.env.VITE_REACT_APP_MASTER_PAGE_URL;
    }

  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Dashboard/></ProtectedRoute>    
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/forgot",
      element: <ForgotPassword/>
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}