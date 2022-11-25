import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { Alert } from "../components";
import Wrapper from "../assets/wrappers/registerContainer";
import { useNavigate } from "react-router-dom";

interface IUser {
  email: string;
  username: string;
  password: string;
  isMember: boolean;
}

const initialUserValue: IUser = {
  email: "",
  username: "",
  password: "",
  isMember: false,
};

const Register = () => {
  const { user, setupUser, showAlert, clearAlert, displayAlert } =
    useAppContext();

  const [userValue, setUserValue] = useState(initialUserValue);
  const { email, username, password, isMember } = userValue;
  const navigate = useNavigate();

  const setUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserValue({ ...userValue, [e.target.name]: e.target.value });
  };

  const toggleIsMember = () => {
    setUserValue((prevValue) => {
      return { ...prevValue, isMember: !userValue.isMember };
    });
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    const alertMsgSuccess = {
      text: "Successful Login...loading your scaper",
      type: "success",
    };
    const alertMsgFail = {
      text: "Please fill in all fields",
      type: "danger",
    };

    const userData = {
      email: email,
      username: username,
      password: password,
    };
    if (!password) {
      const text = "don't leave password blank";
      displayAlert(text, alertMsgFail.type);
      return clearAlert();
    }
    if (isMember && (email || username)) {
      displayAlert(alertMsgSuccess.text, alertMsgSuccess.type);
      setupUser(userData, "login");
    } else if (!isMember && email && username) {
      displayAlert(alertMsgSuccess.text, alertMsgSuccess.type);
      setupUser(userData, "register");
    } else {
      displayAlert(alertMsgFail.text, alertMsgFail.type);
    }

    clearAlert();
  };
  
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Wrapper>
      <form onSubmit={submitHandler} className="form">
        <h3>{!isMember ? "Register" : "login"}</h3>
        <div>
          {showAlert && <Alert />}
          <div className={isMember ? "show-border" : ""}>
            <div className="label-input-container">
              <label className="input-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={setUserInput}
              />
            </div>
            {isMember && <p>OR</p>}
            <div className="label-input-container">
              <label className="input-label" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={setUserInput}
              />
            </div>
          </div>
          <div className="label-input-container">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={setUserInput}
            />
          </div>
        </div>
        <button className="btn" type="submit">
          {!isMember ? "SIGN-UP" : "SIGN-IN"}
        </button>
        <div className="register-login-btn-container">
          {!isMember ? "Already a member?" : "Not a member yet? "}
          <p onClick={toggleIsMember} className="link">
            {!isMember ? " Login " : " Register "}
          </p>
          here.
        </div>
      </form>
    </Wrapper>
  );
};

export default Register;
