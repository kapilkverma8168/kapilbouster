import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { EyePasswordBtn } from "../../common/ui/view/CustomEyePasswordBtn";
import loginbg from "../../images/pic1.png";
import logo from "../../images/AquaticsLogoCollapsed.png";
import notify from "../../utils/notification";

function Login({ props, apifun }) {
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  // const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [emailValidated, setEmailValidated] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRetryDisabled, setIsRetryDisabled] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [isResendSubmitting, setIsResendSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    // password: "",
    otp: "",
  });

  const startRetryTimer = (seconds = 60) => {
    // Ensure the input is a positive number
    const validSeconds = typeof seconds === 'number' && seconds > 0 ? seconds : 60;
    
    setIsRetryDisabled(true);
    setCountdown(validSeconds);
  };


  
  
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsRetryDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSignupApiCall = (e) => {
    console.log("signup btn click");
  };

  const handleForgetPasswordApiCall = (e) => {
    console.log("forget btn click");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (isEmailSubmitting) return;
    let error = false;
    const errorObj = { ...errorsObj };
    if (loginData.email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    // if (loginData.password === "") {
    //   errorObj.password = "Password is Required";
    //   error = true;
    // }
    setErrors(errorObj);
    if (error) {
      return;
    }
    const data = {
      email: loginData?.email,
      // password: loginData?.password,
    };

    console.log(process.env.REACT_APP_BASE_URL)

    try {
      setIsEmailSubmitting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/emailValidate`,
        data
      );
      if (response?.status === 200) {
        setEmailValidated(true);
        const otpExpiresAt = response.data?.otp_expires_at;
        
        // Convert otpExpiresAt to a number (timestamp)
        const expirationTimestamp = new Date(otpExpiresAt).getTime();
        const currentTime = Date.now();
        
        // Calculate remaining time
        const remainingTime = Math.max(0, Math.ceil((expirationTimestamp - currentTime) / 1000) - 240);
        
        // Start the timer with the calculated remaining time
        startRetryTimer(remainingTime);
        
        notify("success", response.data.message);
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        notify("error", error.response.data.message);
      } else {
        notify("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsEmailSubmitting(false);
    }
  };
  // console.log(countdown);

  const loginOTPSubmit = async (e) => {
    e.preventDefault();
    if (isOtpSubmitting) return;
    let error = false;
    const errorObj = { ...errorsObj };
    if (loginData.email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    // if (loginData.password === "") {
    //   errorObj.password = "Password is Required";
    //   error = true;
    // }
    if (loginData.otp === "") {
      errorObj.password = "OTP is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }
    const data = {
      email: loginData?.email,
      // password: loginData?.password,
      otp: loginData?.otp,
    };
    try {
      setIsOtpSubmitting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        data
      );
      if (response?.status === 200) {
        notify("success", response.data.message);
        const loginDetails = response?.data;
        const token = response?.data?.authorisation?.token;

        localStorage.setItem("access_token", token);
        localStorage.setItem("login_Details", JSON.stringify(loginDetails));
        window.dispatchEvent(new Event('login'));
        setToken(token);
        Navigate("/approve-users", { replace: true });
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        notify("error", error.response.data.message);
      } else {
        notify("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  const RetryOTPSubmit = async (e) => {
    e.preventDefault();
    if (isResendSubmitting || isRetryDisabled) return;
    let error = false;
    const errorObj = { ...errorsObj };
    if (loginData.email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    // if (loginData.password === "") {
    //   errorObj.password = "Password is Required";
    //   error = true;
    // }
    setErrors(errorObj);
    if (error) {
      return;
    }
    const data = {
      email: loginData?.email,
      // password: loginData?.password,
    };

    try {
      setIsResendSubmitting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/retryOTP`,
        data
      );
      if (response?.status === 200) {
        startRetryTimer(); // Start the timer when OTP is resent
        notify("success", response.data.message);
      } else {
        notify("error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        notify("error", error.response.data.message);
      } else {
        notify("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsResendSubmitting(false);
    }
  };

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      <div className="login-aside text-center  d-flex flex-column flex-row-auto">
        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-4 pt-5">
            <img src={logo} alt="" style={{ width: "140px" }} />
          </div>
          <h3 className="mb-2">Welcome back!</h3>
          <h5>Welcome to 11th Asian Aquatics Championship</h5>
          <h5>Explore, Manage, and Achieve!</h5>
        </div>
        <div
          className="aside-image"
          style={{ backgroundImage: "url(" + loginbg + ")" }}
        ></div>
      </div>
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div id="sign-in" className="auth-form form-validation">
                  {props?.errorMessage && (
                    <div className="bg-red-300 text-red-900 border border-red-900 p-1 my-2">
                      {props?.errorMessage}
                    </div>
                  )}
                  {props?.successMessage && (
                    <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                      {props?.successMessage}
                    </div>
                  )}
                  {!emailValidated && (
                    <form onSubmit={loginSubmit} className="form-validate">
                      <h3 className="text-center mb-4 text-black">
                        Sign in your account
                      </h3>
                      <div className="form-group mb-3">
                        <label className="mb-1" htmlFor="val-email">
                          <strong>Email</strong>
                        </label>
                        <div>
                          <input
                            type="email"
                            className="form-control"
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="Type Your Email Address"
                            name="email"
                          />
                        </div>
                        {errors.email && (
                          <div className="text-danger fs-12">{errors.email}</div>
                        )}
                      </div>
                      {/* <div className="form-group mb-3">
                        <label className="mb-1">
                          <strong>Password</strong>
                        </label>
                        <div className="password-input-container">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={loginData.password}
                            name="password"
                            placeholder="Type Your Password"
                            onChange={handleChange}
                          />
                          <EyePasswordBtn
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                          />
                        </div>
                        {errors.password && (
                          <div className="text-danger fs-12">{errors.password}</div>
                        )}
                      </div> */}
                      
                      
                      <div className="text-center form-group mb-3">
                        <button type="submit" className="btn btn-primary btn-block" disabled={isEmailSubmitting}>
                          Submit
                        </button>
                      </div>
                    </form>
                  )}

                  {emailValidated && (
                    <form className="form-validate">
                      <h3 className="text-center mb-4 text-black">
                        Sign in your account
                      </h3>
                      <div className="form-group mb-3">
                        <label className="mb-1" htmlFor="val-email">
                          <strong>Enter OTP sent to Your Email</strong>
                        </label>
                        <div>
                          <input
                            type="text"
                            className="form-control"
                            value={loginData.otp}
                            onChange={handleChange}
                            placeholder="Enter your OTP"
                            name="otp"
                          />
                        </div>
                        {errors.otp && (
                          <div className="text-danger fs-12">{errors.otp}</div>
                        )}
                      </div>
                      <div className="text-center form-group mb-3">
                        {countdown > 0 && (
                          <div className="text-primary mb-2">
                            Resend OTP in: {formatTime(countdown)}
                          </div>
                        )}
                        <div className="d-flex">
                          <button
                            type="submit"
                            className="btn btn-primary btn-md w-100 m-2"
                            onClick={loginOTPSubmit}
                            disabled={isOtpSubmitting}
                          >
                            Sign In
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary btn-md w-100 m-2"
                            onClick={RetryOTPSubmit}
                            disabled={isRetryDisabled || isResendSubmitting}
                          >
                            Resend OTP
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state?.auth?.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);