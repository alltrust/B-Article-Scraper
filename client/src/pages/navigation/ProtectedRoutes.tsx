import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/appContext";

interface ChildrenProps {
  children: JSX.Element;
}
const ProtectedRoutes = ({ children }: ChildrenProps) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to={"/register"} />;
  }
  return children;
};

export default ProtectedRoutes;
