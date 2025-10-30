import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import reportWebVitals from "./reportWebVitals";
import ThemeContext from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { LocationProvider } from "./context/LocationContext";
import "./i18n/i18n";
import { PermissionProvider } from "./admin/admincomponent/permission/PermissionContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeContext>
          <LocationProvider>
          {/* <PermissionProvider> */}
              <ToastContainer />
              <App />
            {/* </PermissionProvider> */}
          </LocationProvider>
        </ThemeContext>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
reportWebVitals();
