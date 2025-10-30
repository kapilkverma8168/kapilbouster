import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Index from "./jsx";
import Login from "./jsx/pages/Login"; // Eager import for simplicity
import { adminloginApi } from "./services/AuthService";
import { SuperadminloginApi } from "./services/superadminService/SuperAdminAuthService";

// import Dashboard from './jsx/pages/Dashboard'; // Add your shared component
import "./css/style.css";
import CreateNewUser from "./admin/admincomponent/users/CreateNewUser";
import { PermissionProvider } from "./admin/admincomponent/permission/PermissionContext";
import ManualForm from "./admin/admincomponent/users/ManualForm";
import ApproveUserListing from "./admin/admincomponent/users/ApproveUserListing";
import QRCodeBackend from "./admin/admincomponent/permitUsers/QRCodeBackend";
import PublicRegistrationForm from "./admin/admincomponent/users/PublicRegistrationForm";
const SignUp = lazy(() => import("./jsx/pages/Registration"));
const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication state
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, [localStorage.getItem("access_token")]);

  // Shared routes for both authenticated and unauthenticated users
  const sharedRoutes = (
    <>
      {/* <Route path="/dashboard" element={<Dashboard isAuthenticated={isAuthenticated} />} /> */}
      <Route path="create-manual-user" element={<CreateNewUser />} />
      <Route path="qr-code" element={<QRCodeBackend/>}/>
      {/* <Route path="approve-users" element={<ApproveUserListing />} /> */}
      <Route path="media-registration" element={<PublicRegistrationForm />} />
      <Route path="manual-registration" element={<PublicRegistrationForm />} />

      <Route path="/admin-login" element={<Login apifun={adminloginApi} />} />
      <Route
        path="/super-admin-login"
        element={<Login apifun={SuperadminloginApi} />}
      />
    </>
  );

  // Routes for unauthenticated users
  const unauthenticatedRoutes = (
    <>
      <Route path="/" element={<Login apifun={adminloginApi} />} />

      <Route path="/page-register" element={<SignUp />} />
      <Route path="/page-forgot-password" element={<ForgotPassword />} />
    </>
  );

  // Render routes based on authentication state
  return (
    <div className="vh-100 paris">
      <Suspense
        fallback={
          <div id="preloader">
            <div className="sk-three-bounce">
              <div className="sk-child sk-bounce1"></div>
              <div className="sk-child sk-bounce2"></div>
              <div className="sk-child sk-bounce3"></div>
            </div>
          </div>
        }
      >
        <Routes>
          {sharedRoutes}
          {isAuthenticated ? (
            // Authenticated view

            <Route
              path="*"
              element={
                <PermissionProvider>
                  <Index />
                </PermissionProvider>
              }
            />
          ) : (
            // Unauthenticated routes
            unauthenticatedRoutes
          )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
