import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login";
import { useEffect } from "react";
import ValidationService from "./services/Validation";
import { fetchPortal, getPortal } from "./redux/features/portal.slice";
import { useDispatch, useSelector } from "react-redux";
import ForgotPassword from "./pages/ForgotPassword";
import Messages from "./pages/Messages";
import Inventory from "./pages/Inventory";
import Case from "./pages/Case";
import Analytics from "./pages/Analytics";
import PortalNotFound from "./pages/PortalNotFound";
import NewCase from "./pages/NewCase";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import ResetPassword from "./pages/ResetPassword";
import RevertEmailChange from "./pages/RevertEmailChange";
import Orders from "./pages/Orders";
import Messages2 from "./pages/Messages2";

export default function App()
{
  const dispatch = useDispatch();
  const portal = useSelector(getPortal);

  useEffect(() => {
    if(!portal){
      var subdomain = ValidationService.validateSubdomain(window.location.host);
      if(subdomain){
        dispatch(fetchPortal());
      }else{
        window.location.href = import.meta.env.VITE_REACT_APP_MASTER_PAGE_URL;
      }
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Orders/></ProtectedRoute>    
    },
    {
      path: "/profile",
      element: <ProtectedRoute><Profile/></ProtectedRoute>
    },
    {
      path: "new-case",
      element: <ProtectedRoute><NewCase/></ProtectedRoute>
    },
    {
      path: '/confirm',
      element: <ConfirmEmailChange/>
    },
    {
      path: "/not-found",
      element: <PortalNotFound/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/inventory",
      element: <Inventory/>
    },
    {
      path: '/case/:id',
      element: <Case/>
    },
    {
      path: '/new-case',
      element: <NewCase/>
    },
    {
      path: "/analytics",
      element: <Analytics/>
    },
    {
      path: "/messages",
      element: <Messages2/>
    },
    {
      path: "/support",
      element: <Support/>
    },
    {
      path: "/forgot",
      element: <ForgotPassword/>
    },
    {
      path: '/revert-email-change',
      element: <RevertEmailChange/>
    },
    {
      path: "/reset",
      element: <ResetPassword/>
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}