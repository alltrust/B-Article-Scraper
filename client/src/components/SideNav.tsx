import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/navbarcontainer";

const SideNav = () => {
  const { user, logoutUser } = useAppContext();
  const username = user?.username;

  const activeClassName = "active";
  const linkClass = "nav-link";

  return (
    <Wrapper>
      <h3>{username}</h3>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          isActive ? `${activeClassName} primary-nav` : linkClass
        }
        end
      >
        Scraper
      </NavLink>
      <NavLink
        to={"/articles"}
        className={({ isActive }) =>
          isActive ? `${activeClassName} primary-nav` : linkClass
        }
      >
        Articles
      </NavLink>
      <NavLink
        to={"/profile"}
        className={({ isActive }) =>
          isActive ? `${activeClassName} primary-nav` : linkClass
        }
      >
        Profile
      </NavLink>
      <button className="btn logout-btn" onClick={logoutUser}>
        LOGOUT
      </button>
    </Wrapper>
  );
};

export default SideNav;
