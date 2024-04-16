import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "./admin/Dashboard";
import Landing from "./admin/Landing";
import Login from "./admin/Login";
import { Routes, Route } from "react-router-dom";
import Missing from "./admin/Missing";
import Profile from "./admin/Profile";
import Users from "./admin/Users";
import Services from "./admin/Services";
import Roles from "./admin/Roles";
import Homes from "./admin/Homes";
import Settings from "./admin/Settings";
import ActivateAccount from "./admin/ActivateAccount";
import Support from "./admin/Support";
import Billing from "./admin/Billing";
import PasswordReset from "./admin/PasswordReset";
import NewPortal from "./admin/NewPortal";
import Overview from "./admin/Overview";
import PortalView from "./admin/PortalView";
import AboutUs from "./admin/AbousUs";
import LegalPrivacyPolicy from "./admin/LegalPrivacyPolicy";
import LegalTermsOfService from "./admin/LegalTermsOfService";
import Careers from "./admin/Careers";
import Contact from "./admin/Contact";
export default function AdminRoutes()
{
    return (
        <Routes>
            <Route exact path="/" element={<ProtectedRoute admin alternate={<Landing/>}><Overview/></ProtectedRoute> } />

            <Route exact path="/portal/:name/settings" element={<ProtectedRoute admin><Settings2/></ProtectedRoute>} />
            <Route exact path="/portal/:name/configuration" element={<ProtectedRoute admin><PortalView/></ProtectedRoute>} />
            <Route exact path="/portal/:name/users" element={<ProtectedRoute admin><PortalView/></ProtectedRoute>} />
            <Route exact path="/portal/:name/billing" element={<ProtectedRoute admin><PortalView/></ProtectedRoute>} />

            <Route exact path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route exact path="/create-portal" element={<ProtectedRoute portalFetch={false}><NewPortal/></ProtectedRoute>} />
            <Route exact path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
            <Route exact path="/services" element={<ProtectedRoute><Services/></ProtectedRoute>} />
            <Route exact path="/roles" element={<ProtectedRoute><Roles/></ProtectedRoute>} />
            <Route exact path="/homes" element={<ProtectedRoute><Homes/></ProtectedRoute>} />
            <Route exact path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
            <Route exact path="/auth/activate/:token" element={<ProtectedRoute><ActivateAccount/></ProtectedRoute>} />
            <Route exact path="/support" element={<ProtectedRoute><Support/></ProtectedRoute>} />
            <Route exact path="/billing" element={<ProtectedRoute><Billing/></ProtectedRoute>} />
        
            <Route exact path="/about" element={<AboutUs/>} />
            <Route exact path="/contact" element={<Contact/>} />
            <Route exact path="/careers" element={<Careers/>} />
            <Route exact path="/legal/terms" element={<LegalTermsOfService/>} />
            <Route exact path="/legal/privacy" element={<LegalPrivacyPolicy/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/password/reset" element={<PasswordReset/>} />

            <Route exact path="/*" element={<Missing/>} />
        </Routes>
    )
}