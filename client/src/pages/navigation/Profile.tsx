import { FormEvent } from "react";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/ProfileWrapper";

const Profile = () => {
  const { user } = useAppContext();

  const userItem = localStorage.getItem("user");
  const tokenItem = localStorage.getItem("token");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Wrapper>
      <form onSubmit={submitHandler}>
        <div className="label-input-container">
          <div>
            <label htmlFor="name" className="name">
              Username:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={user?.username}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={user?.email}
            />
          </div>
          <div>
            <label htmlFor="passowrd" className="password">
              Password:
            </label>
            <input type="password" name="password" id="password" />
          </div>
        </div>
        <button type="submit" className="btn">
          Update
        </button>
      </form>
    </Wrapper>
  );
};

export default Profile;
