import { Outlet } from "react-router-dom";
import { SideNav } from "../../components";
import Wrapper from "../../assets/wrappers/SharedContainer";

const SharedLayout = () => {
  //display navigation on the left hand side with scrape, articles, profile
  //users name at the top with maybe a logo (goodmorning, good afternoon, good evening with name)
  //logout button accessible from all pages

  return (
    <Wrapper>
      <div className="dashboard">
        <SideNav />
      </div>
      <div className="nav-page">
        <Outlet />
      </div>
    </Wrapper>
  );
};

export default SharedLayout;
