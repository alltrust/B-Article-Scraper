import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/navbarcontainer";

const SideNav = () => {
  const { user } = useAppContext();
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
        end
      >
        Articles
      </NavLink>
      <NavLink
        to={"/profile"}
        className={({ isActive }) =>
          isActive ? `${activeClassName} primary-nav` : linkClass
        }
        end
      >
        Profile
      </NavLink>
    </Wrapper>
  );
};

export default SideNav;
