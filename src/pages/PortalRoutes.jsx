import ForgotPassword from "./portal/ForgotPassword";
import ResetPassword from "./portal/ResetPassword";
import RevertEmailChange from "./portal/RevertEmailChange";
import Orders from "./portal/Orders";
import Inbox from "./portal/Inbox";
import Analytics2 from "./portal/Analytics2";
import Dashboard2 from "./portal/Dashboard2";
import NewOrder from "./portal/NewOrder";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "./portal/Login";
import Profile2 from "./portal/Profile2";
import Order from "./portal/Order";
import Schedule from "./portal/Schedule";
import Users from "./portal/Users";
import { Routes, Route } from "react-router-dom";

export default function PortalRoutes()
{
    return (
        <Routes>
            <Route exact path="/" element={<ProtectedRoute><Dashboard2/></ProtectedRoute>} />
            <Route exact path="/order" element={<ProtectedRoute><Order/></ProtectedRoute>} />
            <Route exact path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
            <Route exact path="/new-order" element={<ProtectedRoute><NewOrder/></ProtectedRoute>} />
            <Route exact path="/profile" element={<ProtectedRoute><Profile2/></ProtectedRoute>} />
            <Route exact path="/analytics" element={<ProtectedRoute><Analytics2/></ProtectedRoute>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/schedule" element={<ProtectedRoute><Schedule/></ProtectedRoute>} />
            <Route exact path="/inbox" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
            <Route exact path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
            <Route exact path="/sent" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
            <Route exact path="/flagged" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
            <Route exact path="/trash" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
            <Route exact path="/revert-email-change" element={<ProtectedRoute><RevertEmailChange/></ProtectedRoute>} />
            <Route exact path="/forgot" element={<ProtectedRoute><ForgotPassword/></ProtectedRoute>} />
            <Route exact path="/reset" element={<ProtectedRoute><ResetPassword/></ProtectedRoute>} />
        </Routes>
    )
}