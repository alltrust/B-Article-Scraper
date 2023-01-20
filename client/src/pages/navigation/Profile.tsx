import { FormEvent, useRef } from "react";
import { Alert } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/ProfileWrapper";

const Profile = () => {
  const { user, showAlert, updateUser, displayAlert, clearAlert } =
    useAppContext();
  const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    
    const username = nameRef.current.value;
    const email = emailRef.current.value;

    const userData = { username, email };

    if (username.trim() === "" || email.trim() === "") {
      displayAlert("Please fill all fields", "danger");
    } else {
      updateUser(userData);
      displayAlert("Your profile is updated", "success");
    }

    clearAlert();
  };

  return (
    <Wrapper>
      <form onSubmit={submitHandler}>
        {showAlert && <Alert />}
        <div className="label-input-container">
          <div>
            <input
              type="text"
              name="name"
              id="name"
              ref={nameRef}
              defaultValue={user?.username}
              placeholder="username"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              ref={emailRef}
              defaultValue={user?.email}
              placeholder="E-mail"
            />
          </div>
          <button type="submit" className="btn">
            Update
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
