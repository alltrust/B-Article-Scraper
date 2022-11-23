import { ChangeEvent, FormEvent, useState } from "react";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/registerContainer";

interface IUser {
  email: string;
  username: string;
  password: string;
}

const initialUserValue: IUser = {
  email: "",
  username: "",
  password: "",
};

const Register = () => {
  const { setupUser} = useAppContext();

  const [userValue, setUserValue] = useState(initialUserValue);
  const { email, username, password } = userValue;

  const setUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserValue({ ...userValue, [e.target.name]: e.target.value });
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    //showAlert boolean, alerttext, alertType
    //check if member (and toggle isMember through useState)
    //put all labels and inputs into component 

    const userData = {
      email: email,
      username: username,
      password: password,
    };
    setupUser(userData);
    
    //show alert if error and alert if succeeded

    //useNavigate to "/" (scrape) page if succeeded
  };

  return (
    <Wrapper>
      <form onSubmit={submitHandler} className="form">
        <h3>Register/Login</h3>
        <div>
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
        <button className="btn" type="submit">REGISTER/SIGNIN</button>
      </form>
    </Wrapper>
  );
};

export default Register;
