import {Outlet} from 'react-router-dom'

const SharedLayout = () => {
  return (
    <>
      <div>THIS IS SHARED</div>
      <Outlet />
    </>
  );
};

export default SharedLayout;
