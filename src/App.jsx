import {
	createBrowserRouter,
	RouterProvider,
	BrowserRouter,
	Routes,
	Route,
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/portal/Login';
import { useEffect, useState } from 'react';
import ValidationService from './services/Validation';
import { fetchPortal, getPortal } from './redux/features/portal.slice';
import { useDispatch, useSelector } from 'react-redux';
import ForgotPassword from './pages/portal/ForgotPassword';
import ResetPassword from './pages/portal/ResetPassword';
import RevertEmailChange from './pages/portal/RevertEmailChange';
import Orders from './pages/portal/Orders';
import Inbox from './pages/portal/Inbox';
import Analytics2 from './pages/portal/Analytics2';
import Dashboard2 from './pages/portal/Dashboard2';
import NewOrder from './pages/portal/NewOrder';
import axios from 'axios';
import Profile2 from './pages/portal/Profile2';
import Order from './pages/portal/Order';
import Schedule from './pages/portal/Schedule';
import Users from './pages/portal/Users';
import PortalRoutes from './pages/PortalRoutes';
import AdminRoutes from './pages/AdminRoutes';
import LandingPage from './pages/admin/Landing';
import Overview from './pages/admin/Overview';
import Missing from './pages/admin/Missing';
import PortalView from './pages/admin/PortalView';
import Profile from './pages/admin/Profile';
import LoginAdmin from './pages/admin/Login';
import SettingsAdmin from './pages/admin/Settings';
import UsersAdmin from './pages/admin/Users2';

export default function App() {
	const dispatch = useDispatch();
	const portal = useSelector(getPortal);
	const [isPortal, setIsPortal] = useState(null);

	useEffect(() => {
		const isValidSubdomain = ValidationService.validateSubdomain(
			window.location.host
		);
		setIsPortal(isValidSubdomain);
		const subdomain = window.location.host.split('.')[0];
		if (isValidSubdomain && !portal) {
			dispatch(fetchPortal(subdomain));
		}
	}, []);

	//   <Route exact path="/" element={<ProtectedRoute admin alternate={<Landing/>}><Overview/></ProtectedRoute> } />

	//   <Route exact path="/portal/:name/settings" element={<ProtectedRoute admin><Settings2/></ProtectedRoute>} />
	//   <Route exact path="/portal/:name/configuration" element={<ProtectedRoute admin><PortalView/></ProtectedRoute>} />
	//   <Route exact path="/portal/:name/users" element={<ProtectedRoute admin><PortalView/></ProtectedRoute>} />
	//   <Route exact path="/portal/:name/billing" element={<ProtectedRoute admin><PortalView/></ProtectedRoute>} />

	//   <Route exact path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
	//   <Route exact path="/create-portal" element={<ProtectedRoute portalFetch={false}><NewPortal/></ProtectedRoute>} />
	//   <Route exact path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
	//   <Route exact path="/services" element={<ProtectedRoute><Services/></ProtectedRoute>} />
	//   <Route exact path="/roles" element={<ProtectedRoute><Roles/></ProtectedRoute>} />
	//   <Route exact path="/homes" element={<ProtectedRoute><Homes/></ProtectedRoute>} />
	//   <Route exact path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
	//   <Route exact path="/auth/activate/:token" element={<ProtectedRoute><ActivateAccount/></ProtectedRoute>} />
	//   <Route exact path="/support" element={<ProtectedRoute><Support/></ProtectedRoute>} />
	//   <Route exact path="/billing" element={<ProtectedRoute><Billing/></ProtectedRoute>} />

	//   <Route exact path="/about" element={<AboutUs/>} />
	//   <Route exact path="/contact" element={<Contact/>} />
	//   <Route exact path="/careers" element={<Careers/>} />
	//   <Route exact path="/legal/terms" element={<LegalTermsOfService/>} />
	//   <Route exact path="/legal/privacy" element={<LegalPrivacyPolicy/>} />
	//   <Route exact path="/login" element={<Login/>} />
	//   <Route exact path="/password/reset" element={<PasswordReset/>} />

	//   <Route exact path="/*" element={<Missing/>} />
	//   //admin

	// <Routes>
	//             <Route exact path="/" element={<ProtectedRoute><Dashboard2/></ProtectedRoute>} />
	//             <Route exact path="/order" element={<ProtectedRoute><Order/></ProtectedRoute>} />
	//             <Route exact path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
	//             <Route exact path="/new-order" element={<ProtectedRoute><NewOrder/></ProtectedRoute>} />
	//             <Route exact path="/profile" element={<ProtectedRoute><Profile2/></ProtectedRoute>} />
	//             <Route exact path="/analytics" element={<ProtectedRoute><Analytics2/></ProtectedRoute>} />
	//             <Route exact path="/login" element={<Login/>} />
	//             <Route exact path="/schedule" element={<ProtectedRoute><Schedule/></ProtectedRoute>} />
	//             <Route exact path="/inbox" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
	//             <Route exact path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
	//             <Route exact path="/sent" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
	//             <Route exact path="/flagged" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
	//             <Route exact path="/trash" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />
	//             <Route exact path="/revert-email-change" element={<ProtectedRoute><RevertEmailChange/></ProtectedRoute>} />
	//             <Route exact path="/forgot" element={<ProtectedRoute><ForgotPassword/></ProtectedRoute>} />
	//             <Route exact path="/reset" element={<ProtectedRoute><ResetPassword/></ProtectedRoute>} />
	//         </Routes>

	return (
		<BrowserRouter>
			<Routes>
				<Route
					exact
					path='/'
					element={
						isPortal ? (
							<ProtectedRoute
								admin={false}
								alternate={<Login />}
							>
								<Dashboard2 />
							</ProtectedRoute>
						) : (
							<ProtectedRoute
								admin
								alternate={<LandingPage />}
							>
								<Overview />
							</ProtectedRoute>
						)
					}
				/>
				<Route
					exact
					path='/login'
					element={isPortal ? <Login /> : <LoginAdmin />}
				/>

				<Route
					exact
					path='/portal/:domain/settings'
					element={
						isPortal ? (
							<Missing />
						) : (
							<ProtectedRoute admin>
								<SettingsAdmin />
							</ProtectedRoute>
						)
					}
				/>
				<Route
					exact
					path='/portal/:domain/configuration'
					element={
						isPortal ? (
							<Missing />
						) : (
							<ProtectedRoute admin>
								<PortalView />
							</ProtectedRoute>
						)
					}
				/>
				<Route
					exact
					path='/portal/:domain/users'
					element={
						isPortal ? (
							<Missing />
						) : (
							<ProtectedRoute admin>
								<UsersAdmin />
							</ProtectedRoute>
						)
					}
				/>
				<Route
					exact
					path='/portal/:domain/billing'
					element={
						isPortal ? (
							<Missing />
						) : (
							<ProtectedRoute admin>
								<PortalView />
							</ProtectedRoute>
						)
					}
				/>

				<Route
					exact
					path='/profile'
					element={
						isPortal ? (
							<ProtectedRoute>
								<Profile2 />
							</ProtectedRoute>
						) : (
							<ProtectedRoute admin>
								<Profile />
							</ProtectedRoute>
						)
					}
				/>

				<Route
					exact
					path='/*'
					element={<p>Page does not exist.</p>}
				/>
			</Routes>
		</BrowserRouter>
	);
}
