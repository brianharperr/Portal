import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/portal/Login";
import { useEffect, useState } from "react";
import ValidationService from "./services/Validation";
import { fetchPortal, getPortal } from "./redux/features/portal.slice";
import { useDispatch, useSelector } from "react-redux";
import ForgotPassword from "./pages/portal/ForgotPassword";
import ResetPassword from "./pages/portal/ResetPassword";
import RevertEmailChange from "./pages/portal/RevertEmailChange";
import Orders from "./pages/portal/Orders";
import Inbox from "./pages/portal/Inbox";
import Analytics2 from "./pages/portal/Analytics2";
import Dashboard2 from "./pages/portal/Dashboard2";
import NewOrder from "./pages/portal/NewOrder";
import axios from "axios";
import Profile2 from "./pages/portal/Profile2";
import Order from "./pages/portal/Order";
import Schedule from "./pages/portal/Schedule";
import Users from "./pages/portal/Users";
import PortalRoutes from "./pages/PortalRoutes";
import AdminRoutes from "./pages/AdminRoutes";

export default function App()
{
  const dispatch = useDispatch();
  const portal = useSelector(getPortal);
  const [isPortal, setIsPortal] = useState(false);

  useEffect(() => {
    const isValidSubdomain = ValidationService.validateSubdomain(window.location.host);
    setIsPortal(isValidSubdomain);
    const subdomain = window.location.host.split(".")[0];
    if(isValidSubdomain && !portal){
      dispatch(fetchPortal(subdomain));
    }
  }, []);

  return (
    <BrowserRouter>
      {isPortal ? 
        <PortalRoutes/>
      :
        <AdminRoutes/>
      }
    </BrowserRouter>
  )
}