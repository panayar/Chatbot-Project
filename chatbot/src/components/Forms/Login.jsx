import React, {  useState } from "react";
import Logo from "../../images/Icons/robot-icon.svg";
import { login } from "../../redux/userSlice";
import { useLocation } from "wouter";
import "./Forms.scss";
import { Link } from "wouter";
import FormMenu from "../navBar/FormMenu";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [isLogged, setIsLogged] = useState(false);
  const [token , setToken] = useState(null);
  const [error, setError] = useState(null);

  const [, setLocation] = useLocation();

  const userLog = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsAlertVisible(false);
    setError(false);
    setIsLogged(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsAlertVisible(false);
    setError(false);
    setIsLogged(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setIsAlertVisible(true);
      return;
    }

    logUser({ email, password });

    console.log(userLog, "is LOGGED IN? in login");

    if (isLogged) {
      setLocation("/chat");
    }
  };

  const logUser = async (userData) => {
    try {
      const response = await fetch(
        "https://conversemos-backend.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      setIsLogged(data.Token !== null ? true : false);
      setError(data.Token === null ? true : false);
      setToken(data.Token);

      dispatch(login({ isLoggedIn: isLogged, token: token }));

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FormMenu />
      <div className="cont-form">
        <div className="form-container">
          <div className="row">
            <div className="col-12">
              <img className="form-icon" src={Logo} alt="Logo" />
              <h2 className="form-title">
                Welcome back! Glad <br /> to see you, Again!
              </h2>
            </div>
            <div className="col-12 mt-4">
              <form onSubmit={handleSubmit}>
                {isAlertVisible && (
                  <div className="alert alert-warning transition" role="alert">
                    Please enter both email and password.
                  </div>
                )}
                {isLogged && (
                  <div className="alert alert-success transition" role="alert">
                    Login successful!
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger transition" role="alert">
                    Invalid email or password.
                  </div>
                )}
                <div className="col-12">
                  <input
                    className="form-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="col-12">
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="col-12 mt-5">
                  <button type="submit" className="form-button">
                    Login
                  </button>
                </div>
              </form>
              <p className="form-text">
                <Link className="link-text" to="/forgotpass">
                  Forgot your password?
                </Link>{" "}
              </p>
            </div>
            <p className="form-text">
              Don't you have an account?{" "}
              <span className="form-span">
                <Link className="link-text" to="/register">
                  Register now
                </Link>{" "}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
