import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Auth } from "../sections/Auth";
import { Dashboard } from "../sections/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { userStore } from "../store/UserStore";
import { decodeToken } from "../utils/decodeToken";
import { NotFound } from "../sections/NotFound";
import { Administration } from "../sections/Administration";
import { Loved } from "../sections/Loved";
import { roleEnum } from "../constants/types";

const roleBasedRouteAccess = (app_role: roleEnum) => {
  // Routes for both admin and user
  const commonRoutes = (
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="/loved" element={<Loved />} />
    </>
  );

  // Admin specific routes
  const adminRoutes = (
    <>
      <Route path="/admin" element={<Administration />} />
    </>
  );

  if (app_role === roleEnum.ADMIN) {
    return <>{commonRoutes}{adminRoutes}</>;
  } else if (app_role === roleEnum.USER) {
    return <>{commonRoutes}</>;
  } else {
    // Default to a fallback route for unknown roles
    return <Route path="/" element={<Dashboard />} />;
  }
};

const Router = observer(() => {
  const token = localStorage.getItem("__giftzaza__");
  let user: any;
  if (token) {
    user = decodeToken(token);
  }
  const user_role = userStore.user?.role || user?.user?.role;

  return (
    <Routes>
      <Route path={"/login"} element={<Auth />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/" element={<ProtectedRoute />}>
        {roleBasedRouteAccess(user_role)}
      </Route>
      <Route path="*" element={<Navigate to="/404" />} /> 
    </Routes>
  );
});

export default Router;
