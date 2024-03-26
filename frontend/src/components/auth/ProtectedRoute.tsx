import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { decodeToken } from "../../utils/decodeToken";
import { userStore } from "../../store/UserStore";
// import { decodeToken } from './decodeToken';
// import { userStore } from '../store/store';

const ProtectedRoute = () => {
  const {setUser} = userStore;
  const token = localStorage.getItem("access_giftalia");

  useEffect(() => {

    if (token) {
      const user: any = decodeToken(token);
      setUser(user?.user);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
